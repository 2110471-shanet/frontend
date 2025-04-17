import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const cookie = request.cookies.get("token");
    if (request.nextUrl.pathname.startsWith("/_next") || request.nextUrl.pathname.startsWith("/favicon.ico") || request.nextUrl.pathname === "/") {
        return;
    }
    if (cookie && (request.nextUrl.pathname.startsWith("/signin") || request.nextUrl.pathname.startsWith("/signup"))) {
        return NextResponse.redirect(new URL("/chat", request.url));
    }
    if (!cookie && !(request.nextUrl.pathname.startsWith("/signin") || request.nextUrl.pathname.startsWith("/signup"))) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }
}