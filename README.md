# Cartly — Simple shopping. Better experience.

A clean, modern full-stack E-Commerce Web Application built for **Thiranex Internship Task 3**. Cartly provides a complete online shopping workflow for customers alongside a role-protected administration suite for catalog and order fulfillment management.

---

## 1. Project Description

**Cartly** is a full-stack e-commerce web application developed with **React**, **Vite**, **Node.js**, **Express.js**, **MongoDB**, **Mongoose**, **JWT**, and **bcrypt**. It implements product discovery, search and multi-criteria filtering, persistent shopping cart management, demo checkout with automatic stock deduction, order tracking timelines, and strict role-based access control separating Customer (`user`) and Administrator (`admin`) capabilities.

---

## 2. Features

- **Product Catalog & Discovery**: Browse 14 curated products across Electronics, Accessories, Home, and Lifestyle categories.
- **Search & Multi-Criteria Filtering**: Filter products dynamically by search query (name/category), category tabs, price range, and stock availability (`In Stock` / `Out of Stock`).
- **Product Details (PDP)**: Detailed specifications, live stock counter, quantity selector capped at available stock, and instant Add to Cart feedback.
- **Cart Management**: React Context cart state with local persistence, quantity steppers, stock-limit enforcement, dynamic subtotal/total calculation, and item removal.
- **Demo Checkout Flow**: Shipping address validation, order summary verification, Cash on Delivery / Demo Payment selection, automatic product stock reduction in MongoDB, and order confirmation screen.
- **Order History & Tracking Timeline**: Customer `My Orders` view and `Order Details` page featuring a 5-stage visual fulfillment timeline (`Pending` → `Confirmed` → `Processing` → `Shipped` → `Delivered`).
- **JWT & bcrypt Authentication**: Secure registration and login with hashed passwords and Bearer token verification.
- **Role-Based Access Control (RBAC)**:
  - Customers cannot access Admin pages or Admin REST endpoints.
  - Customers cannot view or modify another customer's orders.
  - Administrators manage catalog items and customer orders and are restricted from customer-only checkout actions.
