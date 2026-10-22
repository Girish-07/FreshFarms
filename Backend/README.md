# FreshFarm backend

This backend provides a small product catalog and customer ordering API that
the frontend can consume immediately.

## Run locally

```bash
npm install
npm run backend
```

The server runs at `http://localhost:5000`. If `MONGODB_URI` is not configured,
it uses the built-in catalog data, so MongoDB is not required for local
frontend development.

To use MongoDB, copy `.env.example` to `.env` and set `MONGODB_URI`.
Then import the complete frontend catalog into MongoDB:

```bash
npm run seed
```

The seed is safe to run more than once. It upserts products by their stable
IDs, so it updates existing catalog records instead of creating duplicates.

## Endpoints

- `GET /api/health` - server and database mode
- `GET /api/products` - list products
- `GET /api/products/:id` - product details
- `GET /api/products?category=Fruits` - filter by category
- `GET /api/products?search=mango` - search product name and description
- `POST /api/auth/register` - create a customer account
- `POST /api/auth/login` - sign in and receive the user's ID
- `GET /api/auth/me` - get the signed-in user
- `PATCH /api/auth/me` - update name, email, phone, profile picture URL, or password
- `POST /api/orders` - place a Cash on Delivery order
- `GET /api/orders` - list the signed-in user's orders
- `GET /api/orders/:orderNumber` - view one of the signed-in user's orders

Send the user ID returned from registration or login in the bearer header when
loading user-specific data:

```text
Authorization: Bearer <token>
```

Responses use a consistent `{ "data": ... }` shape. Errors use
`{ "error": "..." }`.
