import { useParams, Link } from 'react-router-dom'
import './OrderConfirmation.css'

function OrderConfirmation() {
  const { id } = useParams()

  return (
    <div className="container page confirmation-page">
      <div className="confirmation-card card">
        <div className="conf-icon">
          <svg width="60" height="60" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="23" stroke="#388E3C" strokeWidth="2"/>
            <path d="M15 25L22 32L35 18" stroke="#388E3C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h1>Order Placed Successfully!</h1>
        <p className="order-id-label">Order ID: <span>#{id}</span></p>
        <p className="conf-msg">
          Thank you for shopping with us! Your order has been placed and is being processed. 
          You will receive an email confirmation shortly.
        </p>

        <div className="conf-actions">
          <Link to="/orders" className="btn btn-blue">View My Orders</Link>
          <Link to="/" className="btn btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
