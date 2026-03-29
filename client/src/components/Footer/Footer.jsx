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
            <p>Return Policy</p>
            <p>Terms of Use</p>
            <p>Security</p>
            <p>Privacy</p>
          </div>
          <div className="footer-column">
            <h3>SOCIAL</h3>
            <p>Facebook</p>
            <p>Twitter</p>
            <p>YouTube</p>
            <p>Instagram</p>
          </div>
        </div>
        <div className="footer-sample-text" style={{ padding: '20px 0', marginTop: '10px', fontSize: '12px', color: '#878787' }}>
          <p>
            <strong>Registered Office Address:</strong> Flipkart Clone Internet Private Limited, Buildings Alyssa, Begonia & Clove Embassy Tech Village, 
            Outer Ring Road, Devarabeesanahalli Village, Bengaluru, 560103, Karnataka, India.
          </p>
          <p style={{ marginTop: '8px' }}>
            This is a sample text for the footer to demonstrate the layout. It accurately reflects the design of a premium e-commerce platform.
            All product names, logos, and brands are property of their respective owners.
          </p>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Flipkart Clone — SDE Intern Assignment</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
