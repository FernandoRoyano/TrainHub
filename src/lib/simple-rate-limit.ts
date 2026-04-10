const requests = new Map<string, number[]>();

export function checkRateLimit(userId: string, maxPerMinute = 20): boolean {
  const now = Date.now();
  const windowStart = now - 60_000;
  const userReqs = (requests.get(userId) || []).filter(t => t > windowStart);
  if (userReqs.length >= maxPerMinute) return false;
  requests.set(userId, [...userReqs, now]);
  return true;
}
