import ProductCard from "../components/ProductCard";
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

type DatabaseProduct = {
  id: number;
  product_name: string;
  product_image: string;
  product_seller: string;
  seller_image: string;
  price: number;
  created_at: string;
};

async function fetchProducts(): Promise<DatabaseProduct[]> {
  try {
    const products = await sql`
      SELECT 
        id,
        product_name,
        product_image,
        product_seller,
        seller_image,
        price,
        created_at
      FROM products 
      ORDER BY created_at DESC
    `;
    
    return products as DatabaseProduct[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <div style={gridStyle}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: "20px",
  padding: "30px",
  backgroundColor: "#f9f9f9",
};