- **Admin Dashboard, Product CRUD & Order Management**:
  - Live store metrics (`Total Products`, `Total Orders`, `Pending Orders`, `Delivered Orders`).
  - Full Product CRUD (Add, Edit, Delete with confirmation modal).
  - Order management table with real-time status updates (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
- **Responsive Design**: Desktop, laptop, tablet, and mobile layouts with touch-friendly controls and zero horizontal overflow.

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router v7, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js, RESTful API Architecture |
| **Database** | MongoDB, Mongoose ODM (with automatic embedded persistent fallback when `MONGODB_URI` is not configured) |
| **Authentication & Security** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing, Role Authorization Middleware |

---

## 4. User Roles & Demo Credentials

| Role | Email | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Customer (`user`)** | `user@cartly.com` | `user123` | Browse, search, filter, add to cart, checkout, view own orders, track order status |
| **Admin (`admin`)** | `admin@cartly.com` | `admin123` | View dashboard statistics, add/edit/delete products, view all customer orders, update order status |

---

## 5. Screenshots Section

> Replace the placeholders below with screenshots captured from your running application before submitting to GitHub.

- `docs/screenshots/01-home.png` — Storefront Hero, Featured Products & Categories
- `docs/screenshots/02-catalog-filters.png` — Product Catalog with Search & Category/Price/Stock Filters
- `docs/screenshots/03-product-details.png` — Product Details & Quantity Selector
- `docs/screenshots/04-cart-checkout.png` — Shopping Cart & Demo Checkout Flow
- `docs/screenshots/05-order-tracking.png` — Customer Order Details & Tracking Timeline
- `docs/screenshots/06-admin-dashboard.png` — Admin Dashboard, Product Management & Order Fulfillment

---

## 6. Project Structure

```text
Cartly/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection & persistent fallback store
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Get Current User
│   │   ├── productController.js  # Product listing, filtering, Admin CRUD
│   │   └── orderController.js    # Order creation, stock deduction, tracking, Admin status update
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT Bearer token verification
│   │   ├── adminMiddleware.js    # Admin-only & User-only role guards
│   │   └── errorMiddleware.js    # Centralized 404 & error handler
│   ├── models/
│   │   ├── User.js               # User Mongoose model (name, email, password, role, createdAt)
│   │   ├── Product.js            # Product Mongoose model (name, description, price, category, image, stock)
│   │   └── Order.js              # Order Mongoose model (user, items, totalAmount, shippingAddress, status)
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── productRoutes.js      # /api/products routes
│   │   └── orderRoutes.js        # /api/orders routes
│   ├── seed/
│   │   ├── sampleProducts.js     # 14 realistic sample products across 4 categories
│   │   └── seedData.js           # Database seeder script
│   └── server.js                 # Standalone Express backend entry point
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductImage.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterBar.tsx
│   │   ├── CartItem.tsx
│   │   ├── OrderCard.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Profile.tsx
│   │   ├── MyOrders.tsx
│   │   ├── OrderDetails.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminProducts.tsx
│   │   └── AdminOrders.tsx
│   ├── services/
│   │   └── api.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server.ts                     # Unified full-stack entry point (Express + Vite)
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 7. Installation & Running Locally

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (MongoDB Atlas cluster URI or local MongoDB instance)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/cartly-ecommerce.git
   cd cartly-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your MongoDB connection string and JWT secret:
   ```env
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/cartly?retryWrites=true&w=majority"
   JWT_SECRET="your_super_secret_jwt_key_change_in_production"
   PORT=3000
   CLIENT_URL="http://localhost:3000"
   VITE_API_URL="/api"
   ```

4. **Seed sample products and demo users (optional — runs automatically on empty DB)**
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 8. REST API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user/admin and return JWT |
| `GET` | `/api/auth/me` | Protected | Get logged-in user's profile |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | List products (supports `search`, `category`, `minPrice`, `maxPrice`, `availability`) |
| `GET` | `/api/products/:id` | Public | Get single product details by ID |
| `POST` | `/api/products` | Admin Only | Create a new product |
| `PUT` | `/api/products/:id` | Admin Only | Update product details or stock |
| `DELETE` | `/api/products/:id` | Admin Only | Delete a product |

### Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Customer Only | Place order, validate & deduct product stock |
| `GET` | `/api/orders/my` | Protected | Get logged-in customer's own orders |
| `GET` | `/api/orders/:id` | Owner / Admin | Get order details and tracking status |
| `GET` | `/api/orders` | Admin Only | List all customer orders |
| `PUT` | `/api/orders/:id/status` | Admin Only | Update order status (`Pending` → `Confirmed` → `Processing` → `Shipped` → `Delivered` / `Cancelled`) |

---

## 9. Deployment Guide

### A. Database — MongoDB Atlas
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free M0 cluster.
2. Create a database user under **Database Access** and allow network access (`0.0.0.0/0`) under **Network Access**.
3. Copy your connection string (`mongodb+srv://<username>:<password>@cluster0.mongodb.net/cartly?retryWrites=true&w=majority`).

### B. Backend — Render
1. Push your repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com) connected to your repository.
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server/server.js`
4. Add Environment Variables in Render:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong random secret string
   - `PORT`: `5000`
   - `CLIENT_URL`: Your deployed Vercel frontend URL (e.g., `https://cartly-shop.vercel.app`)

### C. Frontend — Vercel
1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Configure:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable in Vercel:
   - `VITE_API_URL`: `https://<your-render-backend>.onrender.com/api`
4. Deploy and copy the generated Vercel domain back into Render's `CLIENT_URL` variable.

---

## 10. Future Improvements

- Product customer reviews and verified purchase ratings
- Multiple shipping address book per customer profile
- Order invoice PDF generation
- Pagination and sorting options on the catalog page
- Email notifications on order status transitions
