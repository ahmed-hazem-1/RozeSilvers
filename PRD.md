# PRD — Roze Silvers: Premium Silver Jewelry Shopify Storefront

> **Document Purpose:** This PRD provides every detail an AI agent needs to build the complete storefront. No assumptions should be made beyond what is written here and in the referenced `design.md`.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Shopify Integration](#3-shopify-integration)
4. [Site Architecture — Pages & Routes](#4-site-architecture--pages--routes)
5. [Component Architecture](#5-component-architecture)
6. [Features Specification](#6-features-specification)
7. [Data & Content Structure](#7-data--content-structure)
8. [SEO & Metadata](#8-seo--metadata)
9. [Performance Requirements](#9-performance-requirements)
10. [Bilingual Support (EN / AR)](#10-bilingual-support-en--ar)
11. [Accessibility](#11-accessibility)
12. [Deployment & Environment](#12-deployment--environment)
13. [Constraints — What NOT To Do](#13-constraints--what-not-to-do)

---

## 1. Project Overview

### 1.1 What is this?
A **headless Shopify storefront** for **Roze Silvers** — a premium silver jewelry brand. The frontend is a custom-built web application that connects to Shopify's backend via the **Storefront API**. All product data, collections, cart, checkout, and customer accounts are managed through Shopify. The frontend is responsible **only** for presentation and user interaction.

### 1.2 Brand Identity
* **Brand Name:** Roze Silvers
* **Industry:** Premium silver jewelry (rings, necklaces, bracelets, earrings, anklets)
* **Tone:** Elegant, minimal, high-end, quiet luxury
* **Target Audience:** Women aged 20–40 who value understated, premium silver accessories
* **Languages:** English (primary), Arabic (secondary)
* **Currency:** EGP (Egyptian Pound) — managed through Shopify settings

### 1.3 Core Principle
> The website must feel like walking into a high-end jewelry boutique — clean, spacious, quiet, and focused entirely on the product. Every pixel serves a purpose.

### 1.4 Design Reference
All visual specifications (colors, typography, spacing, hover effects, mobile behavior, constraints) are documented in **`design.md`** in the project root. The AI agent **MUST** read and follow `design.md` for every visual decision. If a visual detail is not covered in this PRD, defer to `design.md`. If neither document covers it, follow the brand tone: minimal, premium, sharp edges, muted colors, generous whitespace.

---

## 2. Tech Stack

### 2.1 Frontend Framework
| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| Framework | **Next.js** (App Router) | Latest stable (15.x) | SSR/SSG for SEO, file-based routing, React Server Components |
| Language | **TypeScript** | Latest stable | Type safety, fewer runtime errors |
| Styling | **Vanilla CSS** (CSS Modules) | — | Full control, no utility class bloat, matches premium aesthetic |
| Package Manager | **npm** | Latest | Standard |

### 2.2 Shopify Connection
| Layer | Technology | Why |
|-------|-----------|-----|
| API | **Shopify Storefront API** (GraphQL) | Read products, collections, cart, customer data |
| SDK | **@shopify/hydrogen-react** | Pre-built hooks & utilities for Storefront API |
| Cart | **Storefront API Cart** | Server-managed cart via `cartCreate`, `cartLinesAdd`, etc. |
| Checkout | **Shopify-hosted Checkout** | Redirect to Shopify's checkout page (not custom checkout) |
| Customer Accounts | **Shopify Customer Account API** | Login, register, order history — via Shopify's hosted login or API |

### 2.3 Additional Libraries (Allowed)
| Library | Purpose |
|---------|---------|
| `graphql-request` or native `fetch` | For Storefront API GraphQL calls |
| `next-intl` or `next-i18next` | Bilingual EN/AR support |
| `swiper` or `embla-carousel` | Product image carousels (mobile swipe) |
| `framer-motion` (OPTIONAL) | Only for page transitions & menu animations — NOT for decorative effects |
| `react-icons` (lucide subset) | Thin-line icons only (matching design system) |

### 2.4 Libraries NOT Allowed
| Library | Reason |
|---------|--------|
| TailwindCSS | Conflicts with design system philosophy — use CSS Modules |
| Bootstrap / Material UI / Chakra | Pre-styled components break the premium aesthetic |
| jQuery | Not needed in React |
| Animate.css | Bouncy/fast animations violate design constraints |
| Any CSS framework | We use vanilla CSS only |

---

## 3. Shopify Integration

### 3.1 Environment Variables
The following environment variables must be configured in `.env.local`:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=rozesilvers.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxx
SHOPIFY_ADMIN_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxx  # Only if needed for server-side admin tasks
```

> **IMPORTANT:** The Storefront Access Token is a **public** token (safe for client-side). The Admin token is **private** (server-side only, never exposed to the browser).

### 3.2 Storefront API — Key Operations

#### Products
```graphql
# Fetch single product by handle
query ProductByHandle($handle: String!) {
  product(handle: $handle) {
    id
    title
    handle
    description
    descriptionHtml
    productType
    vendor
    tags
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
    }
    images(first: 10) {
      edges { node { url altText width height } }
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions { name value }
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          image { url altText }
        }
      }
    }
    metafields(identifiers: [
      { namespace: "custom", key: "material" },
      { namespace: "custom", key: "weight" },
      { namespace: "custom", key: "care_instructions" }
    ]) {
      key value type
    }
  }
}
```

#### Collections
```graphql
# Fetch collection with products
query CollectionByHandle($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean, $filters: [ProductFilter!]) {
  collection(handle: $handle) {
    id
    title
    handle
    description
    image { url altText }
    products(first: $first, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
      edges {
        node {
          id title handle productType vendor
          priceRange { minVariantPrice { amount currencyCode } }
          compareAtPriceRange { minVariantPrice { amount currencyCode } }
          images(first: 2) { edges { node { url altText } } }
          availableForSale
          variants(first: 5) {
            edges { node { id title availableForSale selectedOptions { name value } } }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}
```

#### Cart Operations
```graphql
# Create cart
mutation CartCreate($input: CartInput!) {
  cartCreate(input: $input) {
    cart { id checkoutUrl totalQuantity lines(first: 50) { edges { node { id quantity merchandise { ... on ProductVariant { id title price { amount currencyCode } image { url altText } product { title handle } } } } } } cost { totalAmount { amount currencyCode } subtotalAmount { amount currencyCode } } }
    userErrors { field message }
  }
}

# Add to cart
mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart { ...CartFields }
    userErrors { field message }
  }
}

# Update cart line quantity
mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart { ...CartFields }
    userErrors { field message }
  }
}

# Remove from cart
mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart { ...CartFields }
    userErrors { field message }
  }
}
```

#### Search
```graphql
query Search($query: String!, $first: Int!) {
  search(query: $query, first: $first, types: [PRODUCT]) {
    edges {
      node {
        ... on Product {
          id title handle productType
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 1) { edges { node { url altText } } }
        }
      }
    }
  }
}
```

### 3.3 Cart Persistence
* Cart ID is stored in a **cookie** (`shopify_cart_id`) with `SameSite=Lax`, `Secure`, and a 30-day expiry.
* On page load, if a cart ID cookie exists, fetch the cart from the Storefront API to get the latest state.
* If the cart is expired or invalid, create a new one silently.

### 3.4 Checkout Flow
* **We do NOT build a custom checkout page.**
* When the user clicks "Checkout", redirect them to the `checkoutUrl` returned by the Cart API.
* Shopify handles payment, shipping, and order confirmation.
* After checkout, Shopify redirects back to a configurable "Thank You" page (can be on our domain or Shopify's).

### 3.5 Customer Accounts
* Use **Shopify's hosted customer account pages** (login, register, order history, addresses).
* Link to them from the header account icon.
* Alternatively, if deeper integration is needed later, use the **Customer Account API** — but for MVP, hosted pages are sufficient.

---

## 4. Site Architecture — Pages & Routes

### 4.1 Folder Structure (Next.js App Router)

```
src/
├── app/
│   ├── [locale]/                    # Locale wrapper (en / ar)
│   │   ├── layout.tsx               # Root layout (Header + Footer + locale provider)
│   │   ├── page.tsx                 # Homepage
│   │   ├── collections/
│   │   │   ├── page.tsx             # All Collections listing page
│   │   │   └── [handle]/
│   │   │       └── page.tsx         # Single Collection page (product grid + filters)
│   │   ├── products/
│   │   │   └── [handle]/
│   │   │       └── page.tsx         # Product Detail Page (PDP)
│   │   ├── search/
│   │   │   └── page.tsx             # Search results page
│   │   ├── cart/
│   │   │   └── page.tsx             # Full cart page
│   │   ├── about/
│   │   │   └── page.tsx             # About Us page
│   │   ├── contact/
│   │   │   └── page.tsx             # Contact page
│   │   ├── policies/
│   │   │   ├── shipping/page.tsx    # Shipping policy
│   │   │   ├── returns/page.tsx     # Returns & exchange policy
│   │   │   └── privacy/page.tsx     # Privacy policy
│   │   └── not-found.tsx            # Custom 404 page
│   ├── layout.tsx                   # Root HTML layout (fonts, metadata)
│   └── globals.css                  # Design system CSS custom properties
├── components/                      # Reusable UI components
├── lib/
│   ├── shopify/
│   │   ├── client.ts                # Storefront API client (fetch wrapper)
│   │   ├── queries.ts               # All GraphQL queries
│   │   ├── mutations.ts             # All GraphQL mutations
│   │   └── types.ts                 # TypeScript types for Shopify data
│   ├── utils.ts                     # Helpers (format price, etc.)
│   └── constants.ts                 # Site-wide constants
├── hooks/                           # Custom React hooks
│   ├── useCart.ts
│   ├── useSearch.ts
│   └── useLocale.ts
├── context/
│   ├── CartContext.tsx               # Cart state provider
│   └── LocaleContext.tsx             # Language state provider
├── messages/
│   ├── en.json                      # English translations
│   └── ar.json                      # Arabic translations
└── public/
    ├── fonts/                       # Self-hosted fonts (Playfair Display, Inter, Amiri, Tajawal)
    ├── icons/                       # SVG icons (thin-line)
    └── images/                      # Static images (logo, hero, etc.)
```

### 4.2 Page Definitions

#### **Homepage** — `/[locale]`
| Section | Content | Data Source |
|---------|---------|-------------|
| Hero | Full-width asymmetric layout with headline, subtitle, CTA button, and 1-2 hero images | Static content (hardcoded or from Shopify metaobjects) |
| Featured Collection | 4 product cards from a "Featured" collection | Storefront API: `collectionByHandle("featured")` |
| Category Highlights | 3-4 visual blocks linking to main collections (Rings, Necklaces, etc.) | Static content + collection images |
| Best Sellers | 4 product cards from "Best Sellers" collection | Storefront API: `collectionByHandle("best-sellers")` |
| New Arrivals | 4 product cards from "New Arrivals" collection | Storefront API: `collectionByHandle("new-arrivals")` |
| Brand Story Strip | A minimal text section with 1 line of brand philosophy | Static content |
| Newsletter | Email input + subscribe button | Shopify Customer API or third-party (Mailchimp) |

#### **Collection Page** — `/[locale]/collections/[handle]`
| Element | Behavior |
|---------|----------|
| Collection Title | Displayed at top, `32px` desktop / `24px` mobile |
| Collection Description | Optional, below title, `14px` muted color |
| Collection Image | Optional banner image at top (if set in Shopify) |
| Product Grid | 4 columns (desktop), 3 (laptop), 2 (tablet), 1 or 2 (mobile) |
| Sort | Dropdown: "Featured", "Price: Low to High", "Price: High to Low", "Newest", "Best Selling" |
| Filter | Sidebar (desktop) / Modal (mobile): by Product Type, Price Range, Availability, Size |
| Pagination | "Load More" button (NOT infinite scroll, NOT numbered pages) |
| Empty State | "No products found" message with link back to all collections |

#### **Product Detail Page (PDP)** — `/[locale]/products/[handle]`
| Element | Behavior |
|---------|----------|
| Image Gallery | Desktop: main image + vertical thumbnails on the left. Mobile: full-width swipeable carousel with dots |
| Product Title | Serif font (Playfair Display), `24px` desktop / `20px` mobile |
| Price | Below title, `16px` weight `600`. If compareAtPrice exists, show original crossed out |
| Variant Selector | Size chips / color swatches (depending on variant options). See `design.md` section 13.ن |
| Quantity Selector | `−` [number] `+` inline |
| Add to Cart Button | Full-width on mobile (fixed bottom bar). Inline on desktop. Changes to "Adding..." then "Added ✓" briefly |
| Product Description | HTML rendered from `descriptionHtml`. Accordion sections for Details, Shipping, Care |
| Metafields | Material, Weight, Care Instructions — displayed in the accordion |
| Related Products | Horizontal scrollable row of 4-6 products from same collection. `scroll-snap` on mobile |
| Recently Viewed | (Optional — Phase 2) Stored in localStorage |

#### **Cart Page** — `/[locale]/cart`
| Element | Behavior |
|---------|----------|
| Cart Items | List of items with: thumbnail (80×80), title, variant, quantity selector, line price, remove button |
| Cart Summary | Subtotal, estimated shipping note ("Calculated at checkout"), total |
| Checkout Button | Redirects to Shopify checkout (`checkoutUrl`). Full-width, primary style |
| Continue Shopping | Link back to collections |
| Empty Cart | Message + CTA to browse collections |

#### **Search Results** — `/[locale]/search?q=...`
| Element | Behavior |
|---------|----------|
| Search Input | Pre-filled with query, auto-focused |
| Results Grid | Same layout as collection grid (4/3/2/1 columns) |
| No Results | "No products found for [query]" + suggested collections |
| Result Count | "X results for [query]" |

#### **About Page** — `/[locale]/about`
* Brand story, mission, craftsmanship details
* Full-width image sections
* All static content (hardcoded)

#### **Contact Page** — `/[locale]/contact`
* Contact form (name, email, subject, message) — submits via Shopify or email API
* Store info (email, phone, social links)
* Optional: embedded map

#### **Policy Pages** — `/[locale]/policies/[type]`
* Static text content from Shopify's built-in policy fields (fetched via Storefront API `shop` query)

#### **404 Page**
* Minimal design: "Page not found" + link to homepage
* Consistent with brand aesthetic

---

## 5. Component Architecture

### 5.1 Component Directory Structure

```
src/components/
├── layout/
│   ├── Header/
│   │   ├── Header.tsx
│   │   ├── Header.module.css
│   │   ├── DesktopNav.tsx
│   │   ├── MobileMenu.tsx
│   │   ├── MobileMenu.module.css
│   │   ├── HeaderIcons.tsx
│   │   └── AnnouncementBar.tsx         # Optional top bar ("Free shipping over X")
│   ├── Footer/
│   │   ├── Footer.tsx
│   │   ├── Footer.module.css
│   │   ├── FooterColumn.tsx
│   │   ├── FooterAccordion.tsx         # Mobile: collapsible footer sections
│   │   └── NewsletterForm.tsx
│   └── Container.tsx                    # Max-width wrapper with responsive padding
├── product/
│   ├── ProductCard/
│   │   ├── ProductCard.tsx
│   │   ├── ProductCard.module.css
│   │   └── WishlistButton.tsx
│   ├── ProductGrid/
│   │   ├── ProductGrid.tsx
│   │   └── ProductGrid.module.css
│   ├── ProductGallery/
│   │   ├── ProductGallery.tsx           # Desktop: main + thumbnails
│   │   ├── ProductGallery.module.css
│   │   └── MobileGallery.tsx            # Mobile: swipeable carousel
│   ├── VariantSelector/
│   │   ├── VariantSelector.tsx
│   │   └── VariantSelector.module.css
│   ├── QuantitySelector/
│   │   ├── QuantitySelector.tsx
│   │   └── QuantitySelector.module.css
│   ├── ProductAccordion/
│   │   ├── ProductAccordion.tsx
│   │   └── ProductAccordion.module.css
│   └── RelatedProducts/
│       ├── RelatedProducts.tsx
│       └── RelatedProducts.module.css
├── cart/
│   ├── CartDrawer/
│   │   ├── CartDrawer.tsx               # Slide-in cart drawer
│   │   └── CartDrawer.module.css
│   ├── CartItem/
│   │   ├── CartItem.tsx
│   │   └── CartItem.module.css
│   └── CartSummary/
│       ├── CartSummary.tsx
│       └── CartSummary.module.css
├── collection/
│   ├── CollectionHeader/
│   │   ├── CollectionHeader.tsx
│   │   └── CollectionHeader.module.css
│   ├── FilterSidebar/
│   │   ├── FilterSidebar.tsx            # Desktop: sidebar
│   │   ├── FilterSidebar.module.css
│   │   └── FilterModal.tsx              # Mobile: full-screen modal
│   └── SortDropdown/
│       ├── SortDropdown.tsx
│       └── SortDropdown.module.css
├── search/
│   ├── SearchOverlay/
│   │   ├── SearchOverlay.tsx            # Full-screen search (see design.md section 11.ب)
│   │   └── SearchOverlay.module.css
│   └── SearchResults.tsx
├── home/
│   ├── HeroSection/
│   │   ├── HeroSection.tsx
│   │   └── HeroSection.module.css
│   ├── CategoryHighlights/
│   │   ├── CategoryHighlights.tsx
│   │   └── CategoryHighlights.module.css
│   ├── BrandStoryStrip/
│   │   ├── BrandStoryStrip.tsx
│   │   └── BrandStoryStrip.module.css
│   └── NewsletterSection/
│       ├── NewsletterSection.tsx
│       └── NewsletterSection.module.css
├── ui/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.module.css
│   ├── Input/
│   │   ├── Input.tsx
│   │   └── Input.module.css
│   ├── Select/
│   │   ├── Select.tsx
│   │   └── Select.module.css
│   ├── Accordion/
│   │   ├── Accordion.tsx
│   │   └── Accordion.module.css
│   ├── Modal/
│   │   ├── Modal.tsx
│   │   └── Modal.module.css
│   ├── Breadcrumb/
│   │   ├── Breadcrumb.tsx
│   │   └── Breadcrumb.module.css
│   ├── LoadMoreButton/
│   │   ├── LoadMoreButton.tsx
│   │   └── LoadMoreButton.module.css
│   ├── SkeletonLoader/
│   │   ├── SkeletonLoader.tsx
│   │   └── SkeletonLoader.module.css
│   ├── Badge/
│   │   └── Badge.tsx                    # "Sale", "New", "Sold Out" badges
│   ├── Divider/
│   │   └── Divider.tsx
│   └── BackToTop/
│       ├── BackToTop.tsx
│       └── BackToTop.module.css
└── icons/
    └── index.tsx                        # All SVG icons exported as React components
```

### 5.2 Key Component Specifications

#### **ProductCard**
```typescript
interface ProductCardProps {
  product: {
    handle: string;
    title: string;
    vendor?: string;
    productType?: string;
    images: { url: string; altText: string }[];
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
    compareAtPriceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
    availableForSale: boolean;
  };
  layout?: '1-column' | '2-column';   // Affects sizing on mobile
  priority?: boolean;                   // For image loading priority (above the fold)
  showVendor?: boolean;
}
```
* **Desktop:** Hover lifts card `translateY(-4px)` with subtle shadow. Image zooms `scale(1.04)`.
* **Mobile:** No hover effects. Optional swipe between first 2 images (dots indicator).
* **Sold Out:** Overlay with muted text "Sold Out", image slightly desaturated (`filter: saturate(0.5)`).
* **Sale Badge:** Small `"Sale"` text badge, top-left, muted color (NOT red).

#### **Header**
```typescript
interface HeaderProps {
  locale: 'en' | 'ar';
  cartItemCount: number;
}
```
* **Desktop:** Logo (left) | Navigation Links (center) | Icons: Search, Account, Cart with count badge (right).
* **Mobile:** Hamburger (left) | Logo (center) | Search + Cart (right). See `design.md` section 13.أ.
* **Sticky** on both desktop and mobile.
* **Navigation Links:** Home, Shop (dropdown with collections), About, Contact.
* **Shop Dropdown (Desktop):** On hover, shows a clean dropdown listing all main collections. No mega-menu complexity.

#### **CartDrawer**
```typescript
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
```
* Slides in from the **right** on desktop, slides up from **bottom** or right on mobile (full screen).
* Shows cart items, subtotal, checkout button.
* Body scroll lock when open.
* "Your cart is empty" state with CTA.

#### **SearchOverlay**
* Full-screen white overlay (see `design.md` section 11.ب).
* Large input field, no border, underline only.
* Debounced search (300ms) — shows results as user types.
* Shows up to 6 product suggestions with thumbnails.
* "View all results" link goes to `/search?q=...`.
* Close with X icon or Escape key.

#### **Button**
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'default' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;                      // Renders as <a> if provided
}
```
* Primary: `bg #111111`, text `#FFFFFF`. Hover: `bg #333333`.
* Secondary: Transparent, `border 1px solid #111111`. Hover: fills black.
* All buttons: `letter-spacing: 1.5px; text-transform: uppercase; font-size: 13px;`
* Loading state: text replaced with a simple spinner (thin circle, `#FFFFFF` or `#111111`).

---

## 6. Features Specification

### 6.1 Cart System

| Feature | Specification |
|---------|---------------|
| **Cart Icon Badge** | Shows total quantity as a small number badge (top-right of cart icon). `background: #111111; color: #FFFFFF; font-size: 10px; min-width: 16px; height: 16px; border-radius: 50%;` |
| **Add to Cart** | Button shows "ADD TO CART" → "ADDING..." (with spinner) → "ADDED ✓" (1.5s) → reverts to "ADD TO CART". If no variant selected and product has variants, prompt user to select. |
| **Cart Drawer** | Opens automatically when item is added. Can also be toggled via cart icon. |
| **Quantity Update** | `−` and `+` buttons. Minimum quantity: 1. Debounced API call (500ms) to prevent spamming. |
| **Remove Item** | Trash icon. Confirm with brief animation (item slides out). No confirmation dialog. |
| **Cart Persistence** | Cart ID stored in cookie. Survives page refresh and browser close (30 days). |
| **Checkout** | "CHECKOUT" button redirects to `cart.checkoutUrl` (Shopify-hosted). |

### 6.2 Search

| Feature | Specification |
|---------|---------------|
| **Trigger** | Click search icon in header → Full-screen overlay opens |
| **Input** | Auto-focused, large font (`24px` desktop, `20px` mobile), underline-only |
| **Behavior** | Debounced (300ms). Shows results as user types. Searches product titles and types. |
| **Results Preview** | Up to 6 products with thumbnail, title, price. Clicking a result goes to PDP. |
| **Full Results** | "View all X results" link → navigates to `/search?q=...` page |
| **No Results** | "No products found" message with suggested collections |
| **Close** | X button, Escape key, or clicking outside results |
| **Mobile** | Same overlay behavior. `font-size: 20px`. Touch-friendly results. |

### 6.3 Product Filtering & Sorting

#### **Sort Options:**
| Value | Label (EN) | Label (AR) | API `sortKey` | `reverse` |
|-------|-----------|-----------|---------------|-----------|
| `featured` | Featured | مميز | `MANUAL` | `false` |
| `price-asc` | Price: Low to High | السعر: من الأقل | `PRICE` | `false` |
| `price-desc` | Price: High to Low | السعر: من الأعلى | `PRICE` | `true` |
| `newest` | Newest | الأحدث | `CREATED` | `true` |
| `best-selling` | Best Selling | الأكثر مبيعاً | `BEST_SELLING` | `false` |

#### **Filter Options:**
| Filter | Type | Source |
|--------|------|--------|
| **Availability** | Checkbox: "In Stock" | `availableForSale: true` filter |
| **Price Range** | Min/Max inputs or preset ranges | Storefront API price filter |
| **Product Type** | Checkboxes (Rings, Necklaces, etc.) | Product `productType` field |
| **Size** | Checkboxes | Variant option named "Size" |

#### **Filter Behavior:**
* Desktop: Sidebar on the left, product grid on the right.
* Mobile: "Filter" button → opens full-screen modal with all filters + "Apply" button fixed at bottom.
* Active filters shown as removable chips above the grid.
* Filter changes update URL search params (for shareability and back-button support).

### 6.4 Wishlist (Phase 2 — Optional)

* Stored in `localStorage` (no account required).
* Heart icon on each product card (thin stroke → filled on toggle).
* Wishlist page accessible from header icon.
* Not a Shopify feature — fully client-side.

### 6.5 Newsletter Subscription

* Email input + "SUBSCRIBE" button in footer and optionally on homepage.
* Submits to Shopify's customer API (`customerCreate` mutation with `acceptsMarketing: true`) or a third-party service.
* Success: "Thank you for subscribing" inline message (replaces form briefly).
* Error: "Please enter a valid email" inline error.
* No pop-ups, no modals — inline form only.

### 6.6 Announcement Bar (Optional)

* Thin bar above the header: "Free Shipping on Orders Over 500 EGP" or similar.
* `background: #111111; color: #FFFFFF; font-size: 12px; text-align: center; padding: 8px 0;`
* Dismissible with a tiny X on the right (persisted in `sessionStorage`).
* Can be hidden globally via a constant or CMS field.

### 6.7 Loading States

| Context | Loading State |
|---------|---------------|
| Page navigation | Thin progress bar at top of page (NProgress-style), color `#111111` |
| Product grid | Skeleton cards (gray pulse animation matching card dimensions) |
| Product images | Skeleton rectangle → fade-in when loaded |
| Add to Cart button | Text changes to "ADDING..." with spinner |
| Cart Drawer opening | Immediate open, items fetched (show skeleton if needed) |
| Search results | Skeleton rows below search input |

### 6.8 Error States

| Context | Error Handling |
|---------|---------------|
| Product not found | Redirect to 404 page |
| Collection empty | "No products in this collection" + link to all collections |
| API failure | Retry once silently. If still fails, show "Something went wrong. Please try again." with retry button |
| Cart error (add/remove) | Toast notification at bottom: "Could not update cart. Please try again." Auto-dismisses in 4s. |
| Network offline | (Optional) Banner at top: "You are offline" |

### 6.9 Toast Notifications

* Position: `fixed; bottom: 24px; left: 50%; transform: translateX(-50%);` (centered bottom).
* Style: `background: #111111; color: #FFFFFF; padding: 12px 24px; font-size: 13px;`
* Animation: fade-in + slide-up. Auto-dismiss after 4 seconds.
* Used for: cart errors, wishlist toggle confirmation, form submission success.
* Mobile: full-width with `bottom: 0;` and safe-area padding.

---

## 7. Data & Content Structure

### 7.1 Shopify Collections (Expected)

The following collections should exist in Shopify Admin. The AI agent should build the frontend to reference these handles:

| Collection Handle | Display Name | Usage |
|-------------------|-------------|-------|
| `all` | All Products | Default "Shop All" page |
| `rings` | Rings | Category page |
| `necklaces` | Necklaces | Category page |
| `bracelets` | Bracelets | Category page |
| `earrings` | Earrings | Category page |
| `anklets` | Anklets | Category page |
| `featured` | Featured | Homepage "Featured" section |
| `best-sellers` | Best Sellers | Homepage "Best Sellers" section |
| `new-arrivals` | New Arrivals | Homepage "New Arrivals" section |
| `sale` | Sale | (Optional) Sale items |

### 7.2 Product Data Model (Expected Fields in Shopify)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | String | ✅ | Product name |
| `handle` | String | ✅ | URL slug (auto-generated) |
| `description` / `descriptionHtml` | String/HTML | ✅ | Product details |
| `productType` | String | ✅ | "Ring", "Necklace", "Bracelet", etc. |
| `vendor` | String | Optional | Designer/brand name |
| `tags` | String[] | Optional | For filtering/search |
| `images` | Image[] | ✅ | Minimum 1, ideally 3-5 per product |
| `variants` | Variant[] | ✅ | At least 1 (default). Options: Size, Color |
| `priceRange` | Object | ✅ | Auto-calculated from variants |
| `compareAtPrice` | Money | Optional | Original price (for sale items) |
| **Metafields:** | | | |
| `custom.material` | String | Optional | "925 Sterling Silver", "Silver Plated", etc. |
| `custom.weight` | String | Optional | "5g", "12g", etc. |
| `custom.care_instructions` | String | Optional | Care & maintenance text |

### 7.3 Static Content

The following content is hardcoded in the frontend (not from Shopify):

#### **Hero Section:**
* **Headline (EN):** "Elegance in Every Detail"
* **Headline (AR):** "أناقة في كل تفصيلة"
* **Subtitle (EN):** "Discover our curated collection of premium sterling silver jewelry"
* **Subtitle (AR):** "اكتشفي مجموعتنا المميزة من المجوهرات الفضية الفاخرة"
* **CTA:** "SHOP NOW" / "تسوقي الآن"
* **Images:** Hero images stored in `/public/images/hero/`

#### **Brand Story Strip:**
* **EN:** "Crafted with passion. Worn with confidence."
* **AR:** "صُنعت بشغف. تُرتدى بثقة."

#### **About Page Content:**
* Brand origin story, craftsmanship philosophy, materials used.
* To be provided by the brand owner. Use placeholder text initially with a `<!-- TODO: Replace with actual brand story -->` comment.

### 7.4 Navigation Structure

```
Header Navigation:
├── Home                    → /[locale]
├── Shop                    → (dropdown)
│   ├── All Products        → /[locale]/collections/all
│   ├── Rings               → /[locale]/collections/rings
│   ├── Necklaces           → /[locale]/collections/necklaces
│   ├── Bracelets           → /[locale]/collections/bracelets
│   ├── Earrings            → /[locale]/collections/earrings
│   ├── Anklets             → /[locale]/collections/anklets
│   └── New Arrivals        → /[locale]/collections/new-arrivals
├── About                   → /[locale]/about
└── Contact                 → /[locale]/contact

Footer Navigation:
├── Column 1: Shop
│   ├── All Products
│   ├── Rings
│   ├── Necklaces
│   ├── Bracelets
│   └── Earrings
├── Column 2: Info
│   ├── About Us
│   ├── Contact
│   ├── Shipping Policy
│   ├── Returns & Exchanges
│   └── Privacy Policy
├── Column 3: Newsletter
│   └── Email input + Subscribe button
└── Bottom Bar:
    ├── © 2026 Roze Silvers. All rights reserved.
    └── Social Icons: Instagram, Facebook, TikTok, WhatsApp
```

---

## 8. SEO & Metadata

### 8.1 Global Metadata

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://rozesilvers.com'),
  title: {
    default: 'Roze Silvers — Premium Sterling Silver Jewelry',
    template: '%s | Roze Silvers',
  },
  description: 'Discover elegant sterling silver jewelry. Rings, necklaces, bracelets, and earrings crafted with precision and passion.',
  keywords: ['silver jewelry', 'sterling silver', 'rings', 'necklaces', 'bracelets', 'earrings', 'premium jewelry', 'Egyptian jewelry'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_EG',
    siteName: 'Roze Silvers',
    images: [{ url: '/images/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### 8.2 Per-Page Metadata

| Page | Title | Description |
|------|-------|-------------|
| Homepage | "Roze Silvers — Premium Sterling Silver Jewelry" | "Discover elegant sterling silver jewelry..." |
| Collection | "[Collection Name] — Roze Silvers" | "[Collection description from Shopify]" |
| Product | "[Product Title] — Roze Silvers" | "[First 155 chars of product description]" |
| Search | "Search Results for [query] — Roze Silvers" | "Browse search results for [query]" |
| Cart | "Shopping Cart — Roze Silvers" | `noindex` — cart pages should not be indexed |
| About | "About Us — Roze Silvers" | "Learn about our passion for crafting premium silver jewelry" |
| Contact | "Contact Us — Roze Silvers" | "Get in touch with Roze Silvers" |
| 404 | "Page Not Found — Roze Silvers" | `noindex` |

### 8.3 Structured Data (JSON-LD)

#### **Product Pages:**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[Product Title]",
  "image": "[Product Image URLs]",
  "description": "[Product Description]",
  "brand": { "@type": "Brand", "name": "Roze Silvers" },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "EGP",
    "price": "[Price]",
    "availability": "https://schema.org/InStock",
    "url": "[Product URL]"
  }
}
```

#### **Homepage:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Roze Silvers",
  "url": "https://rozesilvers.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://rozesilvers.com/en/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

#### **Breadcrumbs:**
* Present on Collection and Product pages.
* Schema.org `BreadcrumbList` markup.
* Visual style: see `design.md` section 10 (Breadcrumb Links).

### 8.4 Technical SEO

| Item | Implementation |
|------|----------------|
| **Canonical URLs** | Every page must have `<link rel="canonical" href="...">`. Locale variants linked with `hreflang`. |
| **hreflang tags** | `<link rel="alternate" hreflang="en" href="https://rozesilvers.com/en/...">` and `hreflang="ar"`. |
| **Sitemap** | Auto-generated `sitemap.xml` via Next.js. Include all products, collections, and static pages. |
| **robots.txt** | Allow all. Disallow `/cart`, `/api/`. |
| **Image Alt Text** | Use Shopify's `altText` field. Fallback to product title if missing. |
| **Heading Hierarchy** | One `<h1>` per page. Proper `<h2>` → `<h3>` nesting. |
| **Semantic HTML** | `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<header>`. |
| **Page Speed** | Target: Lighthouse score 90+ on mobile. See Performance section. |

---

## 9. Performance Requirements

### 9.1 Core Web Vitals Targets

| Metric | Target | How |
|--------|--------|-----|
| **LCP** (Largest Contentful Paint) | < 2.5s | Prioritize hero image loading, use `next/image` with `priority`, preload fonts |
| **FID** (First Input Delay) | < 100ms | Minimize JS bundle, use React Server Components where possible |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Set explicit `width`/`height` or `aspect-ratio` on all images, reserve space for dynamic content |
| **Lighthouse Mobile** | 90+ | All optimizations below combined |

### 9.2 Image Optimization

| Rule | Implementation |
|------|----------------|
| **Format** | Use `next/image` component — auto-serves WebP/AVIF |
| **Sizing** | Always provide `width` and `height` props. Shopify CDN images support `_WIDTHxHEIGHT` URL transforms. |
| **Lazy Loading** | All images `loading="lazy"` except: hero image, first 4 product cards (above-the-fold) |
| **srcset** | Handled automatically by `next/image`. Use `sizes` prop correctly: `sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"` |
| **Placeholder** | Use `placeholder="blur"` with a tiny blurred preview or solid color skeleton |
| **Shopify CDN** | Append size params to Shopify image URLs: `image.url + '&width=600'` for thumbnails |

### 9.3 Font Loading

```css
/* Load strategy */
@font-face {
  font-family: 'Playfair Display';
  src: url('/fonts/PlayfairDisplay-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;    /* Critical — prevents FOIT */
}

/* Same for Inter, Amiri, Tajawal — all with font-display: swap */
```

* Self-host all fonts in `/public/fonts/` (do NOT use Google Fonts CDN — eliminates a third-party request).
* Preload critical fonts in `<head>`:
  ```html
  <link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/PlayfairDisplay-Regular.woff2" as="font" type="font/woff2" crossorigin>
  ```
* Only load Arabic fonts (`Amiri`, `Tajawal`) when `locale === 'ar'`.

### 9.4 JavaScript Bundle

| Strategy | Implementation |
|----------|----------------|
| **React Server Components** | Use RSC for all data-fetching pages (homepage, collections, PDP). Only the interactive parts (cart, search, variant selector) should be Client Components (`'use client'`). |
| **Code Splitting** | Next.js handles route-based splitting automatically. Use `dynamic()` for heavy components (e.g., `SearchOverlay`, `CartDrawer`) that don't need to load immediately. |
| **Tree Shaking** | Only import specific icons from `react-icons/lu` (Lucide), not the entire library. |
| **No Heavy Libraries** | No moment.js, lodash (use native), or large animation libraries. |

### 9.5 Caching

| Resource | Strategy |
|----------|----------|
| **Product Data** | ISR (Incremental Static Regeneration) with `revalidate: 60` (1 minute). Pages are static but refresh periodically. |
| **Collection Pages** | ISR with `revalidate: 60`. |
| **Static Pages** (About, Contact, Policies) | SSG (fully static). Rebuild only on deploy. |
| **Cart Data** | No caching — always fresh from Shopify API. |
| **Images** | CDN-cached via Shopify's CDN and Vercel's Edge Network. |

---

## 10. Bilingual Support (EN / AR)

### 10.1 Architecture

* **URL-based locale:** `/en/...` and `/ar/...`.
* **Default locale:** English (`en`). Root `/` redirects to `/en`.
* **Middleware:** Next.js middleware detects locale from URL and sets `dir` attribute and locale context.
* **RTL:** Arabic pages must have `<html dir="rtl" lang="ar">`. English pages: `<html dir="ltr" lang="en">`.

### 10.2 Translation Files

```json
// messages/en.json
{
  "nav": {
    "home": "Home",
    "shop": "Shop",
    "about": "About",
    "contact": "Contact",
    "allProducts": "All Products",
    "newArrivals": "New Arrivals"
  },
  "product": {
    "addToCart": "ADD TO CART",
    "adding": "ADDING...",
    "added": "ADDED ✓",
    "soldOut": "SOLD OUT",
    "selectSize": "Select Size",
    "selectColor": "Select Color",
    "quantity": "Quantity",
    "description": "Description",
    "details": "Details",
    "shipping": "Shipping & Returns",
    "careInstructions": "Care Instructions",
    "relatedProducts": "You May Also Like",
    "material": "Material",
    "weight": "Weight"
  },
  "cart": {
    "title": "Shopping Cart",
    "empty": "Your cart is empty",
    "continueShopping": "Continue Shopping",
    "subtotal": "Subtotal",
    "shippingNote": "Shipping calculated at checkout",
    "checkout": "CHECKOUT",
    "remove": "Remove"
  },
  "search": {
    "placeholder": "Search products...",
    "noResults": "No products found for",
    "viewAll": "View all results",
    "resultsFor": "results for"
  },
  "collection": {
    "filter": "Filter",
    "sort": "Sort",
    "sortFeatured": "Featured",
    "sortPriceLow": "Price: Low to High",
    "sortPriceHigh": "Price: High to Low",
    "sortNewest": "Newest",
    "sortBestSelling": "Best Selling",
    "noProducts": "No products found",
    "loadMore": "LOAD MORE",
    "inStock": "In Stock",
    "priceRange": "Price Range",
    "applyFilters": "APPLY",
    "clearAll": "Clear All"
  },
  "footer": {
    "shop": "Shop",
    "info": "Info",
    "newsletter": "Newsletter",
    "newsletterPlaceholder": "Enter your email",
    "subscribe": "SUBSCRIBE",
    "subscribeSuccess": "Thank you for subscribing!",
    "aboutUs": "About Us",
    "shippingPolicy": "Shipping Policy",
    "returnsPolicy": "Returns & Exchanges",
    "privacyPolicy": "Privacy Policy",
    "copyright": "© 2026 Roze Silvers. All rights reserved."
  },
  "common": {
    "shopNow": "SHOP NOW",
    "backToHome": "Back to Home",
    "pageNotFound": "Page Not Found",
    "error": "Something went wrong",
    "tryAgain": "Try Again"
  }
}
```

```json
// messages/ar.json
{
  "nav": {
    "home": "الرئيسية",
    "shop": "تسوقي",
    "about": "عن روز سيلفرز",
    "contact": "تواصلي معنا",
    "allProducts": "كل المنتجات",
    "newArrivals": "وصل حديثاً"
  },
  "product": {
    "addToCart": "أضيفي للسلة",
    "adding": "جاري الإضافة...",
    "added": "تمت الإضافة ✓",
    "soldOut": "نفذت الكمية",
    "selectSize": "اختاري المقاس",
    "selectColor": "اختاري اللون",
    "quantity": "الكمية",
    "description": "الوصف",
    "details": "التفاصيل",
    "shipping": "الشحن والإرجاع",
    "careInstructions": "تعليمات العناية",
    "relatedProducts": "قد يعجبك أيضاً",
    "material": "الخامة",
    "weight": "الوزن"
  },
  "cart": {
    "title": "سلة التسوق",
    "empty": "سلتك فارغة",
    "continueShopping": "تابعي التسوق",
    "subtotal": "المجموع",
    "shippingNote": "الشحن يُحسب عند الدفع",
    "checkout": "إتمام الطلب",
    "remove": "حذف"
  },
  "search": {
    "placeholder": "ابحثي عن منتج...",
    "noResults": "لا توجد نتائج لـ",
    "viewAll": "عرض كل النتائج",
    "resultsFor": "نتيجة لـ"
  },
  "collection": {
    "filter": "تصفية",
    "sort": "ترتيب",
    "sortFeatured": "مميز",
    "sortPriceLow": "السعر: من الأقل",
    "sortPriceHigh": "السعر: من الأعلى",
    "sortNewest": "الأحدث",
    "sortBestSelling": "الأكثر مبيعاً",
    "noProducts": "لا توجد منتجات",
    "loadMore": "عرض المزيد",
    "inStock": "متوفر",
    "priceRange": "نطاق السعر",
    "applyFilters": "تطبيق",
    "clearAll": "مسح الكل"
  },
  "footer": {
    "shop": "تسوقي",
    "info": "معلومات",
    "newsletter": "النشرة البريدية",
    "newsletterPlaceholder": "أدخلي بريدك الإلكتروني",
    "subscribe": "اشتركي",
    "subscribeSuccess": "شكراً لاشتراكك!",
    "aboutUs": "عن روز سيلفرز",
    "shippingPolicy": "سياسة الشحن",
    "returnsPolicy": "الإرجاع والاستبدال",
    "privacyPolicy": "سياسة الخصوصية",
    "copyright": "© 2026 روز سيلفرز. جميع الحقوق محفوظة."
  },
  "common": {
    "shopNow": "تسوقي الآن",
    "backToHome": "العودة للرئيسية",
    "pageNotFound": "الصفحة غير موجودة",
    "error": "حدث خطأ",
    "tryAgain": "حاولي مرة أخرى"
  }
}
```

### 10.3 RTL CSS Handling

Use **CSS logical properties** instead of physical ones to handle RTL automatically:

| ❌ Don't Use | ✅ Use Instead | Why |
|-------------|---------------|-----|
| `margin-left: 16px` | `margin-inline-start: 16px` | Flips automatically in RTL |
| `padding-right: 24px` | `padding-inline-end: 24px` | Flips automatically in RTL |
| `text-align: left` | `text-align: start` | Becomes right-aligned in RTL |
| `float: left` | `float: inline-start` | Flips in RTL |
| `left: 0; right: auto` | `inset-inline-start: 0` | Position flips |
| `border-left` | `border-inline-start` | Flips correctly |

**Additional RTL rules:**
* Icons like arrows and chevrons must be **mirrored** in RTL (use `transform: scaleX(-1)` or separate RTL icon variants).
* The mobile menu slides from the **right** in RTL (instead of left).
* Product image gallery thumbnails move to the **right** side in RTL.
* Swiper/carousel direction reverses in RTL: `dir="rtl"` on the carousel container.

### 10.4 Language Switcher

* **Position:** In the header (desktop), at the bottom of the mobile menu (mobile).
* **Design:** Simple text toggle: `EN | AR` or `English | العربية`.
* **Behavior:** Clicking switches the locale in the URL path (`/en/...` ↔ `/ar/...`) while keeping the same page.
* **Product content from Shopify** stays in the language set in Shopify admin (typically English or Arabic depending on the store setup). Translation of product content is managed in Shopify, NOT in the frontend.

---

## 11. Accessibility

### 11.1 WCAG 2.1 AA Compliance

| Area | Requirement |
|------|-------------|
| **Color Contrast** | All text meets 4.5:1 ratio against background. `#111111` on `#F9F9F9` = 17.4:1 ✅. `#777777` on `#FFFFFF` = 4.48:1 (borderline — monitor this). |
| **Focus Indicators** | Every interactive element must have a visible focus ring: `outline: 2px solid #111111; outline-offset: 2px;`. Do NOT remove default focus styles without replacing them. |
| **Keyboard Navigation** | All functionality accessible via keyboard. Tab order must be logical. Modals trap focus. Escape closes modals/drawers. |
| **Screen Reader** | All images have `alt` text. Decorative images use `alt=""`. Icon buttons have `aria-label`. |
| **ARIA Landmarks** | `role="navigation"`, `role="main"`, `role="search"`, etc. Or use semantic HTML elements. |
| **Skip to Content** | Hidden "Skip to main content" link that appears on Tab focus. |

### 11.2 Component-Specific Accessibility

| Component | Requirements |
|-----------|-------------|
| **Mobile Menu** | `aria-expanded` on hamburger button. Focus trapped inside when open. First focusable element (close button) receives focus. |
| **Cart Drawer** | `role="dialog"` with `aria-label="Shopping cart"`. Focus trap. Announce cart count changes with `aria-live="polite"`. |
| **Search Overlay** | `role="search"`. Input has `aria-label="Search products"`. Results are `role="listbox"` with `role="option"` items. |
| **Accordion** | `<button>` trigger with `aria-expanded`. Content panel with `aria-hidden` when collapsed. Uses `id` for `aria-controls`. |
| **Product Images** | All product images have descriptive `alt` text from Shopify. Gallery navigation has `aria-label="Next image"` / `"Previous image"`. |
| **Variant Selector** | Uses `role="radiogroup"` with `role="radio"` for each option. `aria-checked` state. |
| **Quantity Selector** | `−` button: `aria-label="Decrease quantity"`. `+` button: `aria-label="Increase quantity"`. Input: `aria-label="Quantity"`. |
| **Toast Notifications** | `role="alert"` with `aria-live="assertive"`. |
| **Loading States** | Skeleton loaders have `aria-hidden="true"`. Actual content areas have `aria-busy="true"` while loading. |

---

## 12. Deployment & Environment

### 12.1 Hosting

| Item | Choice | Why |
|------|--------|-----|
| **Platform** | **Vercel** | Native Next.js support, Edge Network, automatic HTTPS, preview deployments |
| **Domain** | `rozesilvers.com` | Custom domain connected via Vercel |
| **SSL** | Automatic via Vercel | — |
| **CDN** | Vercel Edge Network | Global edge caching for static assets and ISR pages |

### 12.2 Environment Variables

| Variable | Location | Exposed to Client? |
|----------|----------|-------------------|
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | Vercel Environment Variables | ✅ Yes (public) |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Vercel Environment Variables | ✅ Yes (public — Storefront token is designed to be public) |
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | Vercel Environment Variables | ❌ No (server-side only) |
| `NEXT_PUBLIC_SITE_URL` | Vercel Environment Variables | ✅ Yes |

### 12.3 Deployment Pipeline

1. **Development:** `npm run dev` on `localhost:3000`.
2. **Preview:** Every PR/branch push creates a preview deployment on Vercel.
3. **Production:** Merging to `main` branch triggers production deployment.
4. **Build Command:** `npm run build` (standard Next.js build).
5. **Node Version:** 18.x or 20.x LTS.

### 12.4 `.env.local` Template

```env
# Shopify Storefront API
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=rozesilvers.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token

# Shopify Admin API (server-side only — for advanced operations if needed)
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_access_token

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 12.5 Scripts (package.json)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 13. Constraints — What NOT To Do

> **This section is CRITICAL.** These are hard rules that the AI agent must NEVER violate. Breaking any of these rules will result in a product that does not match the brand or technical requirements.

### 13.1 Design Constraints (Visual)

> All visual constraints from `design.md` section 7 apply. The following is a summary plus additional rules:

| ❌ NEVER DO THIS | ✅ DO THIS INSTEAD | WHY |
|-----------------|-------------------|-----|
| Use `#000000` (pure black) | Use `#111111` or `#1A1A1A` | Pure black is harsh and feels cheap |
| Use bright/loud accent colors (red, neon green, bright blue) | Use muted, desaturated tones | Loud colors destroy the premium feel |
| Use `border-radius` > `2px` on cards/buttons | Use `0px` or max `2px` | Rounded corners look like SaaS/tech, not luxury jewelry |
| Use heavy box shadows | Use ultra-light shadows: `rgba(0,0,0, 0.04)` max | Heavy shadows look like Bootstrap defaults |
| Use font-weight `700`, `800`, `900` | Use `300`, `400`, `500` max | Heavy weights feel aggressive, not elegant |
| Use default system fonts (Arial, Tahoma) | Use Playfair Display, Inter, Amiri, Tajawal | Brand fonts are essential |
| Use bouncy/spring animations | Use slow `cubic-bezier(0.25, 0.46, 0.45, 0.94)` with `0.3s`+ duration | Bouncy = playful ≠ premium |
| Cram elements together (tight margins) | Use generous whitespace (`--space-xl` and above between sections) | Whitespace IS the luxury |
| Use different aspect ratios for product images in the same grid | Use uniform `aspect-ratio` + `object-fit: cover` | Inconsistent images break the grid |
| Add gradient backgrounds, patterns, or textures to sections | Use flat solid colors (`#F9F9F9`, `#FFFFFF`) | Gradients look dated for luxury brands |

### 13.2 Technical Constraints

| ❌ NEVER DO THIS | WHY |
|-----------------|-----|
| Install TailwindCSS, Bootstrap, Material UI, or any CSS framework | We use vanilla CSS Modules. No exceptions. |
| Use `styled-components` or `emotion` | CSS Modules are the standard for this project |
| Build a custom checkout page | Shopify handles checkout. We redirect to `checkoutUrl`. |
| Store sensitive data (admin tokens, customer passwords) on the client | Only `NEXT_PUBLIC_*` vars are exposed. Everything else stays server-side. |
| Use `getServerSideProps` or `getStaticProps` (Pages Router) | We use Next.js **App Router** with React Server Components. No Pages Router. |
| Use `useEffect` for data fetching in Server Components | Server Components fetch data directly (async components). `useEffect` is for Client Components only. |
| Make Storefront API calls from Client Components | All Shopify API calls happen in Server Components or Server Actions. Cart mutations go through Server Actions or API routes. |
| Use `localStorage` for cart persistence | Cart ID goes in a cookie (accessible on the server for SSR). `localStorage` is only for non-critical data (wishlist, recently viewed). |
| Add client-side analytics scripts without `<Script strategy="lazyOnload">` | Third-party scripts must be lazy-loaded to avoid blocking render. |
| Import entire icon libraries | Import only specific icons: `import { LuHeart } from 'react-icons/lu'` |

### 13.3 Content Constraints

| ❌ NEVER DO THIS | WHY |
|-----------------|-----|
| Use placeholder/Lorem Ipsum text in production | All text must be real content from translations or Shopify. Use `<!-- TODO -->` comments for content that needs brand input. |
| Hardcode product data (prices, titles, images) | ALL product data comes from Shopify Storefront API. Zero hardcoded products. |
| Hardcode collection handles that don't exist | Only reference collection handles listed in section 7.1. If a collection doesn't exist yet, gracefully handle the empty state. |
| Use stock photos for products | Product images come ONLY from Shopify. Hero/brand images come from `/public/images/`. |
| Invent brand claims ("Best in Egypt", "Award-winning") | Only use the exact copy provided in section 7.3 or from the brand owner. |

### 13.4 UX Constraints

| ❌ NEVER DO THIS | WHY |
|-----------------|-----|
| Use infinite scroll for product grids | "Load More" button only. Infinite scroll hurts footer access, accessibility, and feels uncontrolled. |
| Use numbered pagination | "Load More" button only. Numbered pagination looks like enterprise software. |
| Add pop-up modals for newsletter/promotions | No pop-ups ever. Newsletter is inline in the footer only. Pop-ups feel cheap and annoying. |
| Use a mega-menu with images and complex dropdowns | Simple text dropdown for "Shop" link. Clean, minimal. |
| Auto-play videos or carousels | Nothing auto-plays. User controls all interactions. |
| Add a "Back to Top" button with a bouncy animation | Smooth scroll, simple fade-in. No bounce. |
| Show "Add to Cart" on hover over product cards (desktop) | "Add to Cart" is only on the Product Detail Page, not on cards. Cards link to the PDP. |
| Implement a custom quantity input (type a number freely) | Use `−` / `+` buttons only, with min=1 and max=10 (or stock limit). |
| Use browser native `confirm()` or `alert()` dialogs | Use custom toast notifications or inline messages. Never native browser dialogs. |

### 13.5 Scope Constraints (What's NOT in MVP)

The following features are explicitly **out of scope** for the initial build. Do NOT implement them unless explicitly asked:

| Feature | Status | Notes |
|---------|--------|-------|
| Customer accounts (custom login/register pages) | ❌ Phase 2 | Use Shopify's hosted account pages for now |
| Wishlist | ❌ Phase 2 | Design is defined but implementation is deferred |
| Product reviews/ratings | ❌ Phase 2 | Requires third-party integration (Judge.me, Yotpo) |
| Multi-currency support | ❌ Phase 2 | Single currency (EGP) for now |
| Discount code input on cart page | ❌ Phase 2 | Handled by Shopify checkout |
| Live chat widget | ❌ Out of scope | Would need third-party integration |
| Blog / Articles section | ❌ Out of scope | Not part of the brand strategy currently |
| Gift wrapping / Gift cards | ❌ Out of scope | May be added later in Shopify |
| Product comparison | ❌ Out of scope | Not typical for jewelry stores |
| Size recommendation / quiz | ❌ Phase 2 | Interesting feature for later |
| Push notifications | ❌ Out of scope | Not appropriate for the brand |
| PWA / Offline mode | ❌ Out of scope | Standard website is sufficient |

### 13.6 Code Quality Constraints

| Rule | Detail |
|------|--------|
| **TypeScript strict mode** | `strict: true` in `tsconfig.json`. No `any` types except for truly untyped third-party data. |
| **No `eslint-disable` without comment** | Every disable must have a reason comment. |
| **Component file limit** | No single component file should exceed 300 lines. Split into sub-components. |
| **CSS Module naming** | Use camelCase for class names: `.productCard`, `.heroTitle`. No BEM, no kebab-case. |
| **No inline styles** | All styles in CSS Modules. Exception: truly dynamic values (e.g., `style={{ '--count': quantity }}`). |
| **No magic numbers in CSS** | Use CSS custom properties from the design system (`var(--space-lg)`, `var(--color-primary)`). |
| **Meaningful commit messages** | Follow conventional commits: `feat:`, `fix:`, `style:`, `refactor:`, etc. |
| **Console.log cleanup** | No `console.log` in production code. Use `console.error` for actual errors only. |

---

## Summary

This PRD, combined with `design.md`, provides everything needed to build the Roze Silvers storefront:

| Document | Covers |
|----------|--------|
| **PRD.md** (this file) | What to build, how it works, what data it uses, what NOT to do |
| **design.md** | How it looks — every color, font, spacing, animation, and mobile behavior |

**The AI agent should:**
1. Read `design.md` first for visual reference
2. Follow this PRD for architecture, features, and technical decisions
3. Never deviate from the constraints in Section 13
4. When in doubt about a visual decision → refer to `design.md`
5. When in doubt about a feature decision → it's probably out of scope (Section 13.5)
