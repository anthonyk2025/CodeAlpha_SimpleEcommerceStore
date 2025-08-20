# TechNova Simple E‑Commerce Store

Stack: **Express.js + MongoDB** backend, **HTML/CSS/JS** frontend.

## Features
- Product listing & details
- Shopping cart (localStorage)
- User registration & login (JWT)
- Order checkout & "My Orders"

## Quick Start

1) Install dependencies:
```bash
npm install
```

2) Configure environment:
```bash
cp backend/.env.example backend/.env
# edit backend/.env -> set MONGO_URI and JWT_SECRET
```

3) Seed sample products:
```bash
npm run seed
```

4) Start the server (serves API + static frontend):
```bash
npm run dev
```
Open: http://localhost:5000

### API Endpoints
- `GET /api/products` — list products
- `GET /api/products/:id` — product details
- `POST /api/users/register` — register { name, email, password }
- `POST /api/users/login` — login { email, password } -> { token }
- `POST /api/orders` — place order (Bearer token)
- `GET /api/orders/my` — view my orders (Bearer token)

Enjoy! 🎉
