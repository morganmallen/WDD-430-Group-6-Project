import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

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
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current password and new password are required" },
        { status: 400 }
      );
    }

    // Get the user's current password hash
    const result = await sql`
      SELECT password 
      FROM users 
      WHERE email = ${userEmail.value}
    `;

    if (result.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { password } = result[0];

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    await sql`
      UPDATE users 
      SET password = ${hashedPassword} 
      WHERE email = ${userEmail.value}
    `;

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
