# Mini E-commerce Store (MERN)

A full-stack e-commerce app: product listing, cart, checkout, order history, and an admin panel — built with **React (Vite + Tailwind) + Express + MongoDB**.

## Project structure

```
mini-ecommerce/
├── backend/
│   ├── config/db.js
│   ├── models/          Product, User, Order
│   ├── controllers/     product/auth/order logic
│   ├── routes/          product/auth/order routes
│   ├── middleware/      JWT auth + admin guard
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/        Home, ProductDetail, Cart, Login, Signup, Checkout, MyOrders, Admin
    │   ├── components/   Navbar, ProductCard, PrivateRoute
    │   ├── context/       AuthContext, CartContext
    │   └── api/axios.js
    └── vite.config.js
```

## 1. Set up MongoDB

- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Get your connection string (looks like `mongodb+srv://user:pass@cluster.mongodb.net/mini-ecommerce`)

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env: paste your MONGO_URI, and set any JWT_SECRET string
npm run dev
```
Runs on `http://localhost:5000`. Test it: visit `http://localhost:5000` → should say "API is running...".

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173` (Vite dev server), and proxies `/api` calls to your backend (see `vite.config.js`).

## 4. Create your first admin user

The signup form creates regular users only (`isAdmin: false` by default). To make yourself an admin:
1. Sign up normally through the app.
2. In MongoDB Atlas (or Compass), open the `users` collection, find your user, and manually set `isAdmin: true`.
3. Log out and log back in — you'll now see the "Admin" link in the navbar.

## 5. Add some products

Once logged in as admin, go to `/admin` and use the "Add Product" form. You'll need direct image URLs (e.g. from Unsplash) for the `image` field for now — file upload isn't included in this scaffold but is a natural next step (see below).

## API reference

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | — | Create account |
| POST | /api/auth/login | — | Login, get JWT |
| GET | /api/products | — | List products (supports `?search=` and `?category=`) |
| GET | /api/products/:id | — | Get one product |
| POST | /api/products | admin | Create product |
| PUT | /api/products/:id | admin | Update product |
| DELETE | /api/products/:id | admin | Delete product |
| POST | /api/orders | user | Place an order |
| GET | /api/orders/my | user | My order history |
| GET | /api/orders | admin | All orders |
| PUT | /api/orders/:id/status | admin | Update order status |

## Natural next steps (in order of impact)

1. **Image uploads** — add Cloudinary or Multer + local storage so admins upload files instead of pasting URLs.
2. **Real payments** — integrate Stripe Checkout (test mode) instead of the current "place order" button.
3. **Pagination** — the products list will get slow past ~50 items; add `limit`/`skip` params.
4. **Reviews & ratings** — extend the Product model with an embedded reviews array.
5. **Deploy** — frontend → Vercel/Netlify (build with `npm run build`), backend → Render/Railway, DB → Atlas (already cloud-hosted).

## Notes

- Cart is stored in `localStorage` — it persists across refreshes without needing a DB round trip. Swap this for a DB-backed cart per user if you want cross-device sync.
- Auth uses JWT stored in `localStorage`, attached automatically via the axios interceptor in `src/api/axios.js`.
- Styling uses Tailwind utility classes directly — no separate CSS files besides the Tailwind directives.
