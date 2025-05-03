import { Redis } from '@upstash/redis';

// Initialize Redis client - will use environment variables UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Keys for Redis
const USER_SCORE_PREFIX = 'user:score:';
const USER_ANSWERS_PREFIX = 'user:answers:';

/**
 * Store a user's answer to a question
 */
export async function storeUserAnswer(userId: string, questionId: string, answer: string): Promise<void> {
  const key = `${USER_ANSWERS_PREFIX}${userId}`;
  await redis.hset(key, { [questionId]: answer });
}

/**
 * Increment a user's score
 */
export async function incrementUserScore(userId: string, points: number): Promise<number> {
  const key = `${USER_SCORE_PREFIX}${userId}`;
  return await redis.incrby(key, points);
}

/**
 * Get a user's current score
 */
export async function getUserScore(userId: string): Promise<number> {
  const key = `${USER_SCORE_PREFIX}${userId}`;
  const score = await redis.get<number>(key);
  return score || 0;
}

/**
 * Get all of a user's answers
 */
export async function getUserAnswers(userId: string): Promise<Record<string, string>> {
  const key = `${USER_ANSWERS_PREFIX}${userId}`;
  const answers = await redis.hgetall<Record<string, string>>(key);
  return answers || {};
}

/**
 * Reset a user's data (score and answers)
 */
export async function resetUserData(userId: string): Promise<void> {
  const scoreKey = `${USER_SCORE_PREFIX}${userId}`;
  const answersKey = `${USER_ANSWERS_PREFIX}${userId}`;
  
  await Promise.all([
    redis.del(scoreKey),
    redis.del(answersKey)
  ]);
}