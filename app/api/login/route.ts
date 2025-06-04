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

  // Set the cookie
  const response = NextResponse.json({ success: true, name: user.name });
  response.cookies.set("auth-token", "authenticated", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
  return response;
}