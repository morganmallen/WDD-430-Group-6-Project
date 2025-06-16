import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken || authToken.value !== "authenticated") {
      return NextResponse.json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Get the user's email from the session cookie
    const userEmail = cookieStore.get("user-email")?.value;
    if (!userEmail) {
      return NextResponse.json({
        success: false,
        message: "No user email found",
      });
    }

    // Fetch user details from database
    const users = await sql`SELECT name FROM users WHERE email = ${userEmail}`;
    if (users.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    return NextResponse.json({
      success: true,
      name: users[0].name,
    });
  } catch (error) {
    console.error("Error checking auth status:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
