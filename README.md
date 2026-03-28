# Flipkart Clone — Full-Stack SDE Intern Assignment

A functional, high-fidelity Flipkart clone built with **React (Vite)**, **Node.js (Express)**, **Prisma ORM**, and **PostgreSQL**.

## 🚀 Live Demo
- **Frontend**: [Vercel Link Placeholder]
- **Backend**: [Render Link Placeholder]

> **Note on Render (Free Tier):** Initial load may take ~30 seconds as the backend wakes up.

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, React Router v6, Axios, Context API
- **Backend**: Node.js, Express.js, Prisma ORM
- **Database**: PostgreSQL (Hosted on Render)
- **Styling**: Vanilla CSS (Custom tokens for Flipkart brand colors)

---

## ✨ Features

### Core (Must Have)
- [x] **Product Listing**: Responsive grid with Flipkart-style cards, search by name, and category filters.
- [x] **Product Detail**: Multi-image carousel, detailed specifications table, and stock status.
- [x] **Shopping Cart**: Add/remove items with **Optimistic Updates** for quantity changes (no race conditions).
- [x] **Order Placement**: Multi-step checkout flow with shipping address and order summary.
- [x] **Order Confirmation**: Instant feedback with a unique Order ID.

### Bonus (Good to Have)
- [x] **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile.
- [x] **Order History**: View past orders with snapped prices and statuses.
- [x] **Wishlist**: Save items and move them to the cart directly.
- [x] **Default User Profile**: Rahul Sharma (ID: 1) — No login required as per assignment.

---

## 📂 Project Structure

```
flipkart-clone/
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── api/          # Axios instance + endpoints
│   │   ├── components/   # UI components (Navbar, ProductCard, etc.)
│   │   ├── context/      # Cart state management (Optimistic)
│   │   ├── pages/        # All route views
│   │   └── utils/        # Price formatting helpers
│   └── vercel.json       # SPA rewrite rules
│
├── server/               # Express backend
│   ├── prisma/           # Schema and Seeding (42 products)
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # defaultUser & error handling
│   │   └── routes/       # API endpoints
│   └── .env              # Environment config
└── README.md
```

---

## ⚡ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running

### 2. Backend Setup
```bash
cd flipkart-clone/server
npm install
# Create a .env file based on .env.example
# Run migrations and seeding
npx prisma migrate dev --name init
npm run db:seed
npm run start
```

### 3. Render Blueprint Deployment (One-Click)
- Push this repo to GitHub.
- On Render, click **"New"** → **"Blueprint"**.
- Select this repository.
- It will automatically provision a **PostgreSQL database** and a **Node.js Web Service**.

### 3. Frontend Setup
```bash
cd flipkart-clone/client
npm install
npm run dev
```

---

## 📝 Assumptions & Decisions
1. **No Login Required**: The assignment requested focus on e-commerce logic over authentication. A `defaultUser` middleware injects `userId: 1` into all requests.
2. **Database Design**: Used a relational schema (PostgreSQL) with `ProductImage` and `ProductSpec` models for easy maintenance and querying.
3. **Cart Logic**: Implemented **Optimistic Updates**. The UI reflects changes immediately, and the backend syncs in the background, reverting only on error. This prevents the "double-click" bug common in AJAX carts.
4. **Vercel Routing**: Added `vercel.json` to handle client-side routing, preventing 404s on page refreshes.

---

## 🖼️ Media
![Flipkart Clone Home Screen](https://via.placeholder.com/800x400?text=Flipkart+Clone+Home+Screen)
![Product Detail and Specs](https://via.placeholder.com/800x400?text=Product+Detail+Page)
![Responsive Cart and Checkout](https://via.placeholder.com/800x400?text=Mobile+Responsive+Design)

---
**Developed by [Your Name] for SDE Intern Review**
