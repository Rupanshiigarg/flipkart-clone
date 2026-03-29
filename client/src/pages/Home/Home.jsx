import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCategories } from '../../api/products'
import './Home.css'

function Home() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  // Detect scroll to handle hiding category icons
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>

  return (
    <div className="home-page">
      {/* Category Strip Component (Sticky) */}
      <div className={`category-strip card ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container strip-inner">
          {categories.map(cat => (
            <Link key={cat.id} to={`/products?category=${cat.slug}`} className="strip-item">
              <img src={cat.imageUrl} alt={cat.name} className="strip-icon" />
              <span className="strip-label">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Modern Clickable Hero Grid */}
      <div className="container hero-container card">
        <div className="hero-grid">
          <Link to="/products?category=mobiles" className="hero-main card hover-lift">
            <img src="https://static.vecteezy.com/system/resources/previews/020/737/706/non_2x/web-banner-or-horizontal-template-design-with-special-offer-on-mobile-phones-for-advertising-concept-vector.jpg" alt="Special Offers" />
          </Link>
          <div className="hero-side-grid">
            {/* Electronic Appliances Hero Image */}
            <Link to="/products?category=appliances" className="hero-side-top card hover-lift">
              <img src="https://img.freepik.com/premium-vector/home-appliances-sale-facebook-cover-template-banner-design_958026-101.jpg" alt="Electronic Appliances" />
            </Link>
            <Link to="/products?category=laptops" className="hero-side-bottom card hover-lift">
              <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600&h=300" alt="New Laptops" />
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Recommendations */}
      <div className="container featured-sections card">
        <h2 className="section-title">Top Picks For You</h2>
        <div className="sections-grid">
          {categories.slice(0, 4).map(cat => (
            <Link key={cat.id} to={`/products?category=${cat.slug}`} className="featured-card card hover-lift">
              <div className="f-card-img">
                <img src={cat.imageUrl} alt={cat.name} />
              </div>
              <div className="f-card-info">
                <h3>{cat.name}</h3>
                <p className="green">Min. 50% Off</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
