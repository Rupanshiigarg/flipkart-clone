#!/bin/bash

# Navigate to the project root
cd "c:/Users/Welcome/Documents/Project fr/Flipkart clone/flipkart-clone"

# Prepare repository
git init
git remote add origin https://github.com/Rupanshiigarg/flipkart-clone.git
git branch -M main

# Unstage everything to rebuild
git reset

# 1. Monorepo Setup
git add README.md .gitignore
git commit -m "feat: init monorepo with gitignore and README skeleton"

# 2. Server Setup
git add server/package.json server/src/index.js server/src/config/db.js server/src/middleware/errorHandler.js
git commit -m "feat(server): setup Express + Prisma + PostgreSQL connection"

# 3. DB Schema
git add server/prisma/schema.prisma
git commit -m "feat(db): define schema (User, Product, ProductImage, ProductSpec, Cart, Order)"

# 4. Seeding
git add server/prisma/seed.js
git commit -m "feat(db): seed 42 products across 6 categories"

# 5. Products API
git add server/src/controllers/productController.js server/src/routes/products.js
git commit -m "feat(server): products routes - list, filter, search, detail"

# 6. Cart API
git add server/src/controllers/cartController.js server/src/routes/cart.js server/src/middleware/defaultUser.js
git commit -m "feat(server): cart CRUD routes with defaultUser middleware"

# 7. Orders API
git add server/src/controllers/orderController.js server/src/routes/orders.js
git commit -m "feat(server): order placement and history routes"

# 8. Wishlist API
git add server/src/controllers/wishlistController.js server/src/routes/wishlist.js
git commit -m "feat(server): wishlist routes"

# 9. Client Init
git add client/package.json client/vite.config.js client/index.html client/src/main.jsx client/src/App.jsx client/src/api/axiosInstance.js client/src/index.css
git commit -m "feat(client): init Vite + React with router and global CSS tokens"

# 10. Navbar component
git add client/src/components/Navbar/
git commit -m "feat(client): Navbar with search bar and cart badge"

# 11. ProductCard component
git add client/src/components/ProductCard/
git commit -m "feat(client): ProductCard component (Flipkart style)"

# 12. ProductList Page
git add client/src/pages/ProductList/ client/src/api/products.js
git commit -m "feat(client): Product Listing page with filter sidebar"

# 13. ProductDetail Page
git add client/src/pages/ProductDetail/
git commit -m "feat(client): Product Detail page with ImageCarousel and specs table"

# 14. Cart Page
git add client/src/pages/Cart/ client/src/api/cart.js
git commit -m "feat(client): Cart page with optimistic qty updates"

# 15. Checkout & Confirmation
git add client/src/pages/Checkout/ client/src/pages/OrderConfirmation/ client/src/api/orders.js
git commit -m "feat(client): Checkout and OrderConfirmation pages"

# 16. State Management
git add client/src/context/CartContext.jsx
git commit -m "feat(client): CartContext with optimistic update pattern"

# 17. Responsive design and extra features
git add client/src/pages/OrderHistory/ client/src/pages/Wishlist/ client/src/api/wishlist.js client/src/components/Footer/ client/src/utils/
git commit -m "feat(client): add Order History, Wishlist, and responsive Footer"

# 18. Home Revamp
git add client/src/pages/Home/
git commit -m "feat(client): implement home page with hero grid and scroll transitions"

# 19. Deployment config
git add client/vercel.json client/package-lock.json
git commit -m "chore: add vercel deployment config and package locks"

# 20. Finalization
git add .
git commit -m "chore: finalize README and UI polish for submission"

# Force push to GitHub
echo "Pushing history to GitHub..."
git push -f origin main
