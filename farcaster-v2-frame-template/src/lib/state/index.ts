import { Redis } from '@upstash/redis'

// Create a Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

// Session expiry time (24 hours in seconds)
const SESSION_EXPIRY = 24 * 60 * 60

/**
 * Get user score from shared state
 */
export async function getUserScore(userId: string): Promise<number> {
  const score = await redis.get<number>(`score:${userId}`)
  return score || 0
}

/**
 * Increment user score
 */
export async function incrementUserScore(userId: string, points: number): Promise<number> {
  const currentScore = await getUserScore(userId)
  const newScore = currentScore + points
  await redis.set(`score:${userId}`, newScore, { ex: SESSION_EXPIRY })
  return newScore
}

/**
 * Store user answer to a question
 */
export async function storeUserAnswer(userId: string, questionId: string, answer: string): Promise<void> {
  await redis.hset(`answers:${userId}`, { [questionId]: answer })
  await redis.expire(`answers:${userId}`, SESSION_EXPIRY)
}

/**
 * Get user answers
 */
export async function getUserAnswers(userId: string): Promise<Record<string, string>> {
  const answers = await redis.hgetall<Record<string, string>>(`answers:${userId}`)
  return answers || {}
}

/**
 * Reset user data (score and answers)
 */
export async function resetUserData(userId: string): Promise<void> {
  await redis.del(`score:${userId}`)
  await redis.del(`answers:${userId}`)
}