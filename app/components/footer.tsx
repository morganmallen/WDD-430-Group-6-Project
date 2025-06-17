import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <Link href="/" aria-label="Handcrafted Haven Home">
            <img src="/logo.png" alt="Handcrafted Haven Logo" className="logo" />
            
          </Link>
        </div>
        <div className="footer-links">
          <h3>Contact Us</h3>
          <ul>
            <li><a href="fabianzkp@gmail.com">Email</a></li>
            <li><a href="tel:+1234567890">Phone: (234) </a></li>
          </ul>
        </div>
        <div className="footer-social">
          <h3>Follow Us</h3>
          <ul>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">Twitter</a></li>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">Facebook</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}