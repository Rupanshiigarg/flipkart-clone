const prisma = require('../config/db');

// GET /api/wishlist
const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: req.userId },
      include: {
        product: {
          include: {
            images: { orderBy: { sortOrder: 'asc' }, take: 1 },
            category: true,
          },
        },
      },
    });
    res.json(wishlist);
  } catch (err) {
    next(err);
  }
};

// POST /api/wishlist  { productId }
const addItem = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    const item = await prisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId: req.userId,
          productId: parseInt(productId, 10),
        },
      },
      update: {},
      create: {
        userId: req.userId,
        productId: parseInt(productId, 10),
      },
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/wishlist/:productId
const removeItem = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId, 10);

    await prisma.wishlistItem.delete({
      where: {
        userId_productId: { userId: req.userId, productId },
      },
    });

    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getWishlist, addItem, removeItem };
