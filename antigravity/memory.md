# Luxe Estate — Project Memory

## Project Goal
Build a premium, minimalist real estate app using **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Supabase**. Follow design specs from the `antigravity/resources/` reference screenshots.

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Nordic | `#19322F` | Dark text, headers, navigation |
| Mosque | `#006655` | Primary actions, accents |
| Clear Day | `#EEF6F6` | App background |
| Hint of Green | `#D9ECC8` | Soft cards / highlighted surfaces |

- Font: `Inter` (from Google Fonts)
- Material Icons + Material Symbols Outlined for iconography
- Border radius: `0.5rem` (default), `1rem` (lg), `1.5rem` (xl)
- Shadows: soft, minimal (`shadow-sm`, `shadow-soft`)

---

## Current Branch State

### ✅ Completed

#### 1. Project Setup
- Next.js 16.2.9 + React 19.2.4 + TypeScript 5 + Tailwind v4 (via PostCSS)
- ESLint 9 configured
- Supabase client wired up (`lib/supabase.ts`)
- Root layout with Material Icons loaded globally

#### 2. Design System (Tailwind)
- Extended `tailwind.config` with custom colors: `nordic`, `mosque`, `clear-day`, `primary`, `primary-hover`, `primary-light`
- Extended font family: `display` (Inter)
- Custom border radius scale
- Dark mode support via `darkMode: "class"` (not yet wired to a toggle)

#### 3. Layout Components
- **Navbar** (`components/layout/Navbar/Navbar.tsx`): Sticky top nav with logo, links (Buy / Rent / Sell / Saved Homes), search icon, notification bell, user avatar pill. Mobile hamburger menu included.
- **Footer** (`components/layout/Footer/Footer.tsx`): Simple footer with copyright and social links (Facebook, Twitter/X).

#### 4. Property Data Layer
- **Types** (`types/property.ts`): `Property` (UI-facing) and `PropertyRow` (Supabase row) interfaces. Includes: `id`, `title`, `location`, `price`, `beds`, `baths`, `area`, `type`, `status`, `slug`, `images`, `isExclusive`, `isNewArrival`, `featured`, `lat`, `lng`.
- **DB Functions** (`lib/properties.ts`):
  - `getPropertyBySlug(slug)` → `Property | null`
  - `getFeaturedProperties()` → `Property[]`
  - `getMarketProperties(options)` → paginated, filtered `Property[]`
- **Mock Data** (`__tests__/mock_data/properties.ts`): 18 properties (3 featured, 15 market) with coordinates.
- **Cleanup**: Removed redundant `image_url` field from `PropertyRow`. `toProperty()` now uses `row.images` directly (all properties have images populated).

#### 5. Database Migrations (`supabase/migrations/`)
| File | Purpose |
|------|---------|
| `20240101_add_slug_and_images.sql` | Added `slug` (unique) and `images` (text[]) columns |
| `20240102_populate_slugs_and_images.sql` | Populated slugs (kebab-case from title) and image URLs for all 18 properties |
| `20240627_add_lat_lng.sql` | Added `lat`/`lng` (numeric) columns and populated coordinates for all properties |

#### 6. Home Page (`app/page.tsx`)
- Hero section with large headline, subtitle, and two CTAs (Buy / Rent)
- Search bar with dropdowns (type, price range, bedrooms, bathrooms)
- **Featured Properties** grid (horizontal scroll on mobile, responsive grid on desktop)
- **Market Listings** with pagination
- Uses `Promise.all` for parallel data fetching of featured + market properties

#### 7. Property Cards
- **FeaturedCard** (`components/property/FeaturedCard/`): Horizontal card with large image, price badge, title, location, bed/bath/area icons, "View Details" link.
- **PropertyCard** (`components/property/PropertyCard/`): Vertical card with image, favorite button (heart), status tag (FOR SALE / FOR RENT), price, title, location, amenities row.
- **SearchFilters** (`components/property/SearchFilters/`): Text search input + filter pills (All, Buy, Rent, type filters).

