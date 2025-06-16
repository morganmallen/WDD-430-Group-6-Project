import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST() {
  try {
    // Check if the column exists
    const columnCheck = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'seller_image'
    `;

    if (columnCheck.length === 0) {
      // Add the seller_image column if it doesn't exist
      await sql`
        ALTER TABLE users 
        ADD COLUMN seller_image VARCHAR(500) 
        DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      `;

      return NextResponse.json({
        success: true,
        message: "Successfully added seller_image column to users table",
      });
    }

    return NextResponse.json({
      success: true,
      message: "seller_image column already exists",
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to migrate database",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
