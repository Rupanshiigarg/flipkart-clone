const prisma = require('../config/db');

// GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const cart = await prisma.cartItem.findMany({
      where: { userId: req.userId },
      include: {
        product: {
          include: {
            images: { orderBy: { sortOrder: 'asc' }, take: 1 },
          },
        },
      },
    });
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// POST /api/cart  { productId, quantity }
const addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    // Check product exists and has stock
    const product = await prisma.product.findUnique({ where: { id: parseInt(productId, 10) } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.stock < 1) return res.status(400).json({ error: 'Product out of stock' });

    const item = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: req.userId,
          productId: parseInt(productId, 10),
        },
      },
      update: { quantity: { increment: quantity } },
      create: {
        userId: req.userId,
        productId: parseInt(productId, 10),
        quantity,
      },
      include: {
        product: {
          include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
        },
      },
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/cart/:productId  { quantity }
const updateItem = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'quantity must be >= 1' });
    }

    const item = await prisma.cartItem.update({
      where: {
        userId_productId: { userId: req.userId, productId },
      },
      data: { quantity },
      include: {
        product: {
          include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
        },
      },
    });

    res.json(item);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/cart/:productId
const removeItem = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId, 10);

    await prisma.cartItem.delete({
      where: {
        userId_productId: { userId: req.userId, productId },
      },
    });

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addItem, updateItem, removeItem };
