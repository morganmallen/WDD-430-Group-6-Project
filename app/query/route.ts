import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
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
      ORDER BY created_at DESC
    `;

    return Response.json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch products', 
        details: error 
      }, 
      { status: 500 }
    );
  }
}