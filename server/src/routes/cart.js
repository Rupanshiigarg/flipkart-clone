const express = require('express');
const router = express.Router();
const defaultUser = require('../middleware/defaultUser');
const cartController = require('../controllers/cartController');

// All cart routes require a user
router.use(defaultUser);

// GET /api/cart
router.get('/', cartController.getCart);

// POST /api/cart  { productId, quantity }
router.post('/', cartController.addItem);

// PATCH /api/cart/:productId  { quantity }
router.patch('/:productId', cartController.updateItem);

// DELETE /api/cart/:productId
router.delete('/:productId', cartController.removeItem);

module.exports = router;
