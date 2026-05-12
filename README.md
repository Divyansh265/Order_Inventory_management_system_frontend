# Frontend — Order & Inventory Management

This is the admin panel for the Order & Inventory Management System. It's a React single-page application that lets admins and staff manage products, create orders, and track inventory.

---

## Tech Stack

- **React 18** with hooks
- **React Router v6** — client-side routing
- **Axios** — HTTP requests with interceptors
- **Tailwind CSS** — utility-first styling
- **Vite** — build tool and dev server
- **Context API** — lightweight global state for auth

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v8+
- The backend server must be running before you start the frontend

---

## Getting Started

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Set up environment variables

The frontend needs to know where the backend API is. Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=/api/v1
```

This uses Vite's built-in proxy to forward API requests to `http://localhost:5000`, which avoids any CORS issues during local development.

### 3. Make sure the backend is running

The frontend talks to the backend, so start the backend first:

```bash
cd backend
npm run dev
```

Then come back and start the frontend.

### 4. Start the development server

```bash
npm run dev
```

The app opens at **http://localhost:5173**

---

## Login Credentials

Once the backend is seeded, you can log in with:

| Role  | Email             | Password       |
| ----- | ----------------- | -------------- |
| Admin | admin@example.com | password123    |
| Staff | staff@example.com | password123456 |

Admin can do everything. Staff can view products and orders, and create orders, but cannot edit products or change order statuses.

---

## Available Scripts

| Script            | What it does                                      |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Start the development server                      |
| `npm run build`   | Build the app for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally              |

---

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js              # Axios instance with auth interceptors
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Alert.jsx         # Custom popup alerts
│   │   │   ├── Badge.jsx         # Status and role badges
│   │   │   ├── Modal.jsx         # Reusable modal wrapper
│   │   │   ├── Pagination.jsx    # Pagination controls
│   │   │   └── Spinner.jsx       # Loading spinner
│   │   │
│   │   └── layout/
│   │       ├── Layout.jsx        # Page wrapper with sidebar
│   │       └── Sidebar.jsx       # Navigation sidebar
│   │
│   ├── context/
│   │   └── AuthContext.jsx       # Auth state — user, login, logout
│   │
│   ├── pages/
│   │   ├── Login/
│   │   │   └── Login.jsx         # Login form
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx     # Stats overview
│   │   ├── Products/
│   │   │   ├── Products.jsx      # Product list with search
│   │   │   └── ProductForm.jsx   # Create / edit product form
│   │   ├── Orders/
│   │   │   ├── Orders.jsx        # Order list with status filter
│   │   │   ├── CreateOrderForm.jsx # Multi-item order creation
│   │   │   └── OrderDetail.jsx   # Order detail view in modal
│   │   └── Profile/
│   │       └── Profile.jsx       # Current user info
│   │
│   ├── routes/
│   │   └── ProtectedRoute.jsx    # Redirects to login if not authenticated
│   │
│   ├── App.jsx                   # Route definitions
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Tailwind base styles
│
├── .env                          # Production environment variables
├── vite.config.js                # Vite config with dev proxy
├── tailwind.config.js            # Tailwind config with custom maroon color
├── vercel.json                   # Vercel SPA routing fix
└── package.json
```

---

## Pages

**Login** — Email and password login. Tokens are stored in `localStorage`. Redirects to the dashboard on success.

**Dashboard** — Shows four stat cards (total products, total orders, low stock count, recent orders count), a low stock products table, and a recent orders table.

**Products** — Full product list with name search and pagination. Admins see Edit and Delete buttons. Clicking Edit opens a modal form. Delete shows a confirmation popup before proceeding.

**Orders** — Order list with status filter (All / Pending / Completed / Cancelled) and pagination. Clicking View opens a modal with full order details including line items and totals. Admins see Complete and Cancel buttons on pending orders.

**Profile** — Shows the logged-in user's name, email, role, and ID.

---

## How Authentication Works

When you log in, the backend returns an access token (valid 1 day) and a refresh token (valid 7 days). Both are stored in `localStorage`.

The Axios instance automatically:

1. Attaches the access token to every request via the `Authorization` header
2. If a request returns 401 (token expired), it tries to refresh the token automatically
3. If the refresh also fails, it clears storage and redirects to `/login`

This means you stay logged in across page refreshes and tab closes for up to 7 days without needing to log in again.

---

## How the Proxy Works (Local Dev)

In development, `VITE_API_URL=/api/v1` tells Axios to send requests to `/api/v1/...` on the same origin (`localhost:5173`). Vite's dev server intercepts those requests and forwards them to `http://localhost:5000`.

This means the browser never makes a cross-origin request, so there are no CORS issues during development.

---

## Environment Variables

| Variable       | Description                   | Example                                    |
| -------------- | ----------------------------- | ------------------------------------------ |
| `VITE_API_URL` | Base URL for all API requests | `/api/v1` (local) or full URL (production) |

For local development

```env
VITE_API_URL=/api/v1
```
