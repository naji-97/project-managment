import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/api/') || 
      pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp|ico)$/)) {
    return NextResponse.next();
  }

  try {
    const API_BASE_URL = process.env.NODE_ENV === 'production' 
      ? 'https://your-backend.onrender.com' // Replace with your actual backend URL
      : 'http://localhost:8000';

    console.log('Checking session for path:', pathname);
    console.log('API_BASE_URL:', API_BASE_URL);

    // Use your existing session endpoint
    const response = await fetch(`${API_BASE_URL}/api/me`, {
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    let hasValidSession = false;
    let sessionData = null;

    if (response.ok) {
      try {
        // Parse the response body to get the actual data
        sessionData = await response.json();
        console.log('Session data:', sessionData);
        hasValidSession = !!sessionData?.user; // Check if user exists in response
      } catch (parseError) {
        console.error('Error parsing session response:', parseError);
      }
    }

    console.log('Session verified:', hasValidSession);
    
    if (!hasValidSession && !isPublicRoute) {
      console.log(`🚫 No valid session for ${pathname}, redirecting to login`);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    if (hasValidSession && isPublicRoute) {
      console.log(`🔄 Redirecting authenticated user from ${pathname} to home`);
      return NextResponse.redirect(new URL('/', request.url));
    }

    console.log(`✅ Allowing access to ${pathname}`);
    return NextResponse.next();

  } catch (error) {
    console.error('Session verification failed:', error);
    
    if (!isPublicRoute) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};