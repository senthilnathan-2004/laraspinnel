import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT = 100;
const WINDOW_MS = 60 * 1000;

export default withAuth(
  function middleware(request) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
      const now = Date.now();
      
      if (Math.random() < 0.01) {
         for (const [key, value] of rateLimitMap.entries()) {
             if (value.resetTime < now) {
                 rateLimitMap.delete(key);
             }
         }
      }

      let rateData = rateLimitMap.get(ip);
      
      if (!rateData || rateData.resetTime < now) {
        rateData = { count: 1, resetTime: now + WINDOW_MS };
      } else {
        rateData.count++;
      }
      
      rateLimitMap.set(ip, rateData);

      if (rateData.count > RATE_LIMIT) {
        return new NextResponse('Too Many Requests', { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateData.resetTime - now) / 1000).toString(),
          }
        });
      }
    }

    const response = NextResponse.next();
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    return response;
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Protect all /admin paths EXCEPT /admin/login
        if (req.nextUrl.pathname.startsWith("/admin") && !req.nextUrl.pathname.startsWith("/admin/login")) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/((?!login).*)",
    "/api/:path*"
  ],
};
