import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

// Handle DELETE request
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params; 
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID." },
        { status: 400 }
      );
    }

    const deleteResult = await sql`
      DELETE FROM products
      WHERE id = ${productId}
      RETURNING id;
    `;

    if (deleteResult.length === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Product deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting product with ID ${JSON.stringify(params)}:`, error); // Stringify params for logging as it's now a Promise
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}


// Handle PUT request for updating a product
export async function PUT(
  request: Request, { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID." },
        { status: 400 }
      );
    }

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

    // validation for required fields
    if (
      !product_name ||
      !product_image ||
      !product_seller ||
      !seller_image ||
      !price
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields for update." },
        { status: 400 }
      );
    }

    // Ensuring price is a valid number
    if (isNaN(price) || price <= 0) {
      return NextResponse.json(
        { success: false, message: "Price must be a positive number." },
        { status: 400 }
      );
    }

    const updateResult = await sql`
      UPDATE products
      SET
        product_name = ${product_name},
        product_image = ${product_image},
        product_seller = ${product_seller},
        seller_image = ${seller_image},
        price = ${price},
        description = ${description || null},
        condition = ${condition || 'New'},
        category = ${category || 'Other'},
        location = ${location || null}
      WHERE id = ${productId}
      RETURNING id;
    `;

    if (updateResult.length === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found or no changes made." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Product updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error updating product with ID ${JSON.stringify(params)}:`, error); // Stringify params for logging
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}