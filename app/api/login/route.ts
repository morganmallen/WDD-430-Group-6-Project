import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const users = await sql`SELECT * FROM users WHERE email = ${email}`;

  if (users.length === 0) {
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  }

  const user = users[0];
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  }

  // cookie expiration date 1 hour
  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);

  
  // The client-side LoginForm will read 'data.name' from this response.
  const response = NextResponse.json({ success: true, name: user.name });

  console.log("User logged in. Attempting to set auth-token cookie.");
  console.log("Auth-token will expire at (approx):", oneHourFromNow.toISOString());

  // This sets the authentication token cookie.
  response.cookies.set("auth-token", "authenticated", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === 'production', // Uncomment for production
    expires: oneHourFromNow,
  });

  return response;
}