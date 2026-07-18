import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only initialize if we have the environment variables
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? Redis.fromEnv()
  : null;

// Create a new ratelimiter that allows 1 request per 24 hours
// If Redis isn't configured, we provide a mock that always allows
export const formRateLimit = redis 
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(1, "24 h"),
      analytics: true,
      ephemeralCache: new Map(),
    })
  : {
      limit: async () => ({ success: true, remaining: 1 }),
    };

// Keep the old memory rate limit as a fallback/utility
interface RateLimitRecord {
  timestamps: number[];
}

const cache = new Map<string, RateLimitRecord>();

if (typeof global !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of cache.entries()) {
      const filtered = record.timestamps.filter((ts) => now - ts < 60 * 60 * 1000);
      if (filtered.length === 0) {
        cache.delete(ip);
      } else {
        record.timestamps = filtered;
      }
    }
  }, 5 * 60 * 1000);
}

export function rateLimit(
  ip: string,
  limit = 5,
  windowMs = 60 * 1000
): { success: boolean; count: number } {
  const now = Date.now();
  let record = cache.get(ip);

  if (!record) {
    record = { timestamps: [] };
    cache.set(ip, record);
  }

  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    return { success: false, count: record.timestamps.length };
  }

  record.timestamps.push(now);
  return { success: true, count: record.timestamps.length };
}
