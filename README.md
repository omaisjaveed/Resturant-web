<div align="center">

# 🍛 Bongou Soul — Taste of Excellence

**A genuine fusion of Soul Food & Haitian Flavors**

Full-stack restaurant e-commerce platform with Next.js 15 frontend, Express/TypeScript backend, MySQL database, and Stripe payment integration.

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Stripe-500AF9?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

</div>

---

## ✨ Key Features

### 🛒 Customer-Facing (Frontend)
- **Restaurant Landing Page** — Hero section, featured menu, testimonials, about, and contact
- **Dynamic Menu Browser** — Browse menu items with category filters and product details modal
- **Shopping Cart** — Real-time cart management with floating cart button & drawer interface (Zustand)
- **Secure Checkout** — Stripe payment integration with payment intent flow
- **About & Contact Pages** — Restaurant story, journey timeline, and contact form submissions
- **Responsive Design** — Fully optimized for mobile, tablet, and desktop
- **Smooth Animations** — Framer Motion powered UI transitions and micro-interactions

### ⚙️ Admin Panel (Dashboard)
- **Admin Auth** — JWT-based protected login system with role-based access
- **Dashboard Analytics** — Live stats: products, categories, orders, user counts
- **Menu Management** — Full CRUD for categories and food products
- **Order Tracking** — View, track, and manage customer orders
- **Media Library** — Upload and manage product images via Multer
- **Page CMS** — Edit Home page content and About page content dynamically
- **Testimonials** — Manage customer testimonials carousel
- **Site Settings** — Configure Stripe API keys, SMTP, and global site settings
- **Contact Messages** — View and manage contact form submissions

### 🔌 Backend API
- **RESTful Architecture** — Clean, modular Express API with TypeScript
- **Authentication** — JWT tokens + bcrypt password hashing
- **CORS Security** — Environment-aware CORS origin whitelisting
- **Database Layer** — MySQL2 with custom ORM-style models
- **File Uploads** — UUID-named file storage with static file serving
- **Stripe Webhooks** — Payment confirmation and order status handling
- **Error Handling** — Production-safe error responses (no stack traces in prod)
- **DB Migrations & Seeds** — Structured migration scripts + default data seeding

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4, Tailwind Merge, CVA (class-variance-authority) |
| **State** | Zustand (cart state) |
| **UI Components** | Radix UI (Dialog), Lucide React Icons, Framer Motion |
| **Fonts** | Next.js Google Fonts (Inter + Outfit) |
| **Forms & Validation** | React Hook Form + Zod resolvers |
| **Payments** | Stripe.js + React Stripe Checkout |
| **Backend** | Node.js, Express.js 4, TypeScript 5 |
| **Database** | MySQL 8 via mysql2 driver |
| **Auth** | JSON Web Tokens (jsonwebtoken), bcryptjs |
| **File Storage** | Multer, UUID-based file naming |
| **Runtime & Build** | ts-node (dev), TSC build (prod) |

---

## 📁 Project Structure

```
bongou_food_resturant/
├── backend/                    # Express API (TypeScript)
│   ├── src/
│   │   ├── config/             # Database connection setup
│   │   ├── controllers/        # Request handlers (11 modules)
│   │   ├── middleware/         # Auth & role-based access middleware
│   │   ├── migrations/         # Database migration scripts
│   │   ├── models/             # MySQL data models
│   │   ├── routes/             # REST API route definitions
│   │   ├── index.ts            # Express app entry + route mounts
│   │   ├── initDb.ts           # Auto-create tables on first run
│   │   └── seed.ts             # Seed default admin + sample data
│   ├── dist/                   # Compiled JS output (auto-generated)
│   ├── uploads/                # User-uploaded media files
│   ├── .env.development        # Dev environment template
│   ├── .env.production         # Prod environment template
│   ├── dev.bat                 # → Start backend in dev mode
│   ├── prod.bat                # → Build & start backend in prod mode
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                   # Next.js 15 Web App
    ├── app/
    │   ├── page.tsx            # Home page (landing)
    │   ├── menu/page.tsx       # Menu listing
    │   ├── about/page.tsx      # About us page
    │   ├── contact/page.tsx    # Contact page
    │   ├── checkout/page.tsx   # Checkout + Stripe payment
    │   └── admin/              # Admin panel routes
    │       ├── login/
    │       ├── dashboard/
    │       ├── categories/
    │       ├── products/
    │       ├── orders/
    │       ├── media/
    │       ├── testimonials/
    │       ├── home/
    │       ├── about/
    │       ├── settings/
    │       └── contact/
    ├── components/             # Shared UI components
    ├── hooks/                  # Custom React hooks
    ├── lib/                    # API client + utilities
    ├── store/                  # Zustand stores (cart)
    ├── .env.development        # Dev API endpoint
    ├── .env.production         # Prod API endpoint
    ├── dev.bat                 # → Start frontend in dev mode
    ├── prod.bat                # → Build & start frontend in prod
    ├── next.config.ts
    ├── tailwind.config.* (v4)
    ├── postcss.config.mjs
    ├── package.json
    └── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 22 (Recommended)
- **MySQL** ≥ 8.0
- **npm** (bundled with Node.js)
- A **Stripe account** for payment processing (optional for testing)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bongou-soul-restaurant.git
cd bongou-soul-restaurant
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd ../frontend
npm install
```

### 3. Configure Environment Variables

**Backend:**
```bash
cd backend
# Copy .env.development → .env  (or use dev.bat which does this automatically)
copy .env.development .env      # Windows
# OR
cp .env.development .env        # Linux/Mac
```

