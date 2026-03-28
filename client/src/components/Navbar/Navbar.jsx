import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './Navbar.css'

function Navbar() {
  const [search, setSearch] = useState('')
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <span className="logo-f">Flipkart</span>
            <span className="logo-plus">Explore <i>Plus</i></span>
          </Link>
          <form className="navbar-search" onClick={(e) => e.stopPropagation()} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">
              <svg width="20" height="20" viewBox="0 0 17 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 15.5L11.5 11.5M13 7.5C13 10.5376 10.5376 13 7.5 13C4.46243 13 2 10.5376 2 7.5C2 4.46243 4.46243 2 7.5 2C10.5376 2 13 4.46243 13 7.5Z" stroke="#2874F0" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
            </button>
          </form>
        </div>

        <div className="navbar-right">
          <span className="navbar-user">Rahul Sharma</span>
          <Link to="/orders" className="navbar-link">Orders</Link>
          <Link to="/cart" className="navbar-cart">
            <div className="cart-icon-wrap">
              <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.32 2.405H4.887C3 2.405 2.46.805 2.46.805L2.257.21C2.208.085 2.083 0 1.946 0H.336C.152 0 0 .152 0 .336v.463c0 .184.152.336.336.336h.79l1.88 6.423a2.423 2.423 0 001.583 1.585H14.12c.184 0 .336-.152.336-.336V8.14c0-.184-.152-.336-.336-.336h-8.21a.762.762 0 01-.741-.572L4.69 5.37h9.507a.915.915 0 00.906-.77l.635-2.261a.915.915 0 00-.418-.94z" fill="#fff" />
              </svg>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </div>
            <span>Cart</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar
