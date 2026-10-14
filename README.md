# FORME Living — Contemporary Architectural Furniture & Living Atelier

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38b2ac.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A digital commerce platform for contemporary luxury furniture and architectural interiors, engineered with modern editorial restraint, financial integrity, and full-stack production craftsmanship.

---

## 🏛️ Project Vision & Brand Identity

**FORME Living** is an online furniture atelier specializing in contemporary living pieces designed with architectural silhouette, tactile materiality (Belgian bouclé, Roman travertine, Nigerian black walnut, smoked ash), and enduring craftsmanship. 

Unlike generic e-commerce templates, FORME Living was engineered to feel like a high-end luxury brand with:
- **Calm, High-End Aesthetic**: A bespoke palette of Ivory (`#FBFBF9`), Warm Charcoal (`#18181B`), Sand/Cream (`#F4F3EF`), Terracotta (`#C2634B`), and Deep Olive (`#3B4237`).
- **Editorial Typography**: Typographic hierarchy pairing *Cormorant Garamond* / *DM Serif Display* with *Plus Jakarta Sans*.
- **Subtle Micro-Interactions**: Smooth drawer reveals, animated bag counts, interactive timber finish swatches, and tactile hover states.
- **Financial & Architectural Realism**: Authentic Nigerian commercial context, supporting integer currency storage in kobo (`₦1 = 100 kobo`), tiered White-Glove room-of-choice installation, and Paystack payment gateway tokenization.

---

## 📐 Full-Stack Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Vite + React)                     │
│                                                                        │
│   ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────┐   │
│   │   AuthContext   │    │   CartContext   │    │ WishlistContext  │   │
│   │  (JWT Session)  │    │ (Local Storage) │    │ (Local Storage)  │   │
│   └────────┬────────┘    └────────┬────────┘    └────────┬─────────┘   │
│            │                      │                      │             │
│            ▼                      ▼                      ▼             │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │  Pages: /shop, /product/:slug, /checkout, /account, /admin,    │   │
│   │         /story, /journal, /wishlist                            │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │ Axios Interceptors (Bearer Token)  │
│                                   ▼                                    │
│                    ┌────────────────────────────┐                      │
│                    │     Typed API Services     │                      │
│                    │ (auth, product, order API) │                      │
│                    └──────────────┬─────────────┘                      │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │ HTTP / REST
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    COMMERCE BACKEND ENGINE (Express)                   │
│                                                                        │
│   ┌──────────────────┐    ┌──────────────────┐    ┌────────────────┐   │
│   │   /api/auth      │    │  /api/products   │    │  /api/orders   │   │
│   │  • Register      │    │  • Full-Text Qs  │    │  • Create      │   │
│   │  • Login (JWT)   │    │  • Multi-Filter  │    │  • My Orders   │   │
│   │  • GetMe/Profile │    │  • Slug lookup   │    │  • Admin Stats │   │
│   └────────┬─────────┘    └────────┬─────────┘    └────────┬───────┘   │
│            │                       │                       │           │
│            ▼                       ▼                       ▼           │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │       Mongoose ODM Layer (Indexing, Validation & Virtuals)     │   │
│   │       User  |  Product  |  Order  |  Review Models             │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Feature Matrix

