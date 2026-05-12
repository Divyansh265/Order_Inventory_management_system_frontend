# Frontend — Order & Inventory Management

React admin panel for managing products, orders, and inventory.

## Tech Stack

- React 18
- React Router v6
- Axios
- Tailwind CSS
- Vite

## Prerequisites

- Node.js v18+
- Backend server running on `http://localhost:5000`

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

The `.env` file is already set up to use Vite's proxy:

```env
VITE_API_URL=/api/v1
```

This routes all API calls through Vite's dev server proxy to avoid CORS issues during development.

### 3. Start the dev server

```bash
npm run dev
```

App runs at `http://localhost:5173`

> Make sure the backend is running before starting the frontend.

## Available Scripts

| Script          | Description                  |
|-----------------|------------------------------|
| `npm run dev`   | Start dev server             |
| `npm run build` | Build for production         |
| `npm run preview` | Preview production build   |

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js          # Axios instance + interceptors
│   ├── components/
│   │   ├── common/           # Badge, Modal, Pagination, Spinner
│   │   └── layout/           # Layout, Sidebar
│   ├── context/
│   │   └── AuthContext.jsx   # Auth state + login/logout
│   ├── pages/
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── Products/
│   │   ├── Orders/
│   │   └── Profile/
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   ├── App.jsx
│   └── main.jsx
├── .env
├── vite.config.js
└── package.json
```

## Pages

**Login** — Email/password login with validation and error handling.

**Dashboard** — Overview stats: total products, total orders, low stock alerts, recent orders.

**Products** — Full product management. Admins can create, edit, and delete. All users can search and browse.

**Orders** — Create orders with multiple items. Admins can complete or cancel pending orders. Click View to see full order details.

**Profile** — Shows the logged-in user's name, email, and role.

## Authentication

Tokens are stored in `localStorage`. The Axios interceptor automatically:
- Attaches the access token to every request
- Attempts a token refresh if a 401 is received
- Redirects to `/login` if the refresh also fails

## Production Build

For production, update `VITE_API_URL` in `.env` to the full backend URL:

```env
VITE_API_URL=https://your-api-domain.com/api/v1
```

Then build:

```bash
npm run build
```

The output goes to `dist/` and can be served by any static file host.
