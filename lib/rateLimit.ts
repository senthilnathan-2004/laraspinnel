interface RateLimitRecord {
  timestamps: number[];
}

const cache = new Map<string, RateLimitRecord>();

// Clean up cache every 5 minutes to prevent memory leaks
if (typeof global !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of cache.entries()) {
      // Filter out timestamps older than 1 hour
      const filtered = record.timestamps.filter((ts) => now - ts < 60 * 60 * 1000);
      if (filtered.length === 0) {
        cache.delete(ip);
      } else {
        record.timestamps = filtered;
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Checks rate limits for a given IP address.
 * Defaults: Max 5 requests per 1 minute window.
 */
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

  // Filter timestamps within the current window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    return { success: false, count: record.timestamps.length };
  }

  // Add current timestamp
  record.timestamps.push(now);
  return { success: true, count: record.timestamps.length };
}
