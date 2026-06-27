# Luxe Estate — Skills & Development Guide

This document describes **how to work on this project**: conventions, patterns, gotchas, and step-by-step workflows. It complements `memory.md` (what was done) by focusing on **how to do things**.

---

## 1. Tech Stack & Versions

| Tool | Version | Notes |
|------|---------|-------|
| Next.js | 16.2.9 | App Router, Turbopack in dev |
| React | 19.2.4 | Server Components by default |
| TypeScript | 5 | Strict mode recommended |
| Tailwind CSS | v4 | PostCSS-based, custom config via `tailwind.config.ts` |
| Supabase | `@supabase/supabase-js` ^2.108.2 | Client in `lib/supabase.ts` |
| Leaflet | latest | `leaflet` + `@types/leaflet` for maps |
| ESLint | 9 | `eslint-config-next` |

---

## 2. Project Structure

The project follows **Next.js 16 App Router** conventions with feature-based organization.

```
app/
  layout.tsx              # Root layout (Material Icons loaded in <head>)
  page.tsx                # Home page (featured + market listings)
  globals.css             # Global styles
  properties/[slug]/
    page.tsx              # Server Component (fetches data)
    PropertyGallery.tsx   # Client component for image gallery
    loading.tsx           # TODO
    error.tsx             # TODO

components/
  layout/
    Navbar/               # Sticky nav (server + client for mobile menu)
    Footer/               # Simple footer
  property/
    FeaturedCard/         # Horizontal card for featured listings
    PropertyCard/         # Vertical card for market listings
    SearchFilters/        # Search bar + filter pills
    PropertyMap.tsx       # ← Leaflet map client component

lib/
  supabase.ts             # Supabase client initialization
  properties.ts           # Data fetching: getPropertyBySlug, getFeaturedProperties, getMarketProperties

types/
  property.ts             # Property (UI) + PropertyRow (DB) + toProperty()

__tests__/
  mock_data/
    properties.ts         # 18 mock properties with lat/lng

supabase/migrations/      # SQL migrations (timestamped files)

antigravity/
  resources/              # Design reference screenshots (code.html)
  memory.md               # Project history & decisions
  skills.md               # ← This file
```

**Key convention**: Server Components by default. Add `"use client"` only at the top of files that need interactivity (event handlers, `useState`, `useEffect`, browser APIs like Leaflet).

---

## 3. Design System (Tailwind v4)

Colors are defined in `tailwind.config.ts` and accessed as utility classes:

| Class | Color | Hex | Usage |
|-------|-------|-----|-------|
| `text-nordic` / `bg-nordic` | Nordic | #19322F | Dark text, headers |
| `text-mosque` / `bg-mosque` | Mosque | #006655 | Primary buttons, accents |
| `bg-clear-day` | Clear Day | #EEF6F6 | Page background |
| `bg-primary` | Mosque | #006655 | Same as mosque (primary alias) |
| `text-primary-hover` | Mosque dark | #005544 | Hover states |
| `bg-primary-light` | Light mosque | #E6F0EE | Subtle backgrounds |
| `bg-neutral-surface` | White | #FFFFFF | Card backgrounds |
| `text-nordic-muted` | Muted nordic | — | Secondary text (opacity-based) |

**Typography**:
- Font family: `font-display` = Inter (Google Fonts loaded in root layout)
- Weights: 300 (light), 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

**Border radius**:
- Default: `rounded` = 0.5rem
- Large: `rounded-lg` = 1rem
- Extra large: `rounded-xl` = 1.5rem
- Full: `rounded-full` = 9999px

**Shadows**:
- `shadow-sm` — subtle card shadows
- `shadow-soft` — used in card hover states
- `shadow-lg shadow-mosque/20` — colored shadows for CTAs

---

## 4. Data Layer Patterns

### Type Definitions (`types/property.ts`)

Two interfaces exist:
- **`Property`**: The shape used everywhere in components. All optional fields use `?:`.
- **`PropertyRow`**: Maps 1:1 to Supabase table columns (snake_case). Lat/lng are **optional** because existing DB rows may not have them.

```ts
export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  area: number;
  type: 'house' | 'apartment' | 'villa' | 'penthouse';
  status: 'sale' | 'rent';
  slug: string;
  images: string[];
  isExclusive?: boolean;
  isNewArrival?: boolean;
  featured?: boolean;
  lat?: number;    // ← NEW
  lng?: number;    // ← NEW
}
```

**Critical**: `toProperty()` maps `PropertyRow` → `Property`. Always update it when adding new DB columns.

### Fetching Data (`lib/properties.ts`)

All data fetching functions are **async server functions** that query Supabase directly:

```ts
// Single property by slug
const property = await getPropertyBySlug(slug);

// Featured properties
const featured = await getPropertyBySlug();

// Paginated + filtered market listings
const { data, count } = await getMarketProperties({
  page: 0,
  pageSize: 6,
  type: 'house',
  status: 'buy',
  search: 'Seattle',
});
```

**Pattern**: Return `null` for not-found, `[]` for empty lists. Error handling logs to console and returns safe defaults.

### Adding a New Property Field

