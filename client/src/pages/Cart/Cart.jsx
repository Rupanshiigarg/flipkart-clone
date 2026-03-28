import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'
import './Cart.css'

function Cart() {
  const { cartItems, loading, updateQty, removeItem, subtotal, savings, totalItems } = useCart()
  const navigate = useNavigate()

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>

  if (cartItems.length === 0) {
    return (
      <div className="container page">
        <div className="empty-state card">
          <img src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4dda-b473-7e5204ca2635.png?q=90" alt="Empty Cart" style={{ width: 200, marginBottom: 20 }} />
          <h2>Your cart is empty!</h2>
          <p>Add items to it now.</p>
          <Link to="/products" className="btn btn-blue">Shop Now</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container cart-page page">
      <div className="cart-layout">
        {/* Left: Items List */}
        <div className="cart-items-section card">
          <div className="cart-header">
            <h2>Flipkart ({totalItems})</h2>
          </div>
          
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item-row">
                <div className="item-img-qty">
                  <div className="item-img">
                    <img src={item.product?.images?.[0]?.url} alt={item.product?.name} />
                  </div>
                  <div className="qty-controls">
                    <button 
                      onClick={() => updateQty(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >-</button>
                    <input type="text" value={item.quantity} readOnly />
                    <button 
                      onClick={() => updateQty(item.productId, item.quantity + 1)}
                    >+</button>
                  </div>
                </div>
                
                <div className="item-details">
                  <Link to={`/products/${item.productId}`} className="item-name">
                    {item.product?.name}
                  </Link>
                  <p className="item-brand">{item.product?.brand}</p>
                  
                  <div className="item-price-box">
                    <span className="price">{formatPrice(item.product?.price)}</span>
                    <span className="price-mrp">{formatPrice(item.product?.mrp)}</span>
                    <span className="discount">
                      {Math.round(((item.product?.mrp - item.product?.price) / item.product?.mrp) * 100)}% Off
                    </span>
                  </div>
                  
                  <div className="item-actions">
                    <button className="btn-action" onClick={() => removeItem(item.productId)}>
                      REMOVE
                    </button>
                  </div>
                </div>
                
                <div className="delivery-info">
                  <p>Delivery by tomorrow | <span className="free">Free</span></p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="place-order-footer">
            <button 
              className="btn btn-orange btn-large"
              onClick={() => navigate('/checkout')}
            >
              PLACE ORDER
            </button>
          </div>
        </div>

        {/* Right: Price Summary */}
        <aside className="cart-summary card">
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
              <span>Total Amount</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="savings-msg">You will save {formatPrice(savings)} on this order</p>
          </div>
          
          <div className="safe-payment">
            <svg width="25" height="28" viewBox="0 0 25 28" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 0L0 5.6v8.4c0 7.7 5.3 14.9 12.5 14 7.2.9 12.5-8.1 12.5-14V5.6L12.5 0zm0 3.1L21.9 8v6c0 6.2-4 11.9-9.4 12.8-5.4-.9-9.4-6.6-9.4-12.8V8l9.4-4.9z" fill="#878787"></path>
            </svg>
            <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Cart
