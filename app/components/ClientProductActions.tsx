"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface ClientProductActionsProps {
  productId: number;
  productSellerName: string; 
}

export default function ClientProductActions({ productId, productSellerName }: ClientProductActionsProps) {
  const router = useRouter();
  const { userName, isLoggedIn } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthorizedUser = isLoggedIn && userName && userName === productSellerName;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert(data.message); // Show success message
        router.push('/products'); // Redirect to the main products page
        router.refresh(); // Invalidate cache for product list
      } else {
        setError(data.message || 'Failed to delete product.');
        alert(data.message || 'Failed to delete product.'); // Show error message
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('An unexpected error occurred during deletion.');
      alert('An unexpected error occurred during deletion.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    // Redirect to the edit page for this product
    router.push(`/products/${productId}/edit`);
  };

  // If the user is not authorized, don't render the buttons
  if (!isAuthorizedUser) {
    return null;
  }

  return (
    <div className="product-actions-container">
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
      {/* Edit Button */}
      <button
        onClick={handleEdit}
        disabled={loading} // Disable if delete is in progress
        className="edit-button"
        style={{
            backgroundColor: 'green', 
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginRight: '10px',
            opacity: loading ? 0.7 : 1,
        }}
      >
        Edit Product
      </button>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="delete-button"
        style={{
            backgroundColor: '#e74c3c', // Red
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Deleting...' : 'Delete Product'}
      </button>
    </div>
  );
}