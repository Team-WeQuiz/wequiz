import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)'],
};

const protectedRoutes = ['/main-lobby', '/create-room', '/waiting-room'];
const publicRoutes = ['/sign-in', '/sign-up'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('refreshToken');
  const currentPath = request.nextUrl.pathname;
  console.log(token);

  if (!token && protectedRoutes.includes(currentPath)) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    url.searchParams.set('message', '로그인이 필요한 페이지입니다.');
    return NextResponse.redirect(url);
  }

  if (token && publicRoutes.includes(currentPath)) {
    const url = request.nextUrl.clone();
    url.pathname = '/main-lobby';
    url.searchParams.set('message', '이미 로그인된 상태입니다.');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
