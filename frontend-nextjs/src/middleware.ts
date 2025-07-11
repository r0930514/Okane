import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 需要認證的路由
const protectedRoutes = ['/dashboard', '/wallets', '/transactions', '/settings'];

// 認證相關路由（已登入用戶不應訪問）
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    // 檢查是否為受保護的路由
    const isProtectedRoute = protectedRoutes.some(route => 
        pathname.startsWith(route)
    );

    // 檢查是否為認證路由
    const isAuthRoute = authRoutes.some(route => 
        pathname.startsWith(route)
    );

    // 如果訪問受保護路由但沒有 token，重定向到登入頁
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 如果已登入用戶訪問認證頁面，重定向到儀表板
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)',
    ],
};