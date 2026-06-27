# Next.js Best Practices for E-commerce / Real Estate Sites

## Key Points

- **Code Splitting**: Use dynamic imports for heavy components (maps, image galleries, modals) to reduce initial bundle size
- **SEO First**: Every property page must have unique meta titles, descriptions, and structured data (JSON-LD) for search engines
- **Performance Budget**: Keep Largest Contentful Paint (LCP) under 2.5s; optimize images with next/image and appropriate formats (WebP/AVIF)
- **Caching Strategy**: Use ISR (Incremental Static Regeneration) for property listings to serve fast static pages that update periodically
- **Security**: Validate all form inputs on the server, sanitize user-generated content, and never expose raw API keys in client code

---

## Ideas & Recommendations

### Architecture & Structure

- Follow the App Router conventions: colocate server components with their data-fetching logic, and keep client components minimal (marked with `"use client"` only when needed)
- Organize the project by feature (properties, favorites, search) rather than by file type; use route groups `(auth)`, `(shop)` to share layouts without affecting URLs
- Keep business logic in `lib/` or `src/lib/` utilities and custom hooks, not inside UI components
- Use Server Actions for mutations (contact forms, favorites toggles, inquiries) to avoid manual API route boilerplate

### Data Fetching

- Fetch data in Server Components whenever possible; avoid client-side fetching for initial page data
- Use parallel data fetching with `Promise.all` for independent property lists (e.g., featured + latest listings)
- Implement proper loading and error states with Suspense boundaries and error.tsx files
- Cache static assets and API responses aggressively; use `next: { revalidate }` for ISR and `no-store` for real-time data

### Images & Media

- Always use `<Image>` from `next/image` with explicit `width` and `height`, or `fill` with parent containers using `relative` positioning and `object-cover`
- Provide descriptive `alt` text for accessibility and SEO
- Lazy-load below-the-fold images with `loading="lazy"` (though `<Image>` does this by default below the fold)
- Use blur placeholders (`placeholder="blur"`) for a polished loading experience on property cards

### Forms & User Input

- Prefer controlled components with React state for forms; debounce search inputs (300ms is standard) to reduce API calls
- Use Server Actions for form submissions instead of client-side `fetch` when possible
- Implement proper validation with Zod or similar libraries on both client and server
- Show clear, accessible validation errors near the relevant fields

### State Management

- Avoid prop drilling; use React Context for global UI state (theme, mobile menu, filters drawer)
- For server state (property data, user favorites), rely on Server Components + caching; use URL search params for shareable filter state
- Keep client-side state minimal; Zustand or Jotai are suitable if global client state grows complex

### Accessibility & UX

