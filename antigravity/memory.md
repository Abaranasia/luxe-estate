# Luxe Estate — Project Memory

## Project Goal
Build a premium, minimalist real estate app using **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Supabase**. Follow design specs from the `antigravity/resources/` reference screenshots.

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Nordic Dark | `#19322F` | Dark text, headers, navigation |
| Nordic Muted | `#5C706D` | Secondary text, muted elements |
| Mosque | `#006655` | Primary actions, accents, badges |
| Clear Day | `#EEF6F6` | App background, card backgrounds |
| Hint of Green | `#D9ECC8` | Soft cards / highlighted surfaces |

- Font: SF Pro Display (system stack) with Inter planned from Google Fonts
- Material Icons + Material Symbols Outlined for iconography
- Shadows: soft, minimal (`shadow-sm`, `shadow-soft`, `shadow-card`)

---

## Current Branch State

### ✅ Completed

#### 1. Project Setup
- Next.js 16.2.9 + React 19.2.4 + TypeScript 5 + Tailwind v4 (via PostCSS in `app/globals.css`)
- ESLint 9 configured
- Supabase client wired up (`lib/supabase.ts`)
- Root layout with Material Icons + Material Symbols loaded globally

#### 2. Design System (Tailwind v4)
- Extended `app/globals.css` with custom colors: `nordic-dark`, `nordic-muted`, `mosque`, `hint-of-green`, `clear-day`, `background-light`, `background-dark`
- Extended font family: `font-display` and `font-sans` (SF Pro Display)
- Dark mode support via `darkMode: "class"` (not yet wired to a toggle)

#### 3. Layout Components
- **Navbar** (`components/layout/Navbar/Navbar.tsx`): Sticky top nav with logo, links (Buy / Rent / Sell / Saved Homes), search icon, notification bell, user avatar pill. Mobile hamburger menu included.
- **Footer**: Integrated in property detail page (`app/properties/[slug]/page.tsx`)

#### 4. Property Data Layer
- **Types** (`types/property.ts`): `Property` (UI-facing) and `PropertyRow` (Supabase row) interfaces. Includes: `id`, `title`, `location`, `price`, `beds`, `baths`, `area`, `type`, `status`, `slug`, `images`, `isExclusive`, `isNewArrival`, `featured`, `lat`, `lng`, `amenities`.
- **DB Functions** (`lib/properties.ts`):
  - `getPropertyBySlug(slug)` → `Property | null`
  - `getFeaturedProperties()` → `Property[]`
  - `getMarketProperties(options)` → paginated, filtered `Property[]` (supports: type, status, search, location, minPrice, maxPrice, beds, baths, amenities)
- **Mock Data** (`__tests__/mock_data/properties.ts`): 38 properties (5 featured, 33 market) with coordinates and amenities.

#### 5. Database Migrations (`supabase/migrations/`)
| File | Purpose |
|------|---------|
| `20240101_add_slug_and_images.sql` | Added `slug` (unique) and `images` (text[]) columns |
| `20240102_populate_slugs_and_images.sql` | Populated slugs and image URLs for all properties |
| `20240627_add_lat_lng.sql` | Added `lat`/`lng` (numeric) columns and populated coordinates |
| `20240628_add_amenities_and_new_properties.sql` | Added `amenities` column, populated amenities for existing, inserted 20 new properties |

#### 6. Home Page (`app/page.tsx`)
- Simplified to wrap `MarketListings` component
- Uses Tailwind v4 CSS-first configuration

#### 7. Property Cards
- **FeaturedCard** (`components/property/FeaturedCard/FeaturedCard.tsx`): Horizontal card with image, badges (Exclusive/New Arrival), favorite button (heart), price, title, location, bed/bath/area icons.
- **PropertyCard** (`components/property/PropertyCard/PropertyCard.tsx`): Vertical card with image, favorite button (heart), status tag (FOR SALE / FOR RENT), price, title, location, bed/bath/area display.
- **SearchFilters** (`components/property/SearchFilters/SearchFilters.tsx`): Hero headline, search input, property type filter pills, and "Filters" button that opens advanced modal.
- **FiltersModal** (`components/property/FiltersModal.tsx`): Modal with location input, price range inputs, bedrooms/bathrooms steppers, amenities chips (Swimming Pool, Gym, Parking, Air Conditioning, Wifi, Deck), clear/apply buttons. Closes on escape key, click-outside, or close button.

#### 8. MarketListings (`components/property/MarketListings/index.tsx`)
- Client component managing state for filters, favorites, pagination
- Featured Properties grid displayed separately when no filters active (2-column layout)
- Market Listings grid with 4-column desktop / 2-column mobile responsive layout
- Infinite scroll: "Load more properties" button with loading spinner
- Loading skeletons (6 placeholders) during initial fetch
- Empty state with "domain_disabled" icon and "Reset Filters" button
- Search filters synced to URL params (TODO)

