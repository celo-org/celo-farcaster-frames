// Simple in-memory state management for user data
// In a production app, you'd use a database

interface UserData {
  score: number;
  answers: Record<string, string>;
}

// In-memory store for user data
const userStore: Record<string, UserData> = {};

/**
 * Store a user's answer to a question
 */
export async function storeUserAnswer(
  userId: string, 
  questionId: string, 
  answer: string
): Promise<void> {
  if (!userStore[userId]) {
    userStore[userId] = { score: 0, answers: {} };
  }
  
  userStore[userId].answers[questionId] = answer;
}

/**
 * Increment a user's score
 */
export async function incrementUserScore(
  userId: string, 
  points: number
): Promise<void> {
  if (!userStore[userId]) {
    userStore[userId] = { score: 0, answers: {} };
  }
  
  userStore[userId].score += points;
}

/**
 * Get a user's current score
 */
export async function getUserScore(userId: string): Promise<number> {
  return userStore[userId]?.score || 0;
}

/**
 * Get a user's answers
 */
export async function getUserAnswers(userId: string): Promise<Record<string, string>> {
  return userStore[userId]?.answers || {};
}

/**
 * Reset user data
 */
export async function resetUserData(userId: string): Promise<void> {
  userStore[userId] = { score: 0, answers: {} };
}