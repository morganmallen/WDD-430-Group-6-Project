import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear the auth cookies
  response.cookies.delete("auth-token");
  response.cookies.delete("user-email");

  return response;
}
