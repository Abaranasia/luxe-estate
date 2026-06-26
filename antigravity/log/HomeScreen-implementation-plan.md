# Implementation Plan - Luxe Estate HomeScreen with Mocked Data

This plan outlines the creation of the Luxe Estate HomeScreen, including reusable UI components, a modular structure, and mocked data for real estate properties.

## User Review Required

> [!IMPORTANT]
> **Font Stack:** Since "SF Pro Display" is a proprietary Apple system font and not available on Google Fonts or locally, we will configure it in the Tailwind theme as the primary font followed by `-apple-system`, `BlinkMacSystemFont`, and other system sans-serif fallbacks.
> **Tailwind v4 theme setup:** As Tailwind CSS v4 uses a CSS-first configuration, we will define custom color tokens (`--color-nordic`, `--color-mosque`, etc.) inside `app/globals.css` rather than a `tailwind.config.js` file.
> **Light Mode Only:** The site will lock styling to the light mode version. No system dark mode updates will toggle the interface colors. All component classes must omit `dark:` attributes, and custom system dark color-scheme variables are omitted.

## Open Questions

None. The guidelines and code references are clear and fully specified.

## Proposed Changes

### Styles & Configurations

#### [MODIFY] [globals.css](file:///h:/Proyectos/VibeCoding/luxe-estate/app/globals.css)
- Define custom Tailwind v4 colors based on the guidelines:
  - `--color-nordic`: `#19322F` (Color principal oscuro / Texto principal)
  - `--color-mosque`: `#006655` (Color primario de acción / Botones primarios)
  - `--color-hint-of-green`: `#D9ECC8` (Fondo suave / Tarjetas destacadas)
  - `--color-clear-day`: `#EEF6F6` (Fondo general de la app)
- Configure `--font-sans` and `--font-display` to prioritize `"SF Pro Display"`.
- Set background to `clear-day` and default text to `nordic`.
- Ensure dark mode Media Query `@media (prefers-color-scheme: dark)` is absent.

#### [MODIFY] [layout.tsx](file:///h:/Proyectos/VibeCoding/luxe-estate/app/layout.tsx)
- Embed external links for Google Material Icons and Material Symbols to render the design icons accurately.
- Set a clean and premium document title and description matching the Luxe Estate theme.

---

### Data Models & Mock Data

#### [NEW] [property.ts](file:///h:/Proyectos/VibeCoding/luxe-estate/types/property.ts)
- Create a TypeScript interface representing a `Property` with features like `beds`, `baths`, `area` (m²), `price`, `imageUrl`, `type` (house, villa, etc.), `status` (sale, rent), and flags like `isExclusive` or `isNewArrival`.

#### [NEW] [properties.ts](file:///h:/Proyectos/VibeCoding/luxe-estate/data/properties.ts)
- Create a list of mock properties containing the exact items present in the reference HTML:
  - **Featured Collections**: "The Glass Pavilion" (Beverly Hills), "Azure Heights Penthouse" (Vancouver).
  - **New in Market**: "Modern Family Home" (Seattle), "Urban Loft" (Portland), "Highland Retreat" (Bend), "Sea View Penthouse" (Miami), "Central Studio" (Chicago), "Garden Villa" (Austin).
- Use the high-quality image URLs from the reference HTML.

---

### Reusable UI Components

#### [NEW] [Navbar.tsx](file:///h:/Proyectos/VibeCoding/luxe-estate/components/layout/Navbar.tsx)
- Premium, sticky navigation bar with LuxeEstate branding, navigation links (Buy, Rent, Sell, Saved Homes), search & notification buttons, and a responsive mobile menu toggle. Ensure light mode styles only (no `dark:` modifiers).

#### [NEW] [FeaturedCard.tsx](file:///h:/Proyectos/VibeCoding/luxe-estate/components/property/FeaturedCard.tsx)
- Reusable component for featured collection items. Includes smooth hover transitions, price formatting, bookmark (favorites) toggle interaction, and special tags (Exclusive, New Arrival). Ensure light mode styles only (no `dark:` modifiers).

#### [NEW] [PropertyCard.tsx](file:///h:/Proyectos/VibeCoding/luxe-estate/components/property/PropertyCard.tsx)
- Reusable component for the grid items (e.g. New in Market). Includes purchase type badges (FOR SALE / FOR RENT), responsive layout, and detail icons (beds, baths, square meters). Ensure light mode styles only (no `dark:` modifiers).

#### [NEW] [SearchFilters.tsx](file:///h:/Proyectos/VibeCoding/luxe-estate/components/property/SearchFilters.tsx)
- Search query box and type filter pills (All, House, Apartment, Villa, Penthouse) with dynamic state hooks for client-side filtering. Ensure light mode styles only (no `dark:` modifiers).

---

### Pages & Layouts

#### [MODIFY] [page.tsx](file:///h:/Proyectos/VibeCoding/luxe-estate/app/page.tsx)
- Revamp the main page to bring all components together.
- Add dynamic client-side filtering logic:
  - Search by city, neighborhood, or address.
  - Filter by property type (All, House, Apartment, Villa, Penthouse).
  - Filter "New in Market" by transaction status (All, Buy, Rent).
  - Favorite toggle capability per property card.
- Implement responsive grids and layout transitions. Ensure light mode styles only (no `dark:` modifiers).

## Verification Plan

### Automated Tests
- Run `npm run build` or `npx next build` to ensure TypeScript compilation passes.
- Run `npm run lint` or `eslint` to ensure styles and typescript rules are followed.

### Manual Verification
- View the app locally.
- Test client-side search filtering by typing cities like "Seattle" or "Miami".
- Test tabs to filter properties by type (e.g., clicking "Apartment" or "Villa").
- Toggle favorites icons to verify UI state update.
- Ensure colors match the guidelines exactly.
- Test system dark mode configuration to confirm no interface color change occurs.