#### 8. Property Detail Page (`app/properties/[slug]/page.tsx`)
- Metadata with JSON-LD structured data (`RealEstateListing`)
- **PropertyGallery**: Hero image with thumbnail strip below, side dots on mobile (from antigravity reference)
- **Property Features**: 4-column grid (sq meters, beds, baths, garage)
- **About this home**: Description block with "Read more" button
- **Amenities**: 2-column checklist (Smart Home, Pool, HVAC, EV Charging, Gym, Wine Cellar)
- **Agent Card**: Avatar, name ("Sarah Jenkins"), "Top Rated Agent" badge, chat/call buttons, Schedule Visit + Contact Agent CTAs
- **Interactive Leaflet Map** (`components/property/PropertyMap.tsx`): Custom mosque-colored marker with popup, CARTO light tiles, scroll-wheel zoom disabled
- **Estimated Payment**: Monthly cost estimate with "Calculate Mortgage" button
- Graceful map fallback when lat/lng are missing

---

### ⚠️ Issues Encountered & Fixes

#### Issue 1: TypeScript strictness with Supabase row shape
- **Problem**: `PropertyRow` had required `lat`/`lng`, but existing Supabase rows didn't have them yet.
- **Fix**: Made `lat`/`lng` **optional** (`lat?: number`, `lng?: number`) in `PropertyRow`. Made them optional on `Property` too. Updated `toProperty()` to pass them through without requiring them.

#### Issue 2: Leaflet CSS not loading
- **Problem**: Map tiles and markers rendered incorrectly — no tile layer visible, marker size wrong.
- **Fix**: Added explicit `import "leaflet/dist/leaflet.css"` in `PropertyMap.tsx`. Used `L.divIcon` with custom HTML/CSS for the marker instead of default Leaflet blue marker. The marker uses a teardrop shape styled with mosque (`#006655`) color.

#### Issue 3: Next.js 16 build with dynamic params
- **Problem**: `params` in `[slug]/page.tsx` is a `Promise` in Next.js 16 App Router.
- **Fix**: Used `await params` before destructuring `slug` in both `generateMetadata` and the page component.

#### Issue 4: Image optimization warnings
- **Problem**: ESLint warns about `<img>` elements (LCP/bandwidth). Project uses external Google image URLs without a Next.js image loader configured.
- **Status**: Warnings are non-blocking. Would need `next.config.js` remote patterns to resolve. Not urgent.

---

### 🔄 In Progress / Pending

| Item | Status |
|------|--------|
| Mobile responsive polish (hamburger menu) | DONE — Navbar includes mobile menu |
| Property detail gallery (side dots, thumbnail strip) | DONE — `PropertyGallery` component |
| Leaflet map integration | DONE — `PropertyMap` component |
| `next/image` migration | TODO — requires remote image patterns |
| Favorites/saved properties (localStorage or Supabase) | TODO |
| Contact form with Server Actions | TODO |
| Dark mode toggle | TODO — class strategy in place |
| Pagination on market listings | DONE — server-side pagination via `getMarketProperties` |
| Loading & error states for property detail | TODO — `loading.tsx` and `error.tsx` not yet created |
| Search filters synced to URL params | TODO |
| Agent detail / schedule viewing flow | TODO |
| Keep memory.md updated with progress | IN_PROGRESS — this file |
| Skills reference guide | DONE — `antigravity/skills.md` created |

---

## Key Files Reference

```
types/property.ts              # Property & PropertyRow interfaces
lib/supabase.ts                # Supabase client
lib/properties.ts              # Data fetching functions
__tests__/mock_data/properties.ts  # 18 mock properties with coordinates

components/
  layout/
    Navbar/
    Footer/
  property/
    FeaturedCard/
    PropertyCard/
    SearchFilters/
    PropertyMap.tsx           # ← NEW Leaflet map component

app/
  page.tsx                    # Home page (featured + market listings)
  properties/[slug]/
    page.tsx                  # Property detail page
  layout.tsx                  # Root layout

supabase/migrations/
  20240101_add_slug_and_images.sql
  20240102_populate_slugs_and_images.sql
  20240627_add_lat_lng.sql    # ← NEW lat/lng migration

antigravity/resources/
  property_details_screen/
    code.html                 # Design reference
    screen.png
```

---

## Environment Notes

- **OS**: Windows (PowerShell)
- **Node**: compatible with Next 16 / React 19
- **Supabase**: Client ready in `lib/supabase.ts` — credentials needed in `.env.local`
- **Leaflet**: Installed (`leaflet` + `@types/leaflet`) — tiles via CARTO
- **No API keys** are committed to the repository
