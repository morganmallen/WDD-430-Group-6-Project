import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Debug log
  console.log("Middleware processing:", request.nextUrl.pathname);

  // Skip middleware for auth-related routes
  if (
    request.nextUrl.pathname.startsWith("/api/auth") ||
    request.nextUrl.pathname.startsWith("/api/login") ||
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register"
  ) {
    console.log(
      "Skipping middleware for auth route:",
      request.nextUrl.pathname
    );
    return NextResponse.next();
  }

  const auth = request.cookies.get("auth-token")?.value;
  console.log("Auth token present:", !!auth); // Debug log

  // Protect /browse and /sellers routes
  if (
    (request.nextUrl.pathname.startsWith("/browse") ||
      request.nextUrl.pathname.startsWith("/sellers")) &&
    auth !== "authenticated"
  ) {
    console.log(
      "Redirecting to login for protected route:",
      request.nextUrl.pathname
    );
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