Edit the `.env` file with your MySQL credentials:
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_NAME=bongou
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_super_secret_jwt_key_change_me
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

**Frontend:**
```bash
cd frontend
# Copy .env.development → .env.local
copy .env.development .env.local
```

Default frontend env:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Initialize Database

```bash
cd backend
npm run init-db    # Creates all tables automatically
npm run seed       # Seeds default admin user + sample data
```

> 💡 Default admin credentials after seed — check the seed script output or update in `backend/src/seed.ts`.

---

## 🔄 Running Locally (Development Mode)

Open **two separate terminals**:

#### Terminal 1 — Backend API
```bash
cd backend
dev.bat           # Windows
# OR
cp .env.development .env && npm run dev   # Linux/Mac
```
→ Backend API runs on `http://localhost:5000`

#### Terminal 2 — Frontend App
```bash
cd frontend
dev.bat           # Windows
# OR
cp .env.development .env.local && npm run dev   # Linux/Mac
```
→ Frontend runs on `http://localhost:3000`

Now visit **http://localhost:3000** in your browser.

---

## 🎛️ Environment Variables Reference

### Backend `backend/.env`

| Variable | Description | Dev Default |
|---|---|---|
| `NODE_ENV` | Runtime mode | `development` |
| `PORT` | Express server port | `5000` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_NAME` | MySQL database name | `bongou` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | _(empty)_ |
| `JWT_SECRET` | JWT signing secret | — |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `BCRYPT_ROUNDS` | Password hashing cost | `10` (dev), `12` (prod) |

### Frontend `frontend/.env.local`

| Variable | Description | Dev Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |

> 🔐 **Stripe keys** (publishable & secret) are stored **in the database** via Admin → Settings. They are never committed to `.env` files.

---

## 🚢 Production Deployment

### Automated Build Scripts (Windows)

Both folders include `prod.bat` scripts that:
1. Copy the `.env.production` config to active env files
2. Clean old build artifacts (`dist/` or `.next/`)
3. Run production build
4. Start the app in production mode

#### Build Backend
```bash
cd backend
prod.bat
# Uploads: dist/ + uploads/ + package*.json + .env to server
```

#### Build Frontend
```bash
cd frontend
prod.bat
# Uploads: .next/ + public/ + package*.json + server.js to server
```

### Manual Deployment Steps

1. **Backend**
   - `npm run build` → compiles TS → `dist/`
   - On server: `npm install --production`
   - Node entry: `node dist/index.js`
   - Serve uploads statically via `/uploads` route

2. **Frontend**
   - `npm run build` → `.next/` output
   - `npm run start` → serves on port 3000 (default)
   - Reverse-proxy via nginx/Apache Passenger as needed

### Dev / Prod Behavior Differences

| Aspect | Development | Production |
|---|---|---|
| Request logging | All requests logged to console | Disabled |
| CORS origins | `localhost:3000` + all allowed | Whitelist only |
| Error responses | Full stack trace | Generic "Internal server error" |
| TS execution | `ts-node` (on-the-fly) | Pre-compiled `dist/*.js` |
| bcrypt rounds | `10` (fast) | `12` (secure) |
| Next.js mode | HMR dev server | Optimized static + SSR build |

---

## 🧩 API Endpoints (Overview)

All prefixed with `/api` (dev) or `/bongou-api/api` (prod subpath).

| Endpoint Group | Methods | Purpose |
|---|---|---|
| `/auth/*` | POST | Admin login / register / profile |
| `/categories/*` | CRUD | Menu categories |
| `/products/*` | CRUD | Food items / menu |
| `/orders/*` | GET, POST | Customer orders |
| `/media/*` | POST, DELETE | Image uploads |
| `/testimonials/*` | CRUD | Customer testimonials |
| `/home-page/*` | GET, PUT | Home page CMS |
| `/about-page/*` | GET, PUT | About page CMS |
| `/contact/*` | GET, POST | Contact form messages |
| `/settings/*` | GET, PUT | Site settings (Stripe keys etc.) |
| `/stripe/*` | POST | Create PaymentIntent + webhooks |
| `/dashboard/stats` | GET | Admin overview stats |
| `/` (root) | GET | Health check endpoint |

---

## 📜 Available npm Scripts

### Backend (`/backend`)
```bash
npm run build        # Compile TypeScript → dist/
npm run start        # Run production build (dist/index.js)
npm run dev          # Run with ts-node (hot reload)
npm run init-db      # Create MySQL tables if missing
npm run seed         # Seed admin user + sample data
npm run migrate:about  # Add about_page content table
npm run seed:about     # Populate about_page defaults
```

### Frontend (`/frontend`)
```bash
npm run dev          # Next.js dev server (localhost:3000)
npm run build        # Production build → .next/
npm run start        # Start Next.js prod server
npm run lint         # ESLint check
npm run clean        # Clear Next.js cache
```

---

## 🔐 Security Notes

- Never commit `.env` files with real credentials to git (both have `.gitignore` entries for `.env` / `.env.local`)
- Always change the default `JWT_SECRET` before deploying
- Use **strong** MySQL passwords and **restricted** DB users in production
- Stripe webhook secrets should be validated in the Stripe controller
- Admin routes are protected by `authMiddleware` + `adminMiddleware` (double guard)
- Upload folder only serves static images — no executable file uploads allowed

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📝 License

Distributed under the **MIT License** — use freely for personal or commercial projects.

---

<div align="center">

### 🧑‍🍳 Made with love for great food experiences.

**Bongou Soul** — *Where every bite tells a story.*

</div>