#### 9. Property Detail Page (`app/properties/[slug]/page.tsx`)
- Metadata with dynamic title/description
- **PropertyGallery** (`app/properties/[slug]/PropertyGallery.tsx`): Hero image with thumbnail strip, lightbox view, side dots navigation
- **Property Features**: 4-column grid (sq meters, beds, baths, garage)
- **About this home**: Description block
- **Amenities**: 2-column static checklist (Smart Home, Pool, HVAC, EV Charging, Gym, Wine Cellar)
- **Agent Card**: Avatar, name ("Sarah Jenkins"), "Top Rated Agent" badge, chat/call buttons, Schedule Visit + Contact Agent CTAs
- **Interactive Leaflet Map** (`components/property/PropertyMap.tsx`): Custom mosque-colored rotated marker (teardrop shape) with popup, CARTO light tiles, scroll-wheel zoom disabled
- **Estimated Payment**: Monthly cost estimate with "Calculate Mortgage" button
- Graceful map fallback when lat/lng are missing

---

### ⚠️ Issues Encountered & Fixes

#### Issue 1: TypeScript strictness with Supabase row shape
- **Problem**: `PropertyRow` had required `lat`/`lng`, but existing Supabase rows didn't have them yet.
- **Fix**: Made `lat`/`lng` **optional** in `PropertyRow` and `Property`. Updated `toProperty()` to pass them through.

#### Issue 2: Leaflet CSS not loading
- **Problem**: Map tiles and markers rendered incorrectly — no tile layer visible, marker size wrong.
- **Fix**: Added explicit `import "leaflet/dist/leaflet.css"` in `PropertyMap.tsx`. Used `L.divIcon` with custom HTML/CSS for the marker styled with mosque color.

#### Issue 3: Next.js 16 build with dynamic params
- **Problem**: `params` in `[slug]/page.tsx` is a `Promise` in Next.js 16 App Router.
- **Fix**: Used `await params` before destructuring `slug` in both `generateMetadata` and the page component.

#### Issue 4: Image optimization warnings
- **Problem**: ESLint warns about `<img>` elements (LCP/bandwidth). Project uses external Google image URLs.
- **Fix**: PropertyGallery uses `next/image` component with proper sizing. Card components still use `<img>` pending remote patterns configuration.

---

### 🔄 In Progress / Pending

| Item | Status |
|------|--------|
| next/image migration for external URLs | TODO — requires remote image patterns in `next.config.js` |
| Favorites/saved properties (localStorage or Supabase) | PARTIAL — localStorage state in MarketListings, not persisted |
| Contact form with Server Actions | TODO |
| Dark mode toggle | TODO — class strategy in place |
| Loading & error states for property detail | TODO — `loading.tsx` and `error.tsx` not yet created |
| Search filters synced to URL params | TODO |
| Agent detail / schedule viewing flow | TODO |
| Keep memory.md updated with progress | DONE |
| Property amenities dynamic from data | TODO — currently static in detail page |

---

## Key Files Reference

```
types/property.ts              # Property & PropertyRow interfaces
lib/supabase.ts                # Supabase client
lib/properties.ts              # Data fetching functions
__tests__/mock_data/properties.ts  # 38 mock properties with coordinates

components/
   layout/
     Navbar/
   property/
      FeaturedCard/
      PropertyCard/
      SearchFilters/
      FiltersModal.tsx         # Advanced filter modal
      PropertyMap.tsx           # Leaflet map component
      MarketListings/          # Main listings component with filters/pagination

app/
   page.tsx                    # Home page (renders MarketListings)
   layout.tsx                  # Root layout with fonts/icons
   properties/[slug]/
     page.tsx                  # Property detail page
     PropertyGallery.tsx       # Gallery with lightbox

supabase/migrations/
   20240101_add_slug_and_images.sql
   20240102_populate_slugs_and_images.sql
   20240627_add_lat_lng.sql
   20240628_add_amenities_and_new_properties.sql

antigravity/resources/
   property_details_screen/
     code.html                 # Design reference
     screen.png
   search_filters_screen/
     code.html                 # Filter modal design reference
```

---

## Environment Notes

- **OS**: Windows (PowerShell)
- **Node**: compatible with Next 16 / React 19
- **Supabase**: Client ready in `lib/supabase.ts` — credentials needed in `.env.local`
- **Leaflet**: Installed (`leaflet` + `@types/leaflet`) — tiles via CARTO
- **Tailwind v4**: CSS-first configuration in `app/globals.css` using `@theme` block
- **No API keys** are committed to the repository
- **Font**: Currently using SF Pro Display via system stack; Inter (Google Fonts) planned
