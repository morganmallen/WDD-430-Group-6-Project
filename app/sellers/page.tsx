"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './sellers.css';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

interface Product {
  id: number;
  product_name: string;
  product_image: string;
  product_seller: string;
  seller_image: string;
  price: number;
  description: string;
  condition: string;
  category: string;
  location: string | null;
  created_at: string;
}

interface ProductFormData {
  product_name: string;
  product_image: string;
  product_seller: string;
  seller_image: string;
  price: number;
  description: string;
  condition: string;
  category: string;
  location: string;
}

export default function SellProductPage() {
  const router = useRouter();
  const { userName, isLoggedIn } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize form data with empty strings or default values
  const [formData, setFormData] = useState<ProductFormData>({
    product_name: '',
    product_image: '',
    product_seller: userName || 'Loading Seller...',
    seller_image: '',
    price: 0,
    description: '',
    condition: 'Used - Good',
    category: 'Electronics',
    location: '',
  });

  useEffect(() => {
    if (isLoggedIn && userName) {
      fetchSellerProducts();
    }
  }, [isLoggedIn, userName]);

  const fetchSellerProducts = async () => {
    try {
      const response = await fetch(`/api/sellers/${userName}/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch seller products');
      }
    } catch (error) {
      console.error('Error fetching seller products:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!isLoggedIn || !userName) {
      setError("You must be logged in to list a product.");
      setLoading(false);
      return;
    }

    if (!formData.product_name || !formData.product_image || formData.price <= 0 || !formData.description) {
      setError('Please fill in all required fields (Product Name, Image URL, Price, Description).');
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      product_seller: userName,
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage('Product listed successfully!');
        setFormData({
          product_name: '',
          product_image: '',
          product_seller: userName || '',
          seller_image: '',
          price: 0,
          description: '',
          condition: 'Used - Good',
          category: 'Electronics',
          location: '',
        });
        setShowForm(false);
        fetchSellerProducts();
        router.refresh();
      } else {
        setError(data.message || 'Failed to list product.');
      }
    } catch (err) {
      console.error('Error listing product:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="sell-product-container">
        <p className="error-message">Please log in to list a product.</p>
        <button onClick={() => router.push('/login')} className="sell-button">Go to Login</button>
        <p className="back-link">
          <Link href="/">Back to Home</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="sell-product-container">
      <h1 className="sell-product-title">Your Products</h1>
      
      {!showForm && (
        <button 
          onClick={() => setShowForm(true)} 
          className="sell-button"
          style={{ marginBottom: '2rem' }}
        >
          Add New Product
        </button>
      )}

      {showForm ? (
        <div>
          <h2 className="form-title">List New Product</h2>
          <form onSubmit={handleSubmit} className="sell-product-form">
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <div className="form-group">
              <label htmlFor="product_name">Product Name:</label>
              <input
                type="text"
                id="product_name"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="product_image">Product Image URL:</label>
              <input
                type="url"
                id="product_image"
                name="product_image"
                value={formData.product_image}
                onChange={handleChange}
                required
              />
              {formData.product_image && (
                <div className="image-preview-container">
                  <p>Image Preview:</p>
                  <img src={formData.product_image} alt="Product Preview" className="image-preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="seller_image">Your Image URL (Seller Avatar):</label>
              <input
                type="url"
                id="seller_image"
                name="seller_image"
                value={formData.seller_image}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price ($):</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="condition">Condition:</label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
              >
                <option value="New">New</option>
                <option value="Used - Like New">Used - Like New</option>
                <option value="Used - Good">Used - Good</option>
                <option value="Used - Fair">Used - Fair</option>
                <option value="For Parts">For Parts</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Electronics">Electronics</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Sports & Recreation">Sports & Recreation</option>
                <option value="Fashion & Clothing">Fashion & Clothing</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-buttons">
              <button type="submit" disabled={loading} className="sell-button">
                {loading ? 'Listing Product...' : 'List Product'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)} 
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="products-grid">
          {products.length === 0 ? (
            <p className="no-products">You haven&apos;t listed any products yet.</p>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      )}

      <p className="back-link">
        <Link href="/">Back to Home</Link>
      </p>
    </div>
  );
}