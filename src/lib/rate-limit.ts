type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function prune(now: number) {
  if (buckets.size < 500) {
    return;
  }

  Array.from(buckets.entries()).forEach(([key, bucket]) => {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  });
}

export function getAuthLock(key: string): {
  locked: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  prune(now);
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now || existing.count < MAX_ATTEMPTS) {
    return { locked: false, retryAfterSeconds: 0 };
  }

  return {
    locked: true,
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}

export function recordFailedAuthAttempt(key: string) {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  existing.count += 1;
}
