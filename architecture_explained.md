# Flipkart Clone — Architecture Deep Dive

## High-Level Architecture

Your project follows a **3-tier client-server architecture**:

```mermaid
graph LR
    subgraph "FRONTEND (Client)"
        A["React App<br/>Vite + React Router"]
    end
    subgraph "BACKEND (Server)"
        B["Express.js API<br/>REST endpoints"]
    end
    subgraph "DATABASE"
        C["PostgreSQL<br/>on Railway"]
    end

    A -- "HTTP Requests<br/>(Axios via /api/*)" --> B
    B -- "SQL Queries<br/>(Prisma ORM)" --> C
    C -- "Query Results<br/>(rows → JS objects)" --> B
    B -- "JSON Responses" --> A
```

| Layer | Technology | Hosted On | Role |
|-------|-----------|-----------|------|
| **Frontend** | React 18 + Vite + React Router | Vercel | UI rendering, routing, state management |
| **Backend** | Express.js (Node.js) | Render | REST API, business logic, data validation |
| **Database** | PostgreSQL | Railway | Persistent storage of all application data |
| **ORM** | Prisma | — | Type-safe database queries, migrations, schema |

---

## 1. The Frontend Layer

### Entry Point Chain

```mermaid
graph TD
    A["index.html"] --> B["main.jsx"]
    B --> C["BrowserRouter"]
    C --> D["CartProvider (Context)"]
    D --> E["App.jsx"]
    E --> F["Navbar"]
    E --> G["Routes"]
    E --> H["Footer"]
    G --> I["Home"]
    G --> J["ProductList"]
    G --> K["ProductDetail"]
    G --> L["Cart"]
    G --> M["Checkout"]
    G --> N["OrderConfirmation"]
    G --> O["OrderHistory"]
    G --> P["Wishlist"]
```

