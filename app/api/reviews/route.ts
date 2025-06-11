import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const { productId, userFirstName, rating, comment } = await request.json();

    // Server-side validation (existing code)
    if (
      typeof productId !== "number" ||
      isNaN(productId) ||
      productId <= 0 ||
      typeof userFirstName !== "string" ||
      userFirstName.trim() === "" ||
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5 ||
      typeof comment !== "string" ||
      comment.trim() === ""
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid review data provided. Please check all fields." },
        { status: 400 }
      );
    }

    const existingReviews = await sql`
      SELECT id
      FROM product_reviews
      WHERE product_id = ${productId} AND user_first_name = ${userFirstName}
    `;

    if (existingReviews.length > 0) {
      // If a review already exists, return an error
      return NextResponse.json(
        { success: false, message: "You have already submitted a review for this product." },
        { status: 409 } 
      );
    }
    

    // Insert the review into the product_reviews table
    await sql`
      INSERT INTO product_reviews (product_id, user_first_name, rating, comment, created_at)
      VALUES (${productId}, ${userFirstName}, ${rating}, ${comment}, NOW())
    `;

    return NextResponse.json(
      { success: true, message: "Review added successfully!" },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Failed to add review." },
      { status: 500 }
    );
  }
}