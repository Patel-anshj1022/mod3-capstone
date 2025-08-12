# SmartShop Full-Stack (React + Flask)

A production-ready e-commerce app featuring a React frontend (Vite + Tailwind) and a Flask backend (JWT auth, SQLAlchemy ORM, RESTful API), including admin dashboards, order management, server-side cart persistence, search/filters, and email confirmations.

## Tech Stack
- Frontend: React (Hooks, Context), Vite, Tailwind CSS, React Router
- Backend: Flask, Flask-RESTful, Flask-JWT-Extended, Flask-Login, Flask-SQLAlchemy, Flask-Migrate, Flask-Mail, Flask-CORS
- DB: SQLite (dev) / PostgreSQL (prod)

## Repo Structure
```
backend/
  app/
    __init__.py
    config.py
    extensions.py
    models.py
    schemas.py
    email_utils.py
    resources/
      __init__.py
      auth.py
      products.py
      orders.py
      cart.py
      users.py
  wsgi.py
  requirements.txt
  .env.example
  Procfile
frontend/
  src/
    api/
      client.js
    components/
      Header.jsx
      ProductCard.jsx
    context/
      AuthContext.jsx
      CartContext.jsx
    pages/
      Home.jsx
      ProductList.jsx
      ProductDetail.jsx
      Cart.jsx
      Checkout.jsx
      Orders.jsx
      OrderDetail.jsx
      Admin/
        Products.jsx
        Orders.jsx
    App.jsx
    index.css
    main.jsx
  index.html
  package.json
  vite.config.js
  tailwind.config.cjs
  postcss.config.cjs
  .env.example
```

## Local Development

### Backend
1. Create and activate a virtualenv (recommended)
2. Copy `.env.example` to `.env` and adjust values
3. Install deps and run the server

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# Optional: run a local mail server to observe emails in console
# python -m smtpd -c DebuggingServer -n localhost:8025
export FLASK_APP=wsgi.py
flask run --debug
```

The backend will be at `http://localhost:5000`.

### Frontend
1. Copy `.env.example` to `.env` and adjust `VITE_API_URL` if needed
2. Install deps and run dev server

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` and proxies `/api` to the backend.

## Production Deployment

### Backend (Render/Heroku)
- Provide environment vars: `SECRET_KEY`, `JWT_SECRET_KEY`, `DATABASE_URL`, mail settings, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- Use `web: gunicorn wsgi:app` in Procfile
- On Render: set Start Command to `gunicorn wsgi:app --workers=4 --threads=8 --timeout=120`

### Frontend (Vercel/Netlify)
- Set `VITE_API_URL` to your backend URL
- Build command: `npm run build`
- Output directory: `dist`

## API Overview (examples)

- POST `/api/auth/signup` body `{ name, email, password }`
- POST `/api/auth/login` body `{ email, password }` -> `{ accessToken, user }`
- GET `/api/auth/me` (Bearer token)
- POST `/api/auth/logout`

- GET `/api/products?q=phone&category=Electronics&minPrice=100&maxPrice=1000`
- GET `/api/products/:id`
- POST `/api/products` (admin) `{ title, description?, price, image_url?, inventory, category? }`
- PUT `/api/products/:id` (admin)
- DELETE `/api/products/:id` (admin)

- GET `/api/categories`

- GET `/api/cart` (auth)
- POST `/api/cart` (auth) `{ items: [{ productId, quantity }] }`
- DELETE `/api/cart` (auth)

- POST `/api/orders` (auth) `{ items: [{ productId, quantity }] }`
- GET `/api/orders` (auth) -> user's orders; `?all=true` for admin
- GET `/api/orders/:id` (auth)
- PUT `/api/orders/:id/status` (admin) `{ status: 'paid'|'shipped'|'delivered'|'cancelled'|'pending' }`
- POST `/api/checkout` (auth) `{ orderId }` -> marks as paid and sends email

### Sample curl
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup -H 'Content-Type: application/json' \
  -d '{"name":"Alice","email":"alice@example.com","password":"pass1234"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","password":"pass1234"}' | jq -r .accessToken)

# List products
curl http://localhost:5000/api/products

# Create order
curl -X POST http://localhost:5000/api/orders -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"items":[{"productId":1,"quantity":1}]}'
```

## Notes
- Admin user is auto-created based on env vars on first request.
- Server-side cart persists when logged in; guests use localStorage.
- Email confirmations require an SMTP server; in dev configure `MAIL_SERVER=localhost` and run a debug server.

## Extra Features Ideas
- Product images upload (S3/Cloudinary)
- Wishlists and product reviews
- Stripe integration for real payments (test mode)
- Inventory low-stock alerts for admins
- Advanced search (multi-field, sorting)
- Rate limiting and audit logging

## License
MIT

