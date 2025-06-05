import { neon } from "@neondatabase/serverless";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import "./ProductDetails.css";

const sql = neon(process.env.DATABASE_URL!);

type Product = {
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
};

async function fetchProduct(id: string): Promise<Product | null> {
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
      WHERE id = ${parseInt(id)}
    `;

    return (products[0] as Product) || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProduct(id);

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
  const product = await fetchProduct(id);

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
      </div>
    </div>
  );
}
