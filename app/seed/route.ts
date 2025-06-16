import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function seedItems() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        organization VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        seller_image VARCHAR(500) DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      )
    `;

    // Create 'products' table if it does not exist.
    await sql`
      CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          product_name VARCHAR(255) NOT NULL,
          product_image VARCHAR(500) NOT NULL,
          product_seller VARCHAR(255) NOT NULL,
          seller_image VARCHAR(500) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          description TEXT,
          condition VARCHAR(50),
          category VARCHAR(100),
          location VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create 'product_reviews' table if it does not exist.
    await sql`
      CREATE TABLE IF NOT EXISTS product_reviews (
          id SERIAL PRIMARY KEY,
          product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          user_first_name VARCHAR(255) NOT NULL,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Insert sample products into the 'products' table.
    await sql`
      INSERT INTO products (product_name, product_image, product_seller, seller_image, price, description, condition, category, location) VALUES
        ('MacBook Pro 2021', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 'Mike Rodriguez', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 1299.00, 'MacBook Pro 13-inch with M1 chip, 8GB RAM, 256GB SSD. Barely used, purchased for college but switching to PC. Includes original charger and box. Battery cycle count under 50. Perfect for students or professionals.', 'Used - Like New', 'Electronics', 'Austin, TX'),
        ('Acoustic Guitar', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400', 'Emma Thompson', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 325.50, 'Beautiful Yamaha FG830 acoustic guitar. Rich, warm tone perfect for beginners and intermediate players. Comes with a padded gig bag and extra strings. Well-maintained with no major dings or scratches.', 'Used - Good', 'Musical Instruments', 'Nashville, TN'),
        ('Mountain Bike', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'Jake Wilson', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 450.00, 'Trek X-Caliber 7 mountain bike, size Large. Great for trail riding and commuting. Recently serviced with new brake pads and chain. Some wear on the frame but mechanically sound. Ready for your next adventure!', 'Used - Good', 'Sports & Recreation', 'Denver, CO'),
        ('Nike Air Jordan 1', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'Alex Kim', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 175.99, 'Classic Air Jordan 1 High in Bred colorway, size 10.5. Worn a few times but still in great condition. No box included. Perfect for sneaker enthusiasts or casual wear. Authentic with all original details intact.', 'Used - Very Good', 'Fashion & Clothing', 'Los Angeles, CA'),
        ('Vintage Camera', 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400', 'Lisa Johnson', 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150', 89.99, 'Canon AE-1 35mm film camera from the 1970s. Fully functional with light meter working perfectly. Great for photography students or film enthusiasts. Includes 50mm lens and leather strap. A true classic!', 'Used - Good', 'Electronics', 'Portland, OR'),
        ('Dining Table Set', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', 'David Park', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 599.00, 'Solid oak dining table with 4 matching chairs. Seats 6 comfortably when extended. Minor scratches from normal use but very sturdy construction. Perfect for family dinners or entertaining guests. Must pick up due to size.', 'Used - Good', 'Home & Garden', 'Chicago, IL'),
        ('Gaming Chair', 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400', 'Zoe Martinez', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150', 249.99, 'Herman Miller Aeron gaming chair, size B (medium). Excellent ergonomic support for long gaming or work sessions. All adjustments work perfectly. Slight wear on armrests but otherwise in great condition.', 'Used - Very Good', 'Home & Garden', 'Seattle, WA'),
        ('Artisan Coffee Maker', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400', 'Tom Anderson', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', 125.00, 'Chemex 6-cup pour-over coffee maker with wooden collar. Perfect for brewing smooth, clean coffee. Used only a handful of times. Includes box and instruction booklet. Great for coffee connoisseurs who appreciate the ritual.', 'Used - Like New', 'Home & Garden', 'Portland, OR'),
        ('Designer Handbag', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 'Grace Liu', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150', 399.99, 'Authentic Michael Kors medium-sized tote bag in black leather. Gently used with minimal signs of wear. Interior is clean with all pockets intact. Comes with dust bag and authenticity card. Perfect for work or everyday use.', 'Used - Very Good', 'Fashion & Clothing', 'New York, NY'),
        ('Wireless Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 'Ryan Cooper', 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150', 79.99, 'Sony WH-1000XM3 noise-canceling headphones. Excellent sound quality and battery life. Light scuffs on the headband but all functions work perfectly. Includes charging cable and carrying case.', 'Used - Good', 'Electronics', 'Boston, MA'),
        ('Yoga Mat Set', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', 'Maya Patel', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 34.99, 'Premium yoga mat with alignment lines, yoga blocks, and strap. Eco-friendly TPE material, non-slip surface. Used for about 6 months. Perfect for home practice or taking to classes. Excellent grip and cushioning.', 'Used - Good', 'Sports & Recreation', 'San Diego, CA'),
        ('Electric Skateboard', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400', 'Carlos Mendez', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 649.00, 'Boosted Board Mini X electric skateboard. Top speed 20mph, range up to 14 miles. Great for commuting or recreational riding. Battery still holds excellent charge. Minor deck wear but mechanically perfect. Includes remote and charger.', 'Used - Very Good', 'Sports & Recreation', 'Miami, FL'),
        ('Kitchen Knife Set', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', 'Sophie Brown', 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150', 89.95, 'Wusthof Classic 7-piece knife set with wooden block. High-carbon stainless steel blades, razor sharp. Barely used, kept in excellent condition. Perfect for home chefs who appreciate quality cutlery.', 'Used - Like New', 'Home & Garden', 'Charlotte, NC'),
        ('Succulent Plant Collection', 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400', 'Oliver Green', 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150', 24.99, 'Collection of 6 healthy succulent plants in terracotta pots. Includes Echeveria, Jade plant, and other popular varieties. Perfect for beginners or anyone wanting to add greenery to their space. Easy to care for and drought-tolerant.', 'New', 'Home & Garden', 'Phoenix, AZ'),
        ('Vintage Leather Jacket', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 'Sarah Chen', 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150', 189.99, 'Authentic vintage leather jacket from the 1980s. Soft, supple leather with a classic biker style. Perfect for anyone looking to add some edge to their wardrobe. Minor scuffs that add to the authentic vintage character.', 'Used - Excellent', 'Fashion & Clothing', 'San Francisco, CA'),
        ('Standing Desk', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400', 'Nina Foster', 'https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=150', 349.00, 'UPLIFT V2 standing desk, 48x30 inches. Electric height adjustment from 25.5" to 51.1". Bamboo desktop in excellent condition. Great for improving posture and productivity. Includes all hardware and instructions.', 'Used - Excellent', 'Home & Garden', 'San Jose, CA'),
        ('Vintage Vinyl Records', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'Ben Taylor', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=150', 45.50, 'Collection of 12 classic rock vinyl records from the 70s and 80s. Includes Led Zeppelin, Pink Floyd, and The Beatles. Good to very good condition with minimal surface wear. Perfect for vinyl collectors or music lovers.', 'Used - Good', 'Entertainment', 'Philadelphia, PA'),
        ('Smart Watch', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'Chloe Davis', 'https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=150', 199.99, 'Apple Watch Series 6, 44mm Space Gray with Sport Band. GPS + Cellular model. Excellent battery life and all health features working perfectly. Light scratches on screen but barely noticeable. Includes charger and box.', 'Used - Good', 'Electronics', 'Atlanta, GA'),
        ('Board Game Collection', 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400', 'Max Rivera', 'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150', 129.99, 'Collection of 8 popular board games including Catan, Ticket to Ride, and Splendor. All games complete with original pieces and instructions. Perfect for game nights with family and friends. Stored in smoke-free home.', 'Used - Excellent', 'Entertainment', 'Minneapolis, MN'),
        ('Ceramic Vase Set', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 'Aria Walsh', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 65.00, 'Set of 3 handcrafted ceramic vases in different sizes. Beautiful matte finish in neutral tones. Perfect for fresh or dried flowers. Excellent condition with no chips or cracks. Adds elegant touch to any home decor.', 'Used - Like New', 'Home & Garden', 'Richmond, VA')
      ON CONFLICT DO NOTHING
    `;

    const result = await sql`SELECT COUNT(*) FROM products`;

    return {
      success: true,
      message:
        "Database seeded successfully with marketplace products and ensured review table exists!",
      totalItems: result[0].count,
    };
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

export async function GET() {
  try {
    const result = await seedItems();
    return Response.json(result);
  } catch (error) {
    console.error("Seeding failed:", error);
    return Response.json(
      { error: "Failed to seed database", details: error },
      { status: 500 }
    );
  }
}
