const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products?search=&category=
router.get('/', productController.getProducts);

// GET /api/categories
router.get('/categories', productController.getCategories);

// GET /api/products/:id
router.get('/:id', productController.getProductById);

module.exports = router;
