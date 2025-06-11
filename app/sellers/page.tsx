"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './sellers.css';
import { useAuth } from '../context/AuthContext'; 

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

  // Initialize form data with empty strings or default values
  const [formData, setFormData] = useState<ProductFormData>({
    product_name: '',
    product_image: '',
    // Initialize product_seller with userName or a placeholder
    product_seller: userName || 'Loading Seller...', // Use userName if available, else a placeholder
    seller_image: '/images/default-seller.png',
    price: 0,
    description: '',
    condition: 'Used - Good',
    category: 'Electronics',
    location: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value, // Convert price to number
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Check if logged in before attempting to list product
    if (!isLoggedIn || !userName) {
      setError("You must be logged in to list a product.");
      setLoading(false);
      return;
    }

    // client-side validation
    if (!formData.product_name || !formData.product_image || formData.price <= 0 || !formData.description) {
      setError('Please fill in all required fields (Product Name, Image URL, Price, Description).');
      setLoading(false);
      return;
    }

    // Create the payload with the current userName ---
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
        body: JSON.stringify(payload), // <<< Send the updated payload
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage('Product listed successfully!');
        // Reset form after successful submission
        setFormData({
          product_name: '',
          product_image: '',
          product_seller: userName || '', // Reset with current userName 
          seller_image: '/images/default-seller.png',
          price: 0,
          description: '',
          condition: 'Used - Good',
          category: 'Electronics',
          location: '',
        });
        // Redirect to the newly listed product page or product list after a delay
        router.push(`/products/${data.productId}`); 
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

  // Optional: Display a message if the user is not logged in
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
      <h1 className="sell-product-title">List Your Product</h1>
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
            value={formData.price}
            onChange={handleChange}
            step="0.01" // Allow decimal values for price
            min="0" 
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
            <option value="Handmade Crafts">Handmade Crafts</option>
            <option value="Home Decor">Home Decor</option>
            <option value="Apparel">Apparel</option>
            <option value="Jewelry">Jewelry</option>
            <option value="Art & Collectibles">Art & Collectibles</option>
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

        <button type="submit" disabled={loading} className="sell-button">
          {loading ? 'Listing Product...' : 'Sell Product'}
        </button>
      </form>

      <p className="back-link">
        <Link href="/">Back to Home</Link>
      </p>
    </div>
  );
}