import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withauth` augment your `req` with the user's token.
  function middleware(req: NextRequestWithAuth) {
    if (
      req.nextUrl.pathname.startsWith("/admin/dashboard-admin") &&
      req.nextauth.token?.role !== "admin"
    ) {
      return NextResponse.rewrite(new URL("/admin/denied", req.url));
    }
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: "/auth/sign-in",
      newUser: "/auth/sign-up",
    },
    callbacks: {
      // authorized: ({ token }) => token?.role === "admin",
      authorized: ({ token }) => !!token,
    },
    // Matches the pages config in `auth.ts => authOptions`
  }
);

// If you only want to secure certain pages, export a config object with a matcher
// export const config = { matcher: ["/protected", "/admin"] };
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|auth|favicon.ico).*)",
  ],
};
