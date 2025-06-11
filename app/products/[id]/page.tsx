import { notFound } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import Image from 'next/image';
import Link from 'next/link';
import "./ProductDetails.css";
import ClientReviewFormWrapper from "../../components/ClientReviewFormWrapper";
import ClientProductActions from "../../components/ClientProductActions";

// Interfaces for database models
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

interface DatabaseReview {
  id: number;
  product_id: number;
  user_first_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const sql = neon(process.env.DATABASE_URL!);

async function fetchProduct(productId: number): Promise<Product | null> {
  try {
    const products = await sql`
      SELECT
        id,
        product_name,
        product_image,
        product_seller,
        seller_image,
        price,
        description,
        condition,
        category,
        location,
        created_at
      FROM products
      WHERE id = ${productId}
    `;

    return (products[0] as Product) || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function fetchProductReviews(productId: number): Promise<DatabaseReview[]> {
  try {
    const reviews = await sql`
      SELECT
        id,
        product_id,
        user_first_name,
        rating,
        comment,
        created_at
      FROM product_reviews
      WHERE product_id = ${productId}
      ORDER BY created_at DESC
    ` as DatabaseReview[];
    return reviews;
  } catch (error) {
    console.error(`Error fetching reviews for product ID ${productId}:`, error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>; 
}) {
  const { id } = await params; 
  const productId = parseInt(id);

  if (isNaN(productId)) {
    return {
      title: "Product Not Found | Handcrafted Haven",
    };
  }

  const product = await fetchProduct(productId);

  if (!product) {
    return {
      title: "Product Not Found | Handcrafted Haven",
    };
  }

  return {
    title: `${product.product_name} | Handcrafted Haven`,
    description: `${product.product_name} by ${product.product_seller} - $${
      product.price
    } - ${product.condition || "Used"}`,
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>; 
}) {
  const { id } = await params; 
  const productId = parseInt(id);

  if (isNaN(productId)) {
    notFound();
  }

  const product = await fetchProduct(productId);
  const reviews = await fetchProductReviews(productId);

  if (!product) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="product-details-container">
      <div className="product-details-wrapper">
        <Link href="/products" className="back-button">
          <svg
            className="back-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </Link>

        <div className="product-details-card">
          <div className="product-layout">
            <div className="product-image-section">
              <div className="product-image-container">
                <Image
                  src={product.product_image}
                  alt={product.product_name}
                  fill
                  className="product-main-image"
                  priority
                />
              </div>
            </div>
            <div className="product-info-section">
              <div className="product-header">
                <h1 className="product-title">{product.product_name}</h1>
                <p className="product-price-large">${product.price}</p>
                {product.category && (
                  <p className="product-category">{product.category}</p>
                )}
              </div>
              <div className="seller-section">
                <h3 className="seller-heading">Sold by</h3>
                <div className="seller-info">
                  <div className="seller-avatar-container">
                    <Image
                      src={product.seller_image}
                      alt={product.product_seller}
                      fill
                      className="seller-avatar"
                    />
                  </div>
                  <div className="seller-details">
                    <p className="seller-name">{product.product_seller}</p>
                    <p className="listing-date">
                      Listed on {formatDate(product.created_at)}
                    </p>
                    {product.location && (
                      <p className="seller-location">📍 {product.location}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="product-info-table">
                <h3 className="info-heading">Product Information</h3>
                <div className="info-list">
                  <div className="info-row">
                    <span className="info-label">Product ID:</span>
                    <span className="info-value">#{product.id}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Condition:</span>
                    <span className="info-value">
                      {product.condition || "Used - Good"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Category:</span>
                    <span className="info-value">
                      {product.category || "General"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Listed:</span>
                    <span className="info-value">
                      {formatDate(product.created_at)}
                    </span>
                  </div>
                  {product.location && (
                    <div className="info-row">
                      <span className="info-label">Location:</span>
                      <span className="info-value">{product.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <ClientProductActions
            productId={product.id}
            productSellerName={product.product_seller}
          />
        </div>

        <div className="description-section">
          <h2 className="description-title">Description</h2>
          <div className="description-content">
            <p className="description-text">{product.description}</p>
            <p className="description-text">
              All items are sold as-is. Please contact the seller for any
              specific questions about condition, measurements, or additional
              details before making your purchase decision.
            </p>
          </div>
        </div>

        <div className="reviews-section">
          <h2 className="reviews-title">Customer Reviews</h2>
          {reviews.length === 0 ? (
            <p className="no-reviews-message">No reviews yet. Be the first to review this product!</p>
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <span className="review-author">{review.user_first_name}</span>
                    <span className="review-rating">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <span className="review-date">{formatDate(review.created_at)}</span>
                </div>
              ))}
            </div>
          )}

          <h3 className="review-form-heading">Leave a Review</h3>
          <ClientReviewFormWrapper productId={productId} />
        </div>

      </div>
    </div>
  );
}