**Boot sequence:**
1. `index.html` loads the Vite-bundled JS
2. [main.jsx](file:///c:/Users/Welcome/Documents/Project%20fr/Flipkart%20clone/flipkart-clone/client/src/main.jsx) initializes React and wraps the app in:
   - `BrowserRouter` — enables client-side routing
   - `CartProvider` — provides cart state to all components via React Context
3. [App.jsx](file:///c:/Users/Welcome/Documents/Project%20fr/Flipkart%20clone/flipkart-clone/client/src/App.jsx) renders `Navbar`, a `<Routes>` block mapping 8 URL paths to page components, and `Footer`

### How the Frontend Talks to the Backend

The frontend uses a centralized **Axios instance** ([axiosInstance.js](file:///c:/Users/Welcome/Documents/Project%20fr/Flipkart%20clone/flipkart-clone/client/src/api/axiosInstance.js)) as the single HTTP gateway:

```javascript
// axiosInstance.js — the SINGLE gateway for all API calls
const API_URL = import.meta.env.VITE_API_URL || ''    // empty in dev (uses proxy)

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,                           // all URLs start with /api
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor: auto-unwraps response.data so components get plain JSON
axiosInstance.interceptors.response.use(
  (response) => response.data,          // success: return just the data
  (error) => Promise.reject(...)        // error: extract error message
)
```

> [!IMPORTANT]
> **Dev mode vs Production:** In development, Vite's dev server **proxies** `/api/*` requests to `http://localhost:5000` (configured in [vite.config.js](file:///c:/Users/Welcome/Documents/Project%20fr/Flipkart%20clone/flipkart-clone/client/vite.config.js)). In production, `VITE_API_URL` is set to the Render backend URL, and Axios sends requests directly.

### API Module Files

Each feature has its own thin API module that wraps Axios calls:

| File | Functions | Maps to Backend Route |
|------|-----------|----------------------|
| [products.js](file:///c:/Users/Welcome/Documents/Project%20fr/Flipkart%20clone/flipkart-clone/client/src/api/products.js) | `getProducts(params)`, `getProductById(id)`, `getCategories()` | `GET /api/products`, `GET /api/products/:id`, `GET /api/products/categories` |
| [cart.js](file:///c:/Users/Welcome/Documents/Project%20fr/Flipkart%20clone/flipkart-clone/client/src/api/cart.js) | `getCart()`, `addToCart()`, `updateCartQty()`, `removeFromCart()` | `GET/POST/PATCH/DELETE /api/cart` |
| [orders.js](file:///c:/Users/Welcome/Documents/Project%20fr/Flipkart%20clone/flipkart-clone/client/src/api/orders.js) | `placeOrder()`, `getOrders()`, `getOrderById()` | `POST/GET /api/orders` |
| [wishlist.js](file:///c:/Users/Welcome/Documents/Project%20fr/Flipkart%20clone/flipkart-clone/client/src/api/wishlist.js) | `getWishlist()`, `addToWishlist()`, `removeFromWishlist()` | `GET/POST/DELETE /api/wishlist` |

### Cart State Management (React Context)

[CartContext.jsx](file:///c:/Users/Welcome/Documents/Project%20fr/Flipkart%20clone/flipkart-clone/client/src/context/CartContext.jsx) is the only global state in the app. It uses **optimistic updates** — the UI updates instantly *before* the server confirms:

```mermaid
sequenceDiagram
    participant User
    participant CartContext
    participant CartAPI
    participant Backend

    User->>CartContext: addItem(product)
    CartContext->>CartContext: Instantly update local state (optimistic)
    CartContext->>CartAPI: addToCart(productId)
    CartAPI->>Backend: POST /api/cart {productId, qty}
    Backend-->>CartAPI: 201 Created (cart item)
    CartAPI-->>CartContext: Response
    CartContext->>CartAPI: getCart() (re-sync)
    CartAPI->>Backend: GET /api/cart
    Backend-->>CartAPI: Full cart array
    CartAPI-->>CartContext: Fresh cart data
    CartContext->>CartContext: Replace local state with server truth
```

Key details:
- **On mount**: `CartProvider` fetches the full cart from the server via `GET /api/cart`
- **On add/update/remove**: UI updates instantly → API call fires → on success/failure, re-fetches from server to sync
- **Computed values** (`totalItems`, `subtotal`, `savings`) are derived from state, no extra API calls

---

## 2. The Backend Layer

### Server Boot & Middleware

[index.js](file:///c:/Users/Welcome/Documents/Project%20fr/Flipkart%20clone/flipkart-clone/server/src/index.js) bootstraps the Express server:

```mermaid
graph TD
    A["require('dotenv').config()"] --> B["Express app created"]
    B --> C["CORS middleware<br/>(allows localhost:5173 + Vercel domain)"]
    C --> D["express.json() — parses JSON bodies"]
    D --> E["Health check: GET /api/health"]
    E --> F["Mount route modules"]
    F --> G["/api/products → productRoutes"]
    F --> H["/api/cart → cartRoutes"]
    F --> I["/api/orders → orderRoutes"]
    F --> J["/api/wishlist → wishlistRoutes"]
    F --> K["Global errorHandler middleware"]
    K --> L["app.listen(PORT)"]
```

### Middleware Pipeline

Every request passes through middleware before reaching a controller:

| Middleware | File | What It Does |
|-----------|------|--------------|
| **CORS** | Built-in (Express) | Allows requests from `localhost:5173` (dev) and `flipkart-clone-garg.vercel.app` (prod) |
| **express.json()** | Built-in (Express) | Parses incoming JSON request bodies into `req.body` |
| **defaultUser** | [defaultUser.js](file:///c:/Users/Welcome/Documents/Project%20fr/Flipkart%20clone/flipkart-clone/server/src/middleware/defaultUser.js) | Sets `req.userId = 1` for all cart/order/wishlist routes (simulates authentication) |
| **errorHandler** | [errorHandler.js](file:///c:/Users/Welcome/Documents/Project%20fr/Flipkart%20clone/flipkart-clone/server/src/middleware/errorHandler.js) | Catches any unhandled errors, logs the stack trace, returns a JSON error response |

> [!NOTE]
> The `defaultUser` middleware is applied only to cart, order, and wishlist routes (not products). It substitutes for JWT authentication — in a production app, this would decode a Bearer token and extract the real user ID.

### Route → Controller → Database Flow

Each feature follows the same **3-layer pattern**:

```
Route file (defines HTTP method + URL)
  → Controller function (business logic)
    → Prisma query (database interaction)
```

---

## 3. The Database Layer

### Prisma ORM — The Bridge Between Backend & Database

[db.js](file:///c:/Users/Welcome/Documents/Project%20fr/Flipkart%20clone/flipkart-clone/server/src/config/db.js) creates a single Prisma client instance shared across all controllers:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();    // connects to DATABASE_URL from .env
module.exports = prisma;
```

Every controller imports this `prisma` object and calls methods like `prisma.product.findMany()`, which Prisma translates into SQL queries.

### Database Schema (ER Diagram)

The [schema.prisma](file:///c:/Users/Welcome/Documents/Project%20fr/Flipkart%20clone/flipkart-clone/server/prisma/schema.prisma) file defines 8 models:

```mermaid
erDiagram
    User ||--o{ CartItem : "has"
    User ||--o{ Order : "places"
    User ||--o{ WishlistItem : "saves"

    Category ||--o{ Product : "contains"

    Product ||--o{ ProductImage : "has"
    Product ||--o{ ProductSpec : "has"
    Product ||--o{ CartItem : "in"
    Product ||--o{ OrderItem : "ordered as"
    Product ||--o{ WishlistItem : "wishlisted as"

    Order ||--o{ OrderItem : "contains"

    User {
        int id PK
        string name
        string email UK
        string passwordHash
        string address
    }

    Category {
        int id PK
        string name UK
        string slug UK
        string imageUrl
    }

    Product {
        int id PK
        string name
        string description
        float price
        float mrp
        int stock
        string brand
        float rating
        int reviewCount
        int categoryId FK
    }

    ProductImage {
        int id PK
        int productId FK
        string url
        int sortOrder
    }

    ProductSpec {
        int id PK
        int productId FK
        string specKey
        string specValue
    }

    CartItem {
        int id PK
        int userId FK
        int productId FK
        int quantity
    }

    Order {
        int id PK
        int userId FK
        string status
        string shippingAddress
        float totalAmount
    }

    OrderItem {
        int id PK
        int orderId FK
        int productId FK
        int quantity
        float price
    }

    WishlistItem {
        int id PK
        int userId FK
        int productId FK
    }
```

### Key Database Relationships

| Relationship | Type | Explanation |
|-------------|------|-------------|
| User → CartItem | One-to-Many | Each user has their own cart items |
| User → Order | One-to-Many | Each user can place multiple orders |
| User → WishlistItem | One-to-Many | Each user can wishlist multiple products |
| Category → Product | One-to-Many | Each category contains multiple products |
| Product → ProductImage | One-to-Many | Each product has multiple images (cascade delete) |
| Product → ProductSpec | One-to-Many | Each product has multiple specs (cascade delete) |
| Order → OrderItem | One-to-Many | Each order contains multiple line items |
| CartItem | Unique(userId, productId) | A user can only have one cart entry per product |
| WishlistItem | Unique(userId, productId) | A user can only wishlist a product once |

---

## 4. Complete Request Lifecycle — Feature by Feature

### Feature 1: Browsing Products

```mermaid
sequenceDiagram
    participant Browser
    participant React as React (ProductList page)
    participant Axios as products.js (API module)
    participant Express as Express Router
    participant Controller as productController
    participant Prisma
    participant PostgreSQL

    Browser->>React: User visits /products?category=mobiles
    React->>Axios: getProducts({ category: 'mobiles' })
    Axios->>Express: GET /api/products?category=mobiles
    Express->>Controller: getProducts(req, res, next)
    Controller->>Controller: Build where clause: { category: { slug: 'mobiles' } }
    Controller->>Prisma: prisma.product.findMany({ where, include: { images, category, specs } })
    Prisma->>PostgreSQL: SELECT p.*, i.*, c.*, s.* FROM "Product" p LEFT JOIN ...
    PostgreSQL-->>Prisma: Result rows
    Prisma-->>Controller: Array of Product objects with nested relations
    Controller-->>Express: res.json(products)
    Express-->>Axios: HTTP 200 + JSON array
    Axios-->>React: Unwrapped data array
    React-->>Browser: Renders product cards
```

### Feature 2: Adding to Cart (with Optimistic Updates)

```mermaid
sequenceDiagram
    participant Browser
    participant React as React (ProductDetail)
    participant Context as CartContext
    participant Axios as cart.js (API)
    participant Express
    participant Middleware as defaultUser middleware
    participant Controller as cartController
    participant Prisma
    participant DB as PostgreSQL

    Browser->>React: User clicks "ADD TO CART"
    React->>Context: addItem(product, 1)
    Context->>Context: 🟢 Optimistic: instantly add to local state
    Browser->>Browser: UI updates immediately (no waiting!)
    Context->>Axios: addToCart(productId, 1)
    Axios->>Express: POST /api/cart { productId: 5, quantity: 1 }
    Express->>Middleware: defaultUser sets req.userId = 1
    Middleware->>Controller: addItem(req, res, next)
    Controller->>Prisma: prisma.product.findUnique({ where: { id: 5 } })
    Prisma->>DB: SELECT * FROM "Product" WHERE id=5
    DB-->>Prisma: Product row (stock: 10)
    Controller->>Controller: Validate: stock >= 1 ✅
    Controller->>Prisma: prisma.cartItem.upsert({ userId_productId: {1, 5}, update: increment, create: new })
    Prisma->>DB: INSERT INTO "CartItem" ... ON CONFLICT DO UPDATE
    DB-->>Prisma: Upserted row
    Prisma-->>Controller: CartItem with product included
    Controller-->>Express: res.status(201).json(item)
    Express-->>Axios: HTTP 201 + JSON
    Axios-->>Context: Success response
    Context->>Axios: getCart() — re-sync with server
    Axios->>Express: GET /api/cart
    Express-->>Axios: Full cart array
    Axios-->>Context: Replace local state with server truth
```

### Feature 3: Placing an Order (Database Transaction)

This is the most complex flow — it uses a **Prisma transaction** to ensure atomicity:

```mermaid
sequenceDiagram
    participant React as Checkout Page
    participant API as orders.js
    participant Express
    participant Controller as orderController
    participant Prisma as Prisma ($transaction)
    participant DB as PostgreSQL

    React->>API: placeOrder("123 Main St")
    API->>Express: POST /api/orders { shippingAddress: "123 Main St" }
    Express->>Controller: placeOrder(req, res, next)

    Note over Controller,DB: Step 1 — Fetch cart items
    Controller->>Prisma: prisma.cartItem.findMany({ userId: 1, include: product })
    Prisma->>DB: SELECT ci.*, p.* FROM "CartItem" ci JOIN "Product" p ...
    DB-->>Controller: Cart items with product data

    Note over Controller: Step 2 — Validate stock for all items

    Note over Controller,DB: Step 3 — Begin TRANSACTION
    Controller->>Prisma: prisma.$transaction(async (tx) => { ... })

    Note over Prisma,DB: 3a. Create Order + OrderItems
    Prisma->>DB: INSERT INTO "Order" (userId, shippingAddress, totalAmount) ...
    Prisma->>DB: INSERT INTO "OrderItem" (orderId, productId, qty, price) ... (for each item)

    Note over Prisma,DB: 3b. Decrement product stock
    Prisma->>DB: UPDATE "Product" SET stock = stock - qty WHERE id = ... (for each item)

    Note over Prisma,DB: 3c. Clear the user's cart
    Prisma->>DB: DELETE FROM "CartItem" WHERE userId = 1

    Note over Prisma,DB: COMMIT or ROLLBACK (all-or-nothing)
    DB-->>Controller: Transaction result

    Controller-->>Express: res.status(201).json(order)
    Express-->>React: Order confirmation data
    React->>React: Navigate to /order-confirmation/:id
```

> [!IMPORTANT]
> The `$transaction` ensures that **either all 3 operations succeed together (create order + decrement stock + clear cart) or none of them happen**. This prevents issues like an order being created without stock being decremented.

### Feature 4: Wishlist

```mermaid
sequenceDiagram
    participant React as Wishlist Page
    participant API as wishlist.js
    participant Express
    participant Controller as wishlistController
    participant Prisma
    participant DB as PostgreSQL

    React->>API: addToWishlist(productId)
    API->>Express: POST /api/wishlist { productId: 3 }
    Express->>Controller: addItem(req, res, next)
    Controller->>Prisma: prisma.wishlistItem.upsert({ userId_productId: {1, 3} })
    Prisma->>DB: INSERT INTO "WishlistItem" ... ON CONFLICT DO NOTHING
    DB-->>Prisma: Upserted row
    Controller-->>React: 201 Created
```

> [!NOTE]
> The `upsert` with an empty `update: {}` is a clever pattern — it means "create if not exists, do nothing if it already exists". This prevents duplicate wishlist entries without throwing errors.

---

## 5. How Data Flows Between All Three Layers — Summary

```mermaid
graph TB
    subgraph "FRONTEND — React"
        P1["Pages<br/>(Home, ProductList, Cart, etc.)"]
        CTX["CartContext<br/>(global state)"]
        API["API Modules<br/>(products.js, cart.js, etc.)"]
        AX["axiosInstance.js<br/>(base URL + interceptors)"]

        P1 --> CTX
        P1 --> API
        CTX --> API
        API --> AX
    end

    subgraph "BACKEND — Express.js"
        MW["Middleware<br/>(CORS, JSON parser, defaultUser)"]
        RT["Route Files<br/>(products.js, cart.js, etc.)"]
        CT["Controllers<br/>(productController, cartController, etc.)"]
        EH["Error Handler"]

        MW --> RT
        RT --> CT
        CT --> EH
    end

    subgraph "DATABASE — PostgreSQL"
        PR["Prisma ORM<br/>(schema + client)"]
        PG["PostgreSQL Tables<br/>(User, Product, CartItem, Order, etc.)"]

        PR --> PG
    end

    AX -- "HTTP/JSON<br/>over network" --> MW
    CT -- "Prisma queries<br/>(findMany, create, upsert, $transaction)" --> PR
    PR -- "JS objects<br/>(auto-mapped from rows)" --> CT
    MW -- "JSON response<br/>back to client" --> AX
```

### Data Transformation at Each Layer

| Step | What Happens | Example |
|------|-------------|---------|
| **1. User action** | Click, form submit, page load | User clicks "Add to Cart" |
| **2. React component** | Calls API module function | `cartApi.addToCart(5, 1)` |
| **3. API module** | Uses Axios to make HTTP request | `axios.post('/cart', { productId: 5, quantity: 1 })` |
| **4. Axios interceptor** | Prepends base URL, sets headers | Full URL: `http://localhost:5000/api/cart` |
| **5. Vite proxy (dev only)** | Forwards `/api/*` to port 5000 | Transparent to application code |
| **6. Express middleware** | Parses JSON body, sets `req.userId` | `req.body = { productId: 5, quantity: 1 }`, `req.userId = 1` |
| **7. Route** | Dispatches to correct controller function | `POST /api/cart` → `cartController.addItem` |
| **8. Controller** | Validates input, calls Prisma | Checks product exists and has stock |
| **9. Prisma** | Translates JS method call → SQL | `prisma.cartItem.upsert(...)` → `INSERT ... ON CONFLICT DO UPDATE` |
| **10. PostgreSQL** | Executes SQL, returns rows | Row inserted/updated in `CartItem` table |
| **11. Prisma** | Maps SQL rows → JS objects | `{ id: 7, userId: 1, productId: 5, quantity: 1, product: {...} }` |
| **12. Controller** | Sends JSON response | `res.status(201).json(item)` |
| **13. Axios interceptor** | Unwraps `response.data` | Component receives plain JS object, not Axios wrapper |
| **14. React component** | Updates state → re-render | Cart badge shows updated count |

---

## 6. API Endpoints — Complete Reference

| Method | Endpoint | Auth? | Request Body | Controller | Prisma Operation | Response |
|--------|----------|-------|-------------|-----------|-----------------|----------|
| `GET` | `/api/products` | ❌ | — (query: `?search=&category=`) | `getProducts` | `product.findMany` with filters | Array of products |
| `GET` | `/api/products/categories` | ❌ | — | `getCategories` | `category.findMany` | Array of categories |
| `GET` | `/api/products/:id` | ❌ | — | `getProductById` | `product.findUnique` | Single product |
| `GET` | `/api/cart` | ✅ | — | `getCart` | `cartItem.findMany` | Array of cart items |
| `POST` | `/api/cart` | ✅ | `{ productId, quantity }` | `addItem` | `cartItem.upsert` | Created/updated item |
| `PATCH` | `/api/cart/:productId` | ✅ | `{ quantity }` | `updateItem` | `cartItem.update` | Updated item |
| `DELETE` | `/api/cart/:productId` | ✅ | — | `removeItem` | `cartItem.delete` | Success message |
| `POST` | `/api/orders` | ✅ | `{ shippingAddress }` | `placeOrder` | `$transaction` (create + update + delete) | Created order |
| `GET` | `/api/orders` | ✅ | — | `getOrders` | `order.findMany` | Array of orders |
| `GET` | `/api/orders/:id` | ✅ | — | `getOrderById` | `order.findFirst` | Single order |
| `GET` | `/api/wishlist` | ✅ | — | `getWishlist` | `wishlistItem.findMany` | Array of wishlist items |
| `POST` | `/api/wishlist` | ✅ | `{ productId }` | `addItem` | `wishlistItem.upsert` | Created item |
| `DELETE` | `/api/wishlist/:productId` | ✅ | — | `removeItem` | `wishlistItem.delete` | Success message |

> [!NOTE]
> "Auth" here means the `defaultUser` middleware runs. Currently it hardcodes `userId = 1`, but the architecture is ready for real JWT auth — just swap the middleware.

---

## 7. Key Design Patterns Used

| Pattern | Where | Why |
|---------|-------|-----|
| **Separation of Concerns** | Routes vs Controllers vs Models (Prisma) | Each layer has one job — routing, logic, or data access |
| **Optimistic Updates** | CartContext | Instant UI feedback; re-syncs with server after API call |
| **Centralized HTTP Client** | axiosInstance.js | Single place to configure base URL, headers, error handling |
| **Database Transactions** | orderController.placeOrder | Atomic operations — order creation + stock decrement + cart clearing |
| **Upsert Pattern** | Cart & Wishlist | "Create if not exists, update if exists" — avoids duplicate checks |
| **Proxy in Development** | vite.config.js | Avoids CORS issues in dev; same-origin requests |
| **Environment Variables** | `.env` / `.env.production` | Different configs for dev vs production without code changes |
| **Cascade Delete** | ProductImage, ProductSpec | Automatically clean up child records when a product is deleted |
| **Global Error Handler** | errorHandler middleware | Catches all unhandled errors, returns consistent JSON error format |
