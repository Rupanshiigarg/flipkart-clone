import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../../api/orders'
import { formatPrice } from '../../utils/formatPrice'
import './OrderHistory.css'

function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>
  if (error) return <div className="error-msg">{error}</div>

  return (
    <div className="container page order-history-page">
      <h1 className="page-title">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="empty-state card">
          <h2>No orders found</h2>
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-blue">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card card">
              <div className="order-head">
                <div className="order-info">
                  <span className="order-id">Order ID: #{order.id}</span>
                  <span className="order-date">Placed on: {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="order-status badge-status">
                  {order.status}
                </div>
              </div>
              
              <div className="order-items">
                {order.items.map(item => (
                  <div key={item.id} className="oi-row">
                    <img src={item.product?.images?.[0]?.url} alt={item.product?.name} className="oi-img" />
                    <div className="oi-details">
                      <Link to={`/products/${item.productId}`} className="oi-name">{item.product?.name}</Link>
                      <p className="oi-brand">{item.product?.brand}</p>
                      <p className="oi-qty">Qty: {item.quantity}</p>
                    </div>
                    <div className="oi-price">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-foot">
                <span>Total Amount: <strong>{formatPrice(order.totalAmount)}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderHistory
