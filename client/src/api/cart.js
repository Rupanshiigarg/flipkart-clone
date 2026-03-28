import api from './axiosInstance'

export const getCart = () => api.get('/cart')
export const addToCart = (productId, quantity = 1) =>
  api.post('/cart', { productId, quantity })
export const updateCartQty = (productId, quantity) =>
  api.patch(`/cart/${productId}`, { quantity })
export const removeFromCart = (productId) => api.delete(`/cart/${productId}`)
