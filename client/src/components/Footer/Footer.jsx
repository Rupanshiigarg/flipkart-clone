import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-links">
          <div className="footer-column">
            <h3>ABOUT</h3>
            <p>Contact Us</p>
            <p>About Us</p>
            <p>Careers</p>
            <p>Flipkart Stories</p>
            <p>Press</p>
          </div>
          <div className="footer-column">
            <h3>HELP</h3>
            <p>Payments</p>
            <p>Shipping</p>
            <p>Cancellation & Returns</p>
            <p>FAQ</p>
          </div>
          <div className="footer-column">
            <h3>POLICY</h3>
          </div>
          <div className="footer-column">
            <h3>SOCIAL</h3>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Flipkart Clone — SDE Intern Assignment</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
