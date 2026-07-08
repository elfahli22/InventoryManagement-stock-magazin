import { config } from "@/config";

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + config.rateLimit.window,
    });
    return {
      allowed: true,
      remaining: config.rateLimit.max - 1,
      resetTime: now + config.rateLimit.window,
    };
  }

  if (record.count >= config.rateLimit.max) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: config.rateLimit.max - record.count,
    resetTime: record.resetTime,
  };
}

export function getRateLimitHeaders(
  result: { allowed: boolean; remaining: number; resetTime: number },
): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(config.rateLimit.max),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetTime / 1000)),
  };
}
