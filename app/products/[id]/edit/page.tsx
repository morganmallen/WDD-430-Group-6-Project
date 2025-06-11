import { neon } from "@neondatabase/serverless";
import { notFound } from "next/navigation";
import ClientEditProductForm from "../../../components/ClientEditProductForm";

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

const sql = neon(process.env.DATABASE_URL!);

// Function to fetch a single product 
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
    console.error("Error fetching product for edit:", error);
    return null;
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
    return { title: "Product Not Found | Handcrafted Haven" };
  }

  const product = await fetchProduct(productId);

  if (!product) {
    return { title: "Edit Product Not Found | Handcrafted Haven" };
  }

  return {
    title: `Edit ${product.product_name} | Handcrafted Haven`,
    description: `Edit listing for ${product.product_name} by ${product.product_seller}`,
  };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; 
  const productId = parseInt(id);

  if (isNaN(productId)) {
    notFound(); // If the ID is not a number, show 404
  }

  const product = await fetchProduct(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="edit-product-page-wrapper">
      <h1 className="sell-product-title">Edit Product: {product.product_name}</h1>
      <ClientEditProductForm initialProductData={product} />
    </div>
  );
}