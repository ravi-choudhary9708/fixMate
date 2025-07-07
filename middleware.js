// middleware.js
import { NextResponse } from "next/server";
import { verifyJWT } from "./utils/jwt";

export async function middleware(req) {
 

  // Agar cookie nahi, to header me check karo
 
   const token = req.cookies.get("fixmate_token")?.value;
   console.log("⛳ JWT_SECRET in middleware:", process.env.JWT_SECRET);

  
  console.log("token ka vlaue:",token)

  const { pathname } = req.nextUrl;

  console.log("✅ Middleware triggered for:", req.nextUrl.pathname);


  // ✅ Allow public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname === "/" ||
    pathname.startsWith("/unauthorized") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // 🔐 Block all protected routes if no token
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  let user;
  try {
    user = verifyJWT(token);
  } catch (err) {
    console.error("Invalid token in middleware");
    return NextResponse.redirect(new URL("/login", req.url));
  }

console.log("user bhai:",user)

  // ✅ Role-based routing
  if (pathname.startsWith("/dashboard/admin") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/dashboard/staff") && user.role !== "staff") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/dashboard/user") && user.role !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/ticket/new") && user.role !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // ✅ Allow all else (e.g., /ticket/[id] is shared)
  return NextResponse.next();
}

// ✅ Apply middleware to these routes only
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/ticket/:path*",
    "/ticket/new",
  ],
};