- Ensure all interactive elements are keyboard-navigable (buttons, links, cards)
- Use semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`) inside components
- Maintain sufficient color contrast (WCAG AA minimum) for text over backgrounds, especially on property cards and CTAs
- Provide `aria-label` for icon-only buttons (favorites heart, search icon, close buttons)

### Internationalization

- If supporting multiple languages, use `next-intl` or the built-in i18n routing; extract all user-facing strings from components
- Ensure currency, date, and number formatting adapts to locale; use `Intl.NumberFormat` for prices

### Testing & Quality

- Write component tests with React Testing Library or Playwright for critical flows (search, property detail, contact form)
- Use `npm run lint` and `npm run typecheck` in CI; fix warnings before they become errors
- Test Core Web Vitals locally with the Next.js Analytics plugin or Lighthouse CI

### Deployment & Observability

- Enable Next.js Output Standalone mode for optimized Docker deployments
- Use environment variables for API endpoints and third-party keys; prefix public variables with `NEXT_PUBLIC_`
- Instrument errors and performance metrics with Vercel Analytics or a custom Web Vitals observer

---

## Checklist Before Shipping a Page

- [ ] Unique `metadata` export (title, description, Open Graph image) defined in page or layout
- [ ] No `console.log` or debug statements in production code
- [ ] Images optimized with `<Image>` and correct dimensions
- [ ] Loading and error states implemented
- [ ] Form validation covers empty fields, email format, and message length
- [ ] No `any` types; TypeScript strict mode passes
- [ ] Mobile responsive (tested at 320px, 768px, 1024px breakpoints)
- [ ] Keyboard navigation works for primary user flows
- [ ] ESLint passes with zero errors

---

## Real Estate Specific Recommendations

### Property Data Model

- Design a TypeScript interface for properties that includes essential fields: `id`, `title`, `description`, `price`, `currency`, `address` (with `city`, `state`, `zip`), `coordinates` (lat/lng for maps), `bedrooms`, `bathrooms`, `sqft`, `lotSize`, `yearBuilt`, `propertyType`, `status` (active/sold/pending), `amenities` (array), `features` (array), `images` (array with thumbnail + gallery), `agentId`, `listedAt`, `updatedAt`
- Use `zod` schemas to validate property data at the API boundary; never trust external data without parsing
- Store standardized currency codes (USD, EUR, etc.) and use `Intl.NumberFormat` for rendering prices in the user's locale

### Search & Filtering

- Implement URL-synced search params for all filters (minPrice, maxPrice, beds, baths, type, location) so users can share and bookmark results
- Debounce free-text search inputs (300ms) and trigger searches on Enter as well for accessibility
- Use server-side filtering when possible; fetch filtered results with `Promise.all` for property data and aggregated facets (price ranges, bedroom counts)
- Provide clear "no results" states with suggested alternatives (e.g., expanding the search radius or price range)

### Image Strategy

- Use a CDN or image optimization service that can generate multiple sizes on demand; serve smaller thumbnails (400x300) for list views and larger (1200x800) for detail pages
- Implement a lazy-loaded image gallery on property detail pages with keyboard navigation and touch swipe support
- Include floor plans and virtual tour links as part of the media array; mark them with `type: 'tour' | 'floorplan'` so the UI can render appropriate viewers
- Generate blur placeholders for gallery images to prevent layout shift and improve perceived performance

### Maps & Location

- Use an interactive map component (Leaflet, Mapbox, or Google Maps) that syncs with the search filters; show property markers with price labels
- Cluster markers in dense areas to avoid DOM overload; implement marker pagination for large datasets
- Include "Nearby" sections: schools, hospitals, transit, and points of interest fetched from a Places API when viewing a property detail
- Always load the map script dynamically (`next/dynamic`) to avoid blocking initial page render

### Lead Capture & Inquiries

- Keep contact forms short: name, email, phone, and message are the minimum; pre-fill property ID and address from the page context
- Use Server Actions for inquiry submissions; return success/error states without a full page reload
- Implement a "Schedule Viewing" flow with a date/time picker; validate that selected slots are within agent availability
- Track conversion events (form submit, phone click, "Save" favorite) with a privacy-respecting analytics tool

### Trust & Social Proof

- Display agent information (photo, license number, bio, contact methods) on every property card and detail page
- Show "Verified Listing" badges for properties with validated ownership documents
- Include last-updated timestamps and "Price Changed" labels so buyers trust the data freshness
- Add recent buyer testimonials or neighborhood stats (average days on market, price per sqft) for context

### Performance for Large Catalogs

- Paginate or virtualize property lists; avoid rendering hundreds of property cards at once
- Use `next/image` with `sizes` attribute to serve appropriately sized images based on viewport
- Implement skeleton loaders that match the actual card layout to prevent Cumulative Layout Shift (CLS)
- Cache static amenity lists and neighborhood data; only fetch dynamic property data on each request

### Local SEO

- Add JSON-LD structured data for RealEstateListing, including `floorSize`, `offers` (price, availability), and `address` on every property page
- Create location-specific landing pages for neighborhoods and cities; use dynamic routes like `/properties/[city]/[slug]`
- Include Open Graph and Twitter Card tags with property images so listings look rich when shared on social media
- Generate auto-generated sitemaps for property pages and submit them to Google Search Console

### Saved Properties & Alerts

- Allow users to save favorite properties without requiring an account for the first few saves; use `localStorage` or cookies for anonymous users
- Sync favorites to a user profile once authenticated; keep the transition seamless
- Implement saved search alerts with email notifications; let users specify frequency (daily/weekly) and criteria
- Show a "New Listing" badge for properties added since the user's last visit to saved searches
