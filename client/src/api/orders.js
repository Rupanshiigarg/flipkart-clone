import api from './axiosInstance'

export const placeOrder = (shippingAddress) =>
  api.post('/orders', { shippingAddress })
export const getOrders = () => api.get('/orders')
export const getOrderById = (id) => api.get(`/orders/${id}`)
