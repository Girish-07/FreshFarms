# FreshFarm

FreshFarm is a farm-to-home shopping app for browsing local farmers and fresh
products, managing a cart, and placing Cash on Delivery orders.

## Features

- Browse, search, sort, and filter products by category or farmer.
- View farmer profiles and the products they offer.
- Create an account, sign in, and manage a profile and saved addresses.
- Add products to a persistent cart and place orders.
- Review order history and order details.

## Tech stack

- Frontend: React, Vite, Tailwind CSS, Zustand, React Router
- Backend: Node.js, Express, MongoDB with Mongoose (optional)

## Run locally

Install dependencies and start the backend:

```bash
cd Backend
npm install
npm run backend
```

The API runs at `http://localhost:5000`. Without `MONGODB_URI`, the backend
uses its in-memory data stores; changes to users and orders are not persisted
between restarts.

In a second terminal, start the frontend:

```bash
cd Frontend
npm install
npm run dev
```

The frontend uses `http://localhost:5000/api` by default. To use a different
API URL, set `VITE_API_URL` in `Frontend/.env`, for example:

```env
VITE_API_URL=http://localhost:5000/api
```

## Optional MongoDB setup

Set `MONGODB_URI` in `Backend/.env` to your MongoDB connection string. You can
also set `PORT` (defaults to `5000`) and `FRONTEND_URL` (allowed frontend
origin). To load the catalog into MongoDB, run from the `Backend` directory:

```bash
npm run seed
```

Keep local `.env` files private and do not commit credentials.

## Checks

Run from the relevant directory:

```bash
# Frontend
npm run lint
npm run build

# Backend
npm test
```
