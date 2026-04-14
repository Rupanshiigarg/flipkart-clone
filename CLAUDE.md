# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A monorepo Flipkart clone with two parts:
- **client/** — React + Vite frontend (runs on port 5173)
- **server/** — Node.js + Express + Prisma backend (runs on port 5000)

## Development Commands

### Client
```bash
cd client && npm install
npm run dev      # start dev server
npm run build    # production build
```

### Server
```bash
cd server && npm install
npm run dev              # start with nodemon
npm run db:generate       # generate Prisma client after schema changes
npm run db:migrate        # apply schema migrations
npm run db:seed           # seed database (uses .env, or .env.production if NODE_ENV=production)
npm run db:seed:prod      # seed with Railway database (NODE_ENV=production)
npm run db:studio         # open Prisma Studio
```

## Architecture

### Backend (server/src/)
- **index.js** — Express app setup, CORS config (allows localhost:5173 + flipkart-clone-garg.vercel.app), route mounting
- **config/db.js** — PrismaClient singleton
- **middleware/errorHandler.js** — global error middleware
- **middleware/defaultUser.js** — attaches a default user (user@flipkart.com) to req.user for development
- **routes/** — one file per resource (products, cart, orders, wishlist)
- **controllers/** — async route handlers using Prisma

### Frontend (client/src/)
- **App.jsx** — React Router route definitions
- **api/axiosInstance.js** — Axios instance with automatic data unwrapping and error normalization
- **api/*.js** — one file per resource (products, cart, orders, wishlist)
- **context/CartContext.jsx** — cart state management via React Context
- **components/** — ProductCard, Navbar, Footer
- **pages/** — Home, ProductList, ProductDetail, Cart, Checkout, OrderConfirmation, OrderHistory, Wishlist

### Database Schema (server/prisma/schema.prisma)
- PostgreSQL via Railway (connection URL in seed.js, also needs DATABASE_URL in .env)
- **User** → CartItem, Order, WishlistItem
- **Product** → ProductImage, ProductSpec, CartItem, OrderItem, WishlistItem (belongs to Category)
- **Category** → Product (one-to-many)
- **Order** → OrderItem (one-to-many, status enum: PLACED/CONFIRMED/SHIPPED/DELIVERED/CANCELLED)
- No authentication middleware — user is inferred from a default user record

## Key Patterns
- All API responses unwrap data automatically via Axios interceptor — controllers return raw objects
- Error handling: controllers call `next(err)` on failures; global middleware formats the response
- Database seeding creates a default user `user@flipkart.com` with password `password123`
- CORS is restrictively configured; add new origins to the allowlist in server/src/index.js
