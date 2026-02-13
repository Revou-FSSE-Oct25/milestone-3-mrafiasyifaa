import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { users } from '@/src/config/users';
import { protectedRoutes } from '@/src/config/protectedRoutes';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.path)
  );

  if (protectedRoute) {
    const authCookie = request.cookies.get('auth_session');

    if (!authCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const user = JSON.parse(authCookie.value);

      const validUser = users.find(
        (u) => u.id === user.id && u.email === user.email
      );

      if (!validUser || !protectedRoute.allowedRoles.includes(validUser.role)) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('auth_session');
        return response;
      }

      return NextResponse.next();
    } catch (error) {
      const loginUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('auth_session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cart/:path*', '/admin/:path*'],
};