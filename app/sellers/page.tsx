"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "./sellers.css";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";

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

// Helper function to convert Pixabay photo page URL to direct image URL
const convertPixabayUrl = (url: string): string => {
  // If it's already a direct image URL, return as is
  if (url.includes("cdn.pixabay.com")) {
    return url;
  }

  // Extract the photo ID from the Pixabay photo page URL
  const match = url.match(/photos\/[^/]+\-(\d+)/);
  if (!match) {
    return url; // Return original URL if we can't extract the ID
  }

  const photoId = match[1];
  // Return a direct image URL using the photo ID
  return `https://cdn.pixabay.com/photo/${photoId}/1280.jpg`;
};

export default function SellProductPage() {
  const router = useRouter();
  const { userName, isLoggedIn, sellerImage, updateSellerImage } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize form data with existing seller image if available
  const [formData, setFormData] = useState<ProductFormData>({
    product_name: "",
    product_image: "",
    product_seller: userName || "Loading Seller...",
    seller_image: sellerImage || "",
    price: 0,
    description: "",
    condition: "Used - Good",
    category: "Electronics",
    location: "",
  });

  // Update form data when sellerImage changes
  useEffect(() => {
    if (sellerImage) {
      setFormData((prev) => ({
        ...prev,
        seller_image: sellerImage,
      }));
    }
  }, [sellerImage]);

  const fetchData = useCallback(async () => {
    if (!isLoggedIn || !userName) return;

    try {
      // Fetch products
      const productsResponse = await fetch(`/api/sellers/${userName}/products`);
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData);

        // Get seller image from the most recent product if no seller image exists
        if (!sellerImage && productsData.length > 0) {
          const mostRecentProduct = productsData[0];
          if (mostRecentProduct.seller_image) {
            setFormData((prev) => ({
              ...prev,
              seller_image: mostRecentProduct.seller_image,
            }));
            updateSellerImage(mostRecentProduct.seller_image);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [isLoggedIn, userName, sellerImage, updateSellerImage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "product_image" && value.includes("pixabay.com")) {
      // Convert Pixabay URL to direct image URL
      const directUrl = convertPixabayUrl(value);
      setFormData((prev) => ({
        ...prev,
        [name]: directUrl,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "price" ? parseFloat(value) || 0 : value,
      }));
    }
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

    if (
      !formData.product_name ||
      !formData.product_image ||
      formData.price <= 0 ||
      !formData.description ||
      !formData.seller_image
    ) {
      setError(
        "Please fill in all required fields (Product Name, Image URL, Price, Description, Seller Avatar)."
      );
      setLoading(false);
      return;
    }

    try {
      // First, update the seller's profile image if it's different
      if (formData.seller_image !== sellerImage) {
        const profileResponse = await fetch("/api/profile/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            seller_image: formData.seller_image,
          }),
        });

        if (!profileResponse.ok) {
          throw new Error("Failed to update profile image");
        }

        // Update the auth context with new seller image
        updateSellerImage(formData.seller_image);
      }

      // Then create the product
      const productResponse = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await productResponse.json();

      if (productResponse.ok && data.success) {
        setSuccessMessage("Product listed successfully!");
        setFormData({
          product_name: "",
          product_image: "",
          product_seller: userName,
          seller_image: formData.seller_image, // Keep the seller image
          price: 0,
          description: "",
          condition: "Used - Good",
          category: "Electronics",
          location: "",
        });
        setShowForm(false);
        fetchData(); // Refresh the products list
        router.refresh();
      } else {
        setError(data.message || "Failed to list product.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="sell-product-container">
        <p className="error-message">Please log in to list a product.</p>
        <button onClick={() => router.push("/login")} className="sell-button">
          Go to Login
        </button>
        <p className="back-link">
          <Link href="/">Back to Home</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="sell-product-container">
      <h1 className="sell-product-title">Your Products</h1>

      <div className="profile-section seller-profile-section">
        <h2>Account Information</h2>
        <div className="profile-info">
          <div className="profile-image-container">
            <Image
              src={formData.seller_image}
              alt={`${userName}'s Profile`}
              width={150}
              height={150}
              style={{ objectFit: "cover" }}
              className="profile-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/default-avatar.png";
              }}
            />
          </div>
          <p>
            <strong>Name:</strong> {userName}
          </p>
          <p>
            <strong>Store:</strong> {userName}&apos;s Store
          </p>
        </div>
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="sell-button"
          style={{ marginBottom: "2rem" }}
        >
          Add New Product
        </button>
      )}

      {showForm ? (
        <div>
          <h2 className="form-title">List New Product</h2>
          <form onSubmit={handleSubmit} className="sell-product-form">
            {error && <p className="error-message">{error}</p>}
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}

            <div className="form-group">
              <label htmlFor="seller_image">
                Your Profile Image (Seller Avatar):
              </label>
              <input
                type="url"
                id="seller_image"
                name="seller_image"
                value={formData.seller_image}
                onChange={handleChange}
                required
                placeholder="Enter image URL (https://...)"
              />
              <small className="form-help-text">
                Enter a URL for your profile image. The image should be square
                and at least 150x150 pixels.
              </small>
              {formData.seller_image && (
                <div className="image-preview-container">
                  <p>Profile Image Preview:</p>
                  <div className="image-preview">
                    <Image
                      src={formData.seller_image}
                      alt="Profile Preview"
                      width={150}
                      height={150}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              )}
            </div>

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
                placeholder="Enter Pixabay photo page URL or direct image URL"
              />
              <small className="form-help-text">
                You can paste a Pixabay photo page URL (e.g.,
                https://pixabay.com/photos/...) or a direct image URL. If using
                Pixabay, we&apos;ll automatically convert it to a direct image
                URL.
              </small>
              {formData.product_image && (
                <div className="image-preview-container">
                  <p>Image Preview:</p>
                  <div className="image-preview">
                    <Image
                      src={formData.product_image}
                      alt="Product Preview"
                      width={300}
                      height={200}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price ($):</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price || ""}
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
                {loading ? "Listing Product..." : "List Product"}
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
            <p className="no-products">
              You haven&apos;t listed any products yet.
            </p>
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
