import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT = 100;
const WINDOW_MS = 60 * 1000;

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect admin paths EXCEPT /admin/login
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const url = new URL("/admin/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  // Rate limiting for API paths
  if (path.startsWith("/api/")) {
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
}

export const config = {
  matcher: [
    "/admin",
    "/admin/((?!login).*)",
    "/api/:path*"
  ],
};
