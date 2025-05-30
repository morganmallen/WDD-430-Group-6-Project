import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const items = await sql`
      SELECT 
        id,
        item_name,
        item_image,
        item_seller,
        seller_image,
        created_at
      FROM items 
      ORDER BY created_at DESC
    `;

    return Response.json({
      success: true,
      items: items
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch items', 
        details: error 
      }, 
      { status: 500 }
    );
  }
}