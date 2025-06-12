import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ seller: string }> }
) {
  try {
    const { seller } = await params;

    const products = await sql`
      SELECT *
      FROM products
      WHERE product_seller = ${seller}
      ORDER BY created_at DESC;
    `;

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching seller products:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Failed to fetch seller products." },
      { status: 500 }
    );
  }
}