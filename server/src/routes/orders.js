const express = require('express');
const router = express.Router();
const defaultUser = require('../middleware/defaultUser');
const orderController = require('../controllers/orderController');

router.use(defaultUser);

// POST /api/orders  { shippingAddress }
router.post('/', orderController.placeOrder);

// GET /api/orders
router.get('/', orderController.getOrders);

// GET /api/orders/:id
router.get('/:id', orderController.getOrderById);

module.exports = router;
