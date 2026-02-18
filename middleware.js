import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req });
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Allow public routes
  const publicRoutes = ["/login", "/register"];

  // Redirect unauthenticated users to login page
  if (!token) {
    if (!publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  const userRole = token.role;

  // Role-based route protection
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    // If a non-admin tries to access admin page
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname.startsWith("/dashboard") && userRole !== "user") {
    // If a non-user (admin) tries to access dashboard
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

// Apply to relevant routes
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register"],
};
