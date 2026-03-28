import { createContext, useContext, useState, useEffect } from 'react'
import * as cartApi from '../api/cart'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Load cart from backend on mount
  useEffect(() => {
    cartApi.getCart()
      .then(setCartItems)
      .catch(() => setCartItems([]))
      .finally(() => setLoading(false))
  }, [])

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0)
  const subtotal = cartItems.reduce(
    (s, i) => s + i.product.price * i.quantity, 0
  )
  const savings = cartItems.reduce(
    (s, i) => s + (i.product.mrp - i.product.price) * i.quantity, 0
  )

  // Optimistic add
  const addItem = async (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.productId === product.id)
      if (existing) {
        return prev.map(i =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, { productId: product.id, quantity, product }]
    })
    try {
      await cartApi.addToCart(product.id, quantity)
      const fresh = await cartApi.getCart()
      setCartItems(fresh)
    } catch {
      const fresh = await cartApi.getCart()
      setCartItems(fresh)
    }
  }

  // Optimistic update qty
  const updateQty = async (productId, quantity) => {
    const prev = cartItems
    setCartItems(items =>
      items.map(i => i.productId === productId ? { ...i, quantity } : i)
    )
    try {
      await cartApi.updateCartQty(productId, quantity)
    } catch {
      setCartItems(prev)
    }
  }

  // Optimistic remove
  const removeItem = async (productId) => {
    const prev = cartItems
    setCartItems(items => items.filter(i => i.productId !== productId))
    try {
      await cartApi.removeFromCart(productId)
    } catch {
      setCartItems(prev)
    }
  }

  const clearCart = () => setCartItems([])

  return (
    <CartContext.Provider value={{
      cartItems, loading, totalItems, subtotal, savings,
      addItem, updateQty, removeItem, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
