import { Link } from 'react-router-dom'
import { formatPrice, getDiscount, truncate } from '../../utils/formatPrice'
import './ProductCard.css'

function ProductCard({ product }) {
  const { id, name, price, mrp, brand, rating, reviewCount, images } = product
  const discount = getDiscount(price, mrp)
  const imageUrl = images?.[0]?.url || 'https://via.placeholder.com/200'

  return (
    <Link to={`/products/${id}`} className="product-card">
      <div className="product-card-image">
        <img src={imageUrl} alt={name} loading="lazy" />
      </div>
      <div className="product-card-content">
        <h3 className="product-brand">{brand}</h3>
        <h2 className="product-name">{truncate(name, 45)}</h2>
        <div className="product-card-rating">
          <span className="star-badge">
            {rating} <span className="star-icon">★</span>
          </span>
          <span className="review-count">({reviewCount.toLocaleString()})</span>
        </div>
        <div className="product-card-price">
          <span className="price">{formatPrice(price)}</span>
          {mrp > price && (
            <>
              <span className="price-mrp">{formatPrice(mrp)}</span>
              <span className="discount">{discount}% off</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
