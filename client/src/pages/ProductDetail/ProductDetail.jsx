import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProductById } from '../../api/products'
import { useCart } from '../../context/CartContext'
import { formatPrice, getDiscount } from '../../utils/formatPrice'
import './ProductDetail.css'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    setLoading(true)
    getProductById(id)
      .then(res => {
        setProduct(res)
        setActiveImg(0)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>
  if (error) return <div className="error-msg">{error}</div>
  if (!product) return <div className="error-msg">Product not found</div>

  const { name, brand, price, mrp, rating, reviewCount, description, images, specs, stock } = product
  const discount = getDiscount(price, mrp)

  const handleAddToCart = () => {
    addItem(product, 1)
    // No navigation — just update cart
  }

  const handleBuyNow = () => {
    addItem(product, 1)
    navigate('/cart')
  }

  return (
    <div className="container product-detail-page page">
      <div className="detail-layout">
        {/* Left Column: Images + Buttons */}
        <div className="detail-left">
          <div className="sticky-content">
            <div className="image-section card">
              <div className="image-main">
                <img src={images?.[activeImg]?.url} alt={name} />
              </div>
              <div className="image-thumbs">
                {images?.map((img, i) => (
                  <div
                    key={img.id}
                    className={`thumb ${i === activeImg ? 'active' : ''}`}
                    onMouseEnter={() => setActiveImg(i)}
                  >
                    <img src={img.url} alt={`Thumb ${i}`} />
                  </div>
                ))}
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="btn btn-yellow btn-block btn-large"
                disabled={stock < 1}
                onClick={handleAddToCart}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.32 2.405H4.887C3 2.405 2.46.805 2.46.805L2.257.21C2.208.085 2.083 0 1.946 0H.336C.152 0 0 .152 0 .336v.463c0 .184.152.336.336.336h.79l1.88 6.423a2.423 2.423 0 001.583 1.585H14.12c.184 0 .336-.152.336-.336V8.14c0-.184-.152-.336-.336-.336h-8.21a.762.762 0 01-.741-.572L4.69 5.37h9.507a.915.915 0 00.906-.77l.635-2.261a.915.915 0 00-.418-.94z" fill="#fff" />
                </svg>
                ADD TO CART
              </button>
              <button
                className="btn btn-orange btn-block btn-large"
                disabled={stock < 1}
                onClick={handleBuyNow}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.417 2.022L13.333.32a.5.5 0 0 0-.649.022L10.334 2h-1a.5.5 0 0 0-.5.5v2.333H6.5a.5.5 0 0 0-.5.5v2.333H3.667a.5.5 0 0 0-.5.5V10.5H1.5a.5.5 0 0 0-.5.5v3.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V2.5a.5.5 0 0 0-.083-.478zM14 14H2V3.125l.441.36a.5.5 0 0 0 .638.014L5.333 1.5l2.254 2.013a.5.5 0 0 0 .649.022L10.334 2h2.25l1.416 1.157V14z" fill="#fff" />
                </svg>
                BUY NOW
              </button>
            </div>
            {stock < 1 && <p className="stock-alert">Out of Stock</p>}
          </div>
        </div>

        {/* Right Column: Info + Specs */}
        <div className="detail-right card">
          <div className="detail-header">
            <span className="detail-brand">{brand}</span>
            <h1 className="detail-name">{name}</h1>
            <div className="detail-rating">
              <span className="star-badge">
                {rating} <span className="star-icon">★</span>
              </span>
              <span className="review-count">{reviewCount.toLocaleString()} Ratings & reviews</span>
            </div>
          </div>

          <div className="detail-price-box">
            <span className="price">{formatPrice(price)}</span>
            {mrp > price && (
              <>
                <span className="price-mrp">{formatPrice(mrp)}</span>
                <span className="discount">{discount}% off</span>
              </>
            )}
          </div>

          <div className="detail-offers">
            <h3>Available offers</h3>
            <ul>
              <li><span>Bank Offer</span> 10% instant discount on XYZ Bank Credit Cards, up to ₹1000</li>
              <li><span>Special Price</span> Get extra ₹2000 off (price inclusive of cashback/coupon)</li>
              <li><span>Partner Offer</span> Purchase now & get a surprise cashback coupon</li>
            </ul>
          </div>

          <div className="detail-description">
            <h3>Product Description</h3>
            <p>{description}</p>
          </div>

          <div className="detail-specs">
            <h3>Specifications</h3>
            <div className="specs-table">
              {specs?.map(spec => (
                <div key={spec.id} className="spec-row">
                  <div className="spec-key">{spec.specKey}</div>
                  <div className="spec-value">{spec.specValue}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
