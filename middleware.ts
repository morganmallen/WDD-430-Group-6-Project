import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const auth = request.cookies.get("auth-token")?.value;

  // Protect /browse and /sellers routes
  if (
    (request.nextUrl.pathname.startsWith("/browse") ||
      request.nextUrl.pathname.startsWith("/sellers")) &&
    auth !== "authenticated"
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/browse/:path*", "/sellers/:path*"],
};