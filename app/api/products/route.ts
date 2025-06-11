import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const {
      product_name,
      product_image,
      product_seller,
      seller_image,
      price,
      description,
      condition,
      category,
      location,
    } = await request.json();

    if (
      !product_name ||
      !product_image ||
      !product_seller ||
      !seller_image ||
      typeof price !== 'number' || price <= 0 ||
      !description ||
      !condition ||
      !category ||
      product_name.trim() === '' ||
      product_image.trim() === '' ||
      product_seller.trim() === '' ||
      seller_image.trim() === '' ||
      description.trim() === '' ||
      condition.trim() === '' ||
      category.trim() === ''
    ) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid required product fields." },
        { status: 400 }
      );
    }

    if (!product_image.startsWith('http://') && !product_image.startsWith('https://')) {
        return NextResponse.json(
            { success: false, message: "Product image must be a valid URL (http or https)." },
            { status: 400 }
        );
    }

    const result = await sql`
      INSERT INTO products (
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
      )
      VALUES (
        ${product_name},
        ${product_image},
        ${product_seller},
        ${seller_image},
        ${price},
        ${description},
        ${condition},
        ${category},
        ${location || null},
        NOW()
      )
      RETURNING id;
    `;
    const newProductId = result[0]?.id;

    if (!newProductId) {
        throw new Error("Failed to retrieve new product ID after insertion.");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product listed successfully!",
        productId: newProductId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding new product:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Failed to list product." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const category = searchParams.get('category');
    const searchTerm = searchParams.get('searchTerm');
    const condition = searchParams.get('condition');

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
    let queryParams: (string | number)[] = [minPrice, maxPrice];

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

    const products: any = await sql.query(query, queryParams);

    return NextResponse.json(products.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Failed to fetch products." },
      { status: 500 }
    );
  }
}