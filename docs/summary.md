# SmartShop Architecture & Features (Summary)

SmartShop is a full-stack e-commerce application that combines a React frontend (Vite + Tailwind) with a Python Flask backend. It implements authentication, products and orders APIs, server-side cart persistence, admin dashboards, search/filtering, and simulated checkout with email confirmations.

## Architecture
- React SPA served by Vite; state managed via Contexts: `AuthContext`, `CartContext`
- Flask REST API (`/api/*`) with JWT-based auth (plus optional cookie session) using Flask-Login integration
- SQLAlchemy ORM models: `User`, `Product`, `Category`, `Order`, `OrderItem`, `CartItem`
- SQLite for development, PostgreSQL in production via `DATABASE_URL`
- Email notifications using Flask-Mail
- CORS enabled for the frontend origin

## Key Features
- Signup, Login, Logout; JWT token stored in localStorage
- Product listing, detail view, search by keyword, filter by category and price range
- Cart with guest storage and server-side persistence for logged-in users
- Checkout simulation that marks orders as paid and sends confirmation emails
- Orders: list and detail for users; admins can see all and update status
- Admin dashboard: create/delete products and manage orders

## Security & Roles
- Password hashing via Werkzeug
- JWT with role claim (`user` or `admin`); admin-only endpoints are protected
- Optional HttpOnly cookie-based session for environments needing session auth

## Deployment
- Backend deployable to Render/Heroku using Gunicorn (`Procfile` provided)
- Frontend deployable to Vercel/Netlify (`dist` output)
- Environment variables control secrets, DB, and email settings

## Getting Started
1. Backend: `pip install -r requirements.txt && flask run`
2. Frontend: `npm install && npm run dev`
3. Admin user is auto-created from env (`ADMIN_EMAIL`, `ADMIN_PASSWORD`)

## API Highlights
- Auth: `/api/auth/signup`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`
- Products: `/api/products`, `/api/products/:id`, `/api/categories`
- Cart: `/api/cart`
- Orders: `/api/orders`, `/api/orders/:id`, `/api/checkout`, `/api/orders/:id/status (admin)`

## Evaluation Mapping
- Homepage & Product Listing: Home.jsx, ProductList.jsx
- Cart + State: CartContext.jsx, Cart.jsx
- Authentication: AuthContext.jsx + auth resources
- Product & Order API: products.py, orders.py
- Checkout & Order Mgmt: Checkout.jsx + orders endpoints
- Admin Dashboard & Roles: Admin pages + admin_required
- Database: SQLAlchemy models + SQLite/Postgres
- Search/Filter: ProductList filters + products resource
- Code Quality: modularized, commented, clean structure