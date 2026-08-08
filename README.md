# BrickBuddy — E-commerce Frontend

A construction materials marketplace frontend, built with Vite + React 18.
This covers the **Vendor & Material Marketplace** module of the broader BrickBuddy platform (Module 2 in the requirements doc), as a standalone e-commerce experience.

## Pages
- **Home** (`/`) — hero, category grid, featured products, projects sidebar, why-us, testimonials, CTA
- **Shop** (`/shop`) — full filter sidebar (category, price, brand, location, availability), sort, grid/list toggle, search, mobile filter drawer
- **Services** (`/services`) — platform modules overview, how-it-works steps, pricing plans
- **About** (`/about`) — mission/vision, values, timeline, team

## Stack
- Vite + React 18, React Router v6
- Lucide React icons
- Custom CSS with design tokens (no UI library) — Inter + Barlow Condensed fonts
- Black (#1A1A1A) + Amber (#F5A800) palette

## Run locally
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to /dist
npm run preview   # preview the production build
```

## Data
All product/category data lives in `src/data/products.js` — 16 products across 12 categories with realistic Indian supplier names, INR pricing, and locations. Swap this for an API call once the backend is ready.

## Notes
- Product images are inline SVG placeholders (`src/components/ProductCard.jsx`) — swap for real photography when available.
- Cart/wishlist state is local-only (no backend yet); ready to wire into a MERN cart API.
