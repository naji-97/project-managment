import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import {getSessionCookie} from "better-auth/cookies";

export function middleware(request: NextRequest) {
    // Debug: Check all available cookies
    const allCookies = request.cookies.getAll();
    console.log("=== ALL COOKIES ===");
    allCookies.forEach(cookie => {
        console.log(`Cookie: "${cookie.name}, Value: ${cookie.value}"`);
    });

    // Try multiple cookie names for different environments
    const sessionCookie = 
        request.cookies.get('__Secure-auth-session')?.value || // Production with secure prefix
        request.cookies.get('auth-session')?.value;           // Development or production fallback

    console.log("Session cookie found:", !!sessionCookie);
    
    const { pathname } = request.nextUrl;
    const publicRoutes = ['/login', '/register', "/forgot-password",'/reset-password', '/api/auth'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    console.log(`Path: ${pathname}, Has Session: ${!!sessionCookie}, Is Public: ${isPublicRoute}`);

    // CASE 1: No session AND trying to access non-public route → REDIRECT TO LOGIN
    if (!sessionCookie && !isPublicRoute) {
        console.log(`🚫 Blocked: No session for ${pathname}, redirecting to login`);
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }
    
    // CASE 2: Has session AND trying to access public auth routes → REDIRECT TO HOME
    else if (sessionCookie && isPublicRoute) {
        console.log(`🔄 Redirect: Authenticated user trying to access ${pathname}, going to home`);
        return NextResponse.redirect(new URL('/', request.url));
    }

    // CASE 3: Allow all other scenarios
    console.log(`✅ Allowing access to ${pathname}`);
    return NextResponse.next();
}