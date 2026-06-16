import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isAdminRoute = pathname.startsWith("/admin");
  const isUserRoute =
    pathname.startsWith("/minha-conta") || pathname.startsWith("/meu-caderno");

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/entrar?callbackUrl=/admin", req.url));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (isUserRoute && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/entrar?callbackUrl=${pathname}`, req.url),
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/minha-conta", "/meu-caderno"],
};
