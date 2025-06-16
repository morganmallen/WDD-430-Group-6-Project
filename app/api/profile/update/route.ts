import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function PUT(request: Request) {
  try {
    // Get the auth cookies
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");
    const userEmail = cookieStore.get("user-email");

    if (!authToken || authToken.value !== "authenticated" || !userEmail) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get the request body
    const { seller_image } = await request.json();

    if (!seller_image) {
      return NextResponse.json(
        { message: "Seller image URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    if (
      !seller_image.startsWith("http://") &&
      !seller_image.startsWith("https://")
    ) {
      return NextResponse.json(
        { message: "Seller image must be a valid URL (http or https)" },
        { status: 400 }
      );
    }

    // Update the user's seller image
    await sql`
      UPDATE users 
      SET seller_image = ${seller_image}
      WHERE email = ${userEmail.value}
    `;

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        seller_image,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
