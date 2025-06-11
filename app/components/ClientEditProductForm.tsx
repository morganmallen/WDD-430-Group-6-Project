// components/ClientEditProductForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import "../sellers/sellers.css"; 

interface Product {
  id: number;
  product_name: string;
  product_image: string;
  product_seller: string;
  seller_image: string;
  price: number;
  description?: string;
  condition?: string;
  category?: string;
  location?: string;
  created_at: string;
}

interface ClientEditProductFormProps {
  initialProductData: Product;
}

export default function ClientEditProductForm({ initialProductData }: ClientEditProductFormProps) {
  const router = useRouter();
  const { userName, isLoggedIn } = useAuth();

  // State to hold form data, initialized with fetched product data
  const [formData, setFormData] = useState<Product>(initialProductData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Authorization check (only allow editing by the actual seller)
  const isAuthorizedToEdit = isLoggedIn && userName === initialProductData.product_seller;

  // If not authorized, redirect immediately or show a message
  useEffect(() => {
    if (!isLoggedIn) {
      alert("You must be logged in to edit products.");
      router.push('/login');
    } else if (userName !== initialProductData.product_seller) {
      alert("You are not authorized to edit this product.");
      router.push(`/products/${initialProductData.id}`); // Redirect back to product details
    }
  }, [isLoggedIn, userName, initialProductData.product_seller, initialProductData.id, router]);


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

    // Re-check authorization before submission, just in case
    if (!isAuthorizedToEdit) {
      setError("You are not authorized to perform this action.");
      setLoading(false);
      return;
    }

    // Basic client-side validation
    if (!formData.product_name || !formData.product_image || formData.price <= 0 || !formData.description) {
      setError('Please fill in all required fields (Product Name, Image URL, Price, Description).');
      setLoading(false);
      return;
    }

    try {
      // Send data to the new API route for updating a product
      const res = await fetch(`/api/products/${formData.id}`, {
        method: 'PUT', // or 'PATCH' if you prefer partial updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send the entire updated formData
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage('Product updated successfully!');
        // Optionally redirect back to the product details page
        router.push(`/products/${formData.id}`);
        router.refresh(); // Invalidate cache for the product details page
      } else {
        setError(data.message || 'Failed to update product.');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If not authorized, return null or a message to prevent form from loading
  if (!isAuthorizedToEdit) {
    return null; // The useEffect will handle the redirection/alert
  }

  return (
    // <<< CHANGE CLASS NAMES HERE >>>
    <div className="sell-product-container"> {/* Changed from edit-product-form-container */}
      <form onSubmit={handleSubmit} className="sell-product-form"> {/* Changed from product-form */}
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
          <label htmlFor="seller_image">Seller Image URL:</label>
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
            step="0.01"
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
            value={formData.condition || 'Used - Good'}
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
            value={formData.category || 'Other'}
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
          <label htmlFor="location">Location (Optional):</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading} className="sell-button">
          {loading ? 'Updating Product...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
}