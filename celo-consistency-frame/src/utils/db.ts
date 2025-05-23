// Simple in-memory storage for demo purposes
// In a production environment, this would be replaced with a proper database

export interface UserState {
  fid: string;
  githubUsername: string;
  lastVisit: Date;
  streak: number;
}

interface DB {
  users: Map<string, UserState>;
  leaderboard: string[]; // Array of GitHub usernames for the leaderboard
}

// Initialize the database
const db: DB = {
  users: new Map<string, UserState>(),
  leaderboard: [],
};

// User methods
export const saveUser = (fid: string, githubUsername: string): void => {
  const existingUser = db.users.get(fid);
  
  db.users.set(fid, {
    fid,
    githubUsername,
    lastVisit: new Date(),
    streak: existingUser?.streak || 1,
  });
  
  // Add to the leaderboard if not already present
  if (!db.leaderboard.includes(githubUsername)) {
    db.leaderboard.push(githubUsername);
  }
};

export const getUser = (fid: string): UserState | undefined => {
  return db.users.get(fid);
};

export const updateUserVisit = (fid: string): void => {
  const user = db.users.get(fid);
  if (user) {
    // Calculate if this is a new day since last visit
    const lastVisitDate = new Date(user.lastVisit);
    const today = new Date();
    
    const isNewDay = 
      lastVisitDate.getDate() !== today.getDate() || 
      lastVisitDate.getMonth() !== today.getMonth() || 
      lastVisitDate.getFullYear() !== today.getFullYear();
    
    db.users.set(fid, {
      ...user,
      lastVisit: today,
      streak: isNewDay ? user.streak + 1 : user.streak,
    });
  }
};

// Leaderboard methods
export const getLeaderboard = (): string[] => {
  return [...db.leaderboard];
};

export const addToLeaderboard = (githubUsername: string): void => {
  if (!db.leaderboard.includes(githubUsername)) {
    db.leaderboard.push(githubUsername);
  }
};

// Reset database - for testing purposes
export const resetDB = (): void => {
  db.users.clear();
  db.leaderboard = [];
};