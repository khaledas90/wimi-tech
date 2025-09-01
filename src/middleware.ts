import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenAdmin = request.cookies.get('token_admin')?.value;
  const tokenuser = request.cookies.get('token')?.value;

  if (!tokenAdmin && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/trade/login_trade', request.url));
  }
  if (tokenAdmin && pathname === '/trade/register') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  if (tokenuser && pathname === '/register' || tokenuser && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if(!tokenuser &&pathname.startsWith('/payment')){
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if ( tokenAdmin && pathname === '/trade/login_trade') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/trade/register',
    '/register',
    '/login',
    '/trade/login_trade',
    '/payment'
  ],
};
