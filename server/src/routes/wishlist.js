const express = require('express');
const router = express.Router();
const defaultUser = require('../middleware/defaultUser');
const wishlistController = require('../controllers/wishlistController');

router.use(defaultUser);

// GET /api/wishlist
router.get('/', wishlistController.getWishlist);

// POST /api/wishlist  { productId }
router.post('/', wishlistController.addItem);

// DELETE /api/wishlist/:productId
router.delete('/:productId', wishlistController.removeItem);

module.exports = router;
