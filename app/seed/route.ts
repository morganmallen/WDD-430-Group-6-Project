// app/seed/route.ts
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function seedItems() {
  try {
    // Create items table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        item_name VARCHAR(255) NOT NULL,
        item_image VARCHAR(500) NOT NULL,
        item_seller VARCHAR(255) NOT NULL,
        seller_image VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Insert seed data
    await sql`
      INSERT INTO items (item_name, item_image, item_seller, seller_image) VALUES 
      ('Vintage Leather Jacket', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 'Sarah Chen', 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150'),
      ('MacBook Pro 2021', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 'Mike Rodriguez', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
      ('Acoustic Guitar', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400', 'Emma Thompson', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'),
      ('Mountain Bike', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'Jake Wilson', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
      ('Nike Air Jordan 1', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'Alex Kim', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'),
      ('Vintage Camera', 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400', 'Lisa Johnson', 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150'),
      ('Dining Table Set', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', 'David Park', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
      ('Gaming Chair', 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400', 'Zoe Martinez', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150'),
      ('Artisan Coffee Maker', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400', 'Tom Anderson', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'),
      ('Designer Handbag', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 'Grace Liu', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150'),
      ('Wireless Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 'Ryan Cooper', 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150'),
      ('Yoga Mat Set', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', 'Maya Patel', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
      ('Electric Skateboard', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400', 'Carlos Mendez', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'),
      ('Kitchen Knife Set', 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400', 'Sophie Brown', 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150'),
      ('Succulent Plant Collection', 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400', 'Oliver Green', 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150'),
      ('Standing Desk', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400', 'Nina Foster', 'https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=150'),
      ('Vintage Vinyl Records', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'Ben Taylor', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=150'),
      ('Smart Watch', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'Chloe Davis', 'https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=150'),
      ('Board Game Collection', 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400', 'Max Rivera', 'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150'),
      ('Ceramic Vase Set', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 'Aria Walsh', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150')
      ON CONFLICT DO NOTHING
    `;

    // Get count for response
    const result = await sql`SELECT COUNT(*) FROM items`;
    
    return {
      success: true,
      message: 'Database seeded successfully with marketplace items!',
      totalItems: result[0].count
    };
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const result = await seedItems();
    return Response.json(result);
  } catch (error) {
    console.error('Seeding failed:', error);
    return Response.json(
      { error: 'Failed to seed database', details: error }, 
      { status: 500 }
    );
  }
}