| Feature Domain | Capabilities |
| :--- | :--- |
| **Catalog & Filtering** | Live multi-criteria filtering by category, collection, price range slider, and material (Bouclé, Oak, Travertine, Walnut). 5 dynamic sort modes. Resilient API integration with instant mock data fallback. |
| **Product Experience** | High-resolution image galleries, interactive material & finish variant switchers, live price recalculation, dimensional blueprints, tabbed architectural dossiers (Joinery, Care, Warranty). |
| **Shopping Bag & Drawer** | Slide-over cart drawer, quantity stepper, free white-glove shipping threshold progress meter (`₦1,500,000`), item deletion, subtotal calculations. |
| **Distraction-Free Checkout** | 3-step luxury checkout (`/checkout`): Client contact, residence details (Nigerian/international phone formatting), White-Glove installation tiers, Paystack payment tokenization simulator, promo voucher codes (`WELCOME10`, `ARCHITECT15`), and official commission dossier with 1-click tax invoice printing. |
| **Client Account & VIP Portal** | Tabbed client authentication with 1-click VIP demo sign-in. Order history tracking with fulfillment milestone badges, address book with modal creator, material swatch dispatch requests, and 1-on-1 spatial consultation bookings. |
| **Curated Wishlist** | Private client portfolio (`/wishlist`) with item management, bulk "Move All to Bag", and clipboard portfolio link sharing. |
| **Atelier Admin OS** | Executive control center (`/admin`): Gross revenue metrics, order pipeline tracking, full catalog CRUD with image upload preview and decommissioning, commission fulfillment status updates (`Processing` → `Shipped` → `Delivered`), and high-net-worth client directory. |
| **Editorial Story & Journal** | Dedicated Brand Story (`/story`) covering West African timber provenance, sustainable forestry pledge, and the Journal (`/journal`) with modal essay readers on architectural interior theory. |

---

## 🛠️ Technology Stack

### Frontend (`/client`)
- **React 18.3** & **TypeScript 5.6** in Strict Mode
- **Vite 6** for instant HMR and Rollup-optimized production builds
- **Tailwind CSS 3.4** configured with custom luxury design tokens
- **Lucide React** for architectural line iconography
- **React Router 6** with declarative deep-linking and state preservation
- **Axios** with global request/response interceptors for token management

### Backend (`/server`)
- **Node.js** & **Express** with modern TypeScript
- **MongoDB** & **Mongoose 8** with strict schema indexing and lean querying
- **JSON Web Tokens (JWT)** & **bcryptjs** password hashing (12 salt rounds)
- **Zod** for payload validation
- **Helmet**, **Morgan**, and **CORS** middleware

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js** v18 or newer
- **npm** v9 or newer

### 2. Setup & Installation
```bash
# Clone repository
git clone https://github.com/yourusername/forme-living.git
cd forme-living

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Environment Variables

Create `.env` in the `server` directory:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/forme_living
JWT_SECRET=super_secret_atelier_jwt_key_2025
JWT_EXPIRES_IN=7d
PAYSTACK_SECRET_KEY=sk_test_sample_key
```

### 4. Running the Application

```bash
# Terminal 1: Run the Backend Engine
cd server
npm run dev

# Terminal 2: Run the Client Storefront
cd client
npm run dev
```

Visit **`http://localhost:5173`** to explore the storefront, or **`http://localhost:5000/api/health`** for the API health status.

---

## 🧪 Quick Showcase Credentials

For evaluators and reviewers testing the application:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **VIP Client** | `client@forme.com` | `password123` | Full customer checkout, orders history, address book |
| **Atelier Admin** | `admin@forme.com` | `password123` | Full access to `/admin` dashboard, catalog CRUD, logistics |
| **One-Click Demo** | Use the *"Demo VIP Client"* or *"Unlock Admin Showcase Mode"* buttons on `/account` and `/admin` |

---

## 📄 API Documentation

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | Public | System status, database health, uptime |
| `/api/auth/register` | `POST` | Public | Register new client account |
| `/api/auth/login` | `POST` | Public | Authenticate user & issue JWT |
| `/api/auth/me` | `GET` | User | Get current profile |
| `/api/products` | `GET` | Public | Paginated product search, category & price filters |
| `/api/products/:slug` | `GET` | Public | Get single product by slug |
| `/api/products` | `POST` | Admin | Create new catalog item |
| `/api/orders` | `POST` | Optional | Create commission with stock validation |
| `/api/orders/my` | `GET` | User | Get client's past orders |
| `/api/orders/:orderNumber` | `GET` | User/Admin | Detailed commission dossier |

---

## 📜 License

Distributed under the MIT License. Built with architectural care for developer portfolio showcase.
