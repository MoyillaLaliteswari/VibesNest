import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isPublicPath =
        path === '/login' ||
        path === '/signup' ||
        path === '/verifyemail' ||
        path === '/resetPassword'; 

    const token = request.cookies.get('token')?.value || '';

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
}

export const config = {
    matcher: [
        '/',
        '/profile',
        '/login',
        '/signup',
        '/verifyemail',
        '/resetPassword', 
        '/addPost',
        '/posts/:path',
        '/myPosts',
        '/posts',
        '/profile:path',
        '/userPosts'
    ],
};
