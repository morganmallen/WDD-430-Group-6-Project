import Link from 'next/link';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-header">
          <h1 className="not-found-code">404</h1>
          <h2 className="not-found-title">
            Product Not Found
          </h2>
          <p className="not-found-message">
            Sorry, we couldn&apos;t find the product you&apos;re looking for. 
            It may have been removed or the link might be incorrect.
          </p>
        </div>
        
        <div className="not-found-actions">
          <Link 
            href="/products"
            className="btn-primary-link"
          >
            Browse All Products
          </Link>
          <Link 
            href="/"
            className="btn-secondary-link"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}