1. Add to `PropertyRow` (required if DB column exists)
2. Add to `Property` (optional, marked with `?:`)
3. Add to `toProperty()` mapping
4. Add to mock data in `__tests__/mock_data/properties.ts`
5. If needed, create a new migration in `supabase/migrations/`

---

## 5. Page Patterns

### Server Pages (default)

`app/page.tsx` and `app/properties/[slug]/page.tsx` are **Server Components** — no `"use client"`.

```tsx
// app/properties/[slug]/page.tsx
export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;  // ← Next.js 16: params is a Promise
  const property = await getPropertyBySlug(slug);
  
  if (!property) notFound();
  
  // ... render JSX directly (no useState, no useEffect)
}
```

**Important**: In Next.js 16, `params` is always `Promise<{...}>`. Always `await params` before destructuring.

### Client Components

Mark with `"use client"` at the very top (line 1). Used for:
- Leaflet maps (`PropertyMap.tsx`)
- Interactive galleries with state
- Forms with client-side validation
- Anything using `useState`, `useEffect`, event handlers, browser APIs

---

## 6. Leaflet Map Integration

The `PropertyMap` component (`components/property/PropertyMap.tsx`) is a **client component** that:

1. Uses `useRef` for the map container and map instance
2. Initializes the map in `useEffect`
3. Uses CARTO light tiles (matches the app's minimalist aesthetic)
4. Renders a custom `L.divIcon` marker styled with mosque color (`#006655`)

**Gotchas**:
- Must import `"leaflet/dist/leaflet.css"` explicitly
- Map container must have explicit dimensions (`aspect-[4/3]`, `w-full`)
- Cleanup: `map.remove()` in useEffect return function
- Default Leaflet markers require external images — use `L.divIcon` with custom HTML instead

**How to use**:
```tsx
import PropertyMap from "@/components/property/PropertyMap";

<PropertyMap
  lat={property.lat}
  lng={property.lng}
  title={property.title}
  location={property.location}
/>
```

---

## 7. Image Handling

Current state: using raw `<img>` tags with external Google image URLs.

**Why not `<Image>` yet**: Requires configuring `remotePatterns` in `next.config.js` for external domains.

**To migrate to next/image**:
1. Create/update `next.config.ts`:
```ts
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};
```
2. Replace `<img src={...} alt={...} />` with `<Image src={...} alt={...} width={800} height={600} />`

---

## 8. Styling Conventions

- **Max width**: `max-w-7xl mx-auto` for page containers
- **Padding**: `px-4 sm:px-6 lg:px-8`
- **Spacing between sections**: `space-y-4`, `space-y-6`, `space-y-8`
- **Section cards**: `bg-white p-8 rounded-xl shadow-sm border border-mosque/5`
- **Card hover**: `hover:shadow-soft transition-all duration-300`
- **Buttons**: `bg-mosque hover:bg-primary-hover text-white` (primary), `bg-transparent border border-nordic/10` (secondary)
- **Responsive grid**: `grid-cols-1 lg:grid-cols-12` for page layouts; `lg:col-span-8` + `lg:col-span-4` for detail pages
- **Sticky sidebar**: `sticky top-28 space-y-6`

---

## 9. Common Tasks

### Adding a new property

1. Add entry in `__tests__/mock_data/properties.ts` with all fields including `lat`/`lng`
2. Run the migration SQL (or add a new migration file)

### Creating a new page

1. Create folder under `app/` (e.g., `app/about/page.tsx`)
2. Add `"use client"` only if needed
3. Use `Navbar` and `Footer` components
4. Use `bg-clear-day` for background, `max-w-7xl mx-auto` for container

### Adding a client component

1. Create under `components/` (match existing folder structure)
2. Add `"use client"` as first line
3. Import from `"leaflet"` or other browser-only libs only here
4. Export default

### Running the app

```powershell
npm run dev      # Development (Turbopack)
npm run build    # Production build
npm run lint     # ESLint
npx tsc --noEmit # TypeScript check
```

---

## 10. Known Gotchas

1. **Next.js 16 params are Promises**: Always `await params` in dynamic routes.
2. **PropertyRow vs Property**: `PropertyRow` is snake_case (DB); `Property` is camelCase (UI). Use `toProperty()` to convert.
3. **Leaflet + SSR**: Must be a client component. Will throw if rendered server-side.
4. **Tailwind v4 config**: Custom colors are in `tailwind.config.ts`, not `tailwind.config.js`. PostCSS plugin format.
5. **Image external URLs**: Using `<img>` instead of `<Image>` due to missing `next.config.ts` remote patterns.
6. **Optional coordinates**: Not all properties have `lat`/`lng`. The map component shows a fallback when missing.

---

## 11. Git & Deployment Conventions

- Commit messages: imperative mood, lowercase, concise
  - ✅ "add leaflet map to property detail page"
  - ❌ "Added the map component"
- Never commit `.env.local` or secrets
- Migrations are versioned SQL files in `supabase/migrations/`
- Design references are in `antigravity/resources/` — do not modify these

---

## 12. Testing Strategy

- No formal test suite yet (no `*.test.ts` / `*.spec.ts` files)
- Mock data in `__tests__/mock_data/properties.ts` is the source of truth for local dev
- Supabase is the production DB — always keep data layer types in sync with migrations
- Before committing: run `npm run lint && npx tsc --noEmit && npm run build`
