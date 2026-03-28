import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { placeOrder } from '../../api/orders'
import { formatPrice } from '../../utils/formatPrice'
import './Checkout.css'

function Checkout() {
  const { cartItems, subtotal, savings, totalItems, clearCart } = useCart()
  const navigate = useNavigate()
  
  const [address, setAddress] = useState('12 MG Road, Bangalore, Karnataka 560001')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (cartItems.length === 0 && !isSubmitting) return <Navigate to="/cart" />

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const order = await placeOrder(address)
      clearCart()
      navigate(`/order-confirmation/${order.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container checkout-page page">
      <div className="checkout-layout">
        <div className="checkout-main">
          {/* Section 1: Address (Simulated) */}
          <div className="checkout-section card">
            <div className="section-head active">
              <span className="step-num">1</span>
              <h3>DELIVERY ADDRESS</h3>
            </div>
            <div className="section-body">
              <form onSubmit={handlePlaceOrder}>
                <div className="form-group">
                  <textarea 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter full shipping address"
                    required
                  />
                </div>
                <div className="address-confirm">
                  <p>Order confirmation will be sent to <strong>user@flipkart.com</strong></p>
                </div>
              </form>
            </div>
          </div>

          {/* Section 2: Order Summary */}
          <div className="checkout-section card">
            <div className="section-head">
              <span className="step-num">2</span>
              <h3>ORDER SUMMARY</h3>
            </div>
            <div className="section-body summary-rows">
              {cartItems.map(item => (
                <div key={item.productId} className="checkout-item">
                  <span className="item-name">{item.product?.name} x {item.quantity}</span>
                  <span className="item-price">{formatPrice(item.product?.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Payment (Simulated) */}
          <div className="checkout-section card">
            <div className="section-head">
              <span className="step-num">3</span>
              <h3>PAYMENT OPTIONS</h3>
            </div>
            <div className="section-body">
              <div className="payment-option">
                <input type="radio" checked readOnly />
                <label>Cash on Delivery (Default for this assignment)</label>
              </div>
              
              {error && <p className="error-text">{error}</p>}
              
              <button 
                className="btn btn-orange btn-large btn-place"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'PLACING ORDER...' : 'PLACE ORDER'}
              </button>
            </div>
          </div>
        </div>

        <aside className="checkout-summary card">
          <div className="summary-header">
            <h3>PRICE DETAILS</h3>
          </div>
          <div className="summary-body">
            <div className="summary-row">
              <span>Price ({totalItems} items)</span>
              <span>{formatPrice(subtotal + savings)}</span>
            </div>
            <div className="summary-row">
              <span>Discount</span>
              <span className="green">- {formatPrice(savings)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charges</span>
              <span className="green">FREE</span>
            </div>
            <div className="summary-total">
              <span>Total Payable</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Checkout
