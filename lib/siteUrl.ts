/**
 * Single source of truth for the site's public base URL.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_APP_URL   (set this in Vercel)
 *   2. NEXT_PUBLIC_SITE_URL  (legacy / local dev)
 *   3. Production fallback    (the real domain)
 *
 * Set NEXT_PUBLIC_APP_URL in Vercel:
 *   - now:            https://laraspinnal.vercel.app
 *   - after purchase: https://laraspinnal.com
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://laraspinnal.com"
).replace(/\/$/, "");
