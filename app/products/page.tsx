// app/products/page.tsx
import ProductCard from '../components/ProductCard';
import { neon } from '@neondatabase/serverless';
import { SearchBar } from '../components/SearchBar';
import React, { Suspense } from 'react'; // Import Suspense

// Force this page to be dynamically rendered on each request (SSR).
// This is necessary because it uses `searchParams` which varies per request,
// and because the `fetchProducts` function uses `await params`.
export const dynamic = 'force-dynamic';

interface ProductsPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams?: any;
}

export const metadata = {
  title: "Products | Handcrafted Haven",
};

const sql = neon(process.env.DATABASE_URL!);

type DatabaseProduct = {
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
};

// Fetches products from the database based on search parameters.
async function fetchProducts(
  params: ProductsPageProps['searchParams']
): Promise<DatabaseProduct[]> {
  try {
    const awaitedParams = await params || {}; 

    const resolvedParams = awaitedParams as {
      minPrice?: string;
      maxPrice?: string;
      category?: string;
      searchTerm?: string;
      condition?: string;
    };

    const minPrice = parseFloat(resolvedParams.minPrice || '0');
    const maxPrice = parseFloat(resolvedParams.maxPrice || '999999');
    const category = resolvedParams.category;
    const searchTerm = resolvedParams.searchTerm;
    const condition = resolvedParams.condition;

    let query = `
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
      WHERE price >= $1 AND price <= $2
    `;
    const queryParams: (string | number)[] = [minPrice, maxPrice];

    if (category && category !== 'All') {
      queryParams.push(category);
      query += ` AND category = $${queryParams.length}`;
    }

    if (searchTerm) {
      const searchWildcard = `%${searchTerm.toLowerCase()}%`;
      queryParams.push(searchWildcard);
      query += ` AND (LOWER(product_name) LIKE $${queryParams.length} OR LOWER(description) LIKE $${queryParams.length} OR LOWER(product_seller) LIKE $${queryParams.length})`;
    }

    if (condition && condition !== 'All') {
        queryParams.push(condition);
        query += ` AND condition = $${queryParams.length}`;
    }

    query += ` ORDER BY created_at DESC;`;

    const productsArray = await sql.query(query, queryParams) as DatabaseProduct[];
    
    if (Array.isArray(productsArray)) {
        return productsArray;
    } else {
        console.error("SQL query returned unexpected non-array type:", productsArray);
        return [];
    }

  } catch (error) {
    console.error('Error fetching products in fetchProducts:', error);
    return [];
  }
}

// Renders the Products page, fetching and displaying products based on URL search parameters.
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const products = (await fetchProducts(searchParams)) || [];

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
    padding: "30px",
    backgroundColor: "#f9f9f9",
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Available Products</h1>
      {/* Wrap SearchBar in Suspense to resolve the missing-suspense-with-csr-bailout error */}
      <Suspense fallback={<div>Loading search bar...</div>}>
        <SearchBar />
      </Suspense>
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <p>No products found based on your current filters or search term.</p>
          <p>Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}