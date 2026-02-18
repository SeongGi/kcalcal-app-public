// Simple in-memory rate limiter for IP-based request limiting
// For production, consider using Vercel KV or Redis

interface RateLimitRecord {
    count: number;
    resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up old records every hour
setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitStore.entries()) {
        if (now > record.resetAt) {
            rateLimitStore.delete(ip);
        }
    }
}, 60 * 60 * 1000);

export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    resetAt: number;
}

/**
 * Check if the IP has exceeded the daily rate limit
 * @param ip - Client IP address
 * @param limit - Maximum requests per day (default: 10)
 * @returns RateLimitResult with success status and metadata
 */
export function checkRateLimit(ip: string, limit: number = 10): RateLimitResult {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    let record = rateLimitStore.get(ip);

    // Create new record if doesn't exist or expired
    if (!record || now > record.resetAt) {
        record = {
            count: 0,
            resetAt: now + oneDayMs,
        };
        rateLimitStore.set(ip, record);
    }

    // Check if limit exceeded
    if (record.count >= limit) {
        return {
            success: false,
            limit,
            remaining: 0,
            resetAt: record.resetAt,
        };
    }

    // Increment count
    record.count++;

    return {
        success: true,
        limit,
        remaining: limit - record.count,
        resetAt: record.resetAt,
    };
}

/**
 * Get client IP from request headers
 * Handles various proxy scenarios (Vercel, Cloudflare, etc.)
 */
export function getClientIp(headers: Headers): string {
    // Try various headers in order of preference
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIp = headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    const cfConnectingIp = headers.get('cf-connecting-ip');
    if (cfConnectingIp) {
        return cfConnectingIp;
    }

    // Fallback
    return 'unknown';
}
