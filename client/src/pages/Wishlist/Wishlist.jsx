import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getWishlist, removeFromWishlist } from '../../api/wishlist'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'
import './Wishlist.css'

function Wishlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addItem } = useCart()

  const fetchWishlist = () => {
    setLoading(true)
    getWishlist()
      .then(setItems)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId)
      setItems(prev => prev.filter(i => i.productId !== productId))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleAddToCart = (product) => {
    addItem(product, 1)
    handleRemove(product.id)
  }

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>
  if (error) return <div className="error-msg">{error}</div>

  return (
    <div className="container page wishlist-page">
      <div className="wishlist-container card">
        <div className="wishlist-header">
          <h1>My Wishlist ({items.length})</h1>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <img src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4dda-b473-7e5204ca2635.png?q=90" alt="Empty Wishlist" style={{ width: 150 }} />
            <h2>Your wishlist is empty!</h2>
            <p>Save items that you like in your wishlist.</p>
            <Link to="/products" className="btn btn-blue">Continue Shopping</Link>
          </div>
        ) : (
          <div className="wishlist-list">
            {items.map(item => (
              <div key={item.id} className="wishlist-item">
                <div className="wi-img">
                  <img src={item.product?.images?.[0]?.url} alt={item.product?.name} />
                </div>
                <div className="wi-details">
                  <Link to={`/products/${item.productId}`} className="wi-name">{item.product?.name}</Link>
                  <div className="wi-rating">
                    <span className="star-badge">
                      {item.product?.rating} <span className="star-icon">★</span>
                    </span>
                    <span className="review-count">({item.product?.reviewCount.toLocaleString()})</span>
                  </div>
                  <div className="wi-price-box">
                    <span className="price">{formatPrice(item.product?.price)}</span>
                    <span className="price-mrp">{formatPrice(item.product?.mrp)}</span>
                    <span className="discount">
                      {Math.round(((item.product?.mrp - item.product?.price) / item.product?.mrp) * 100)}% Off
                    </span>
                  </div>
                </div>
                <div className="wi-actions">
                  <button className="btn btn-blue btn-sm" onClick={() => handleAddToCart(item.product)}>
                    ADD TO CART
                  </button>
                  <button className="btn-remove" onClick={() => handleRemove(item.productId)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#878787">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
