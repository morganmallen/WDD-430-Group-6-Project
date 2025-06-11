// app/api/products/route.ts
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

    // --- Server-side Validation ---
    // Basic checks for required fields
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
        { status: 400 } // Bad Request
      );
    }

    // Optional: More specific validation for image URL format
    if (!product_image.startsWith('http://') && !product_image.startsWith('https://')) {
        return NextResponse.json(
            { success: false, message: "Product image must be a valid URL (http or https)." },
            { status: 400 }
        );
    }

    // --- Insert the new product into the 'products' table and RETURNING the id ---
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
    NOW() -- <<< CHANGE THIS FROM NOW TO NOW()
  )
  RETURNING id;
`;
    // Extract the new product ID from the result
    const newProductId = result[0]?.id;

    if (!newProductId) {
        // This check helps catch issues if RETURNING id somehow fails
        throw new Error("Failed to retrieve new product ID after insertion.");
    }

    // Return a success response
    return NextResponse.json(
      {
        success: true,
        message: "Product listed successfully!",
        productId: newProductId, // <<< NOW YOU'RE RETURNING THE ID
      },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error("Error adding new product:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Failed to list product." },
      { status: 500 }
    );
  }
}