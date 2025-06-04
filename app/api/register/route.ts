import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  const { name, organization, email, password } = await request.json();

  // Basic validation
  if (!name || !organization || !email || !password) {
    return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ success: false, message: "Invalid email." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ success: false, message: "Password must be at least 6 characters." }, { status: 400 });
  }

  // Check if user already exists
  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length > 0) {
    return NextResponse.json({ success: false, message: "Email already registered." }, { status: 400 });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user
  await sql`
    INSERT INTO users (name, organization, email, password)
    VALUES (${name}, ${organization}, ${email}, ${hashedPassword})
  `;

  return NextResponse.json({ success: true });
}