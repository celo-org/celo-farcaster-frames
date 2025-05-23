import axios from 'axios';

const GITHUB_API = 'https://api.github.com';

// Interface for GitHub contribution data
export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface ContributionData {
  weeks: ContributionWeek[];
  totalContributions: number;
}

export interface UserData {
  username: string;
  avatarUrl: string;
  name: string;
  bio: string;
}

// Fetch user data from GitHub
export const fetchGitHubUserData = async (username: string): Promise<UserData> => {
  try {
    const token = process.env.GITHUB_TOKEN;
    const headers = token ? { Authorization: `token ${token}` } : {};
    
    const response = await axios.get(`${GITHUB_API}/users/${username}`, { headers });
    
    return {
      username: response.data.login,
      avatarUrl: response.data.avatar_url,
      name: response.data.name || response.data.login,
      bio: response.data.bio || '',
    };
  } catch (error) {
    console.error('Error fetching GitHub user data:', error);
    throw new Error('Failed to fetch GitHub user data');
  }
};

// Fetch contribution data for the last year
export const fetchContributionData = async (username: string): Promise<ContributionData> => {
  try {
    // Using GitHub's GraphQL API to get contribution data
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      throw new Error('GitHub token is required for fetching contribution data');
    }
    
    const query = `
      query {
        user(login: "${username}") {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `;
    
    const response = await axios.post(
      'https://api.github.com/graphql',
      { query },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    const data = response.data.data.user.contributionsCollection.contributionCalendar;
    
    // Process the data into our format
    const weeks: ContributionWeek[] = data.weeks.map((week: any) => ({
      days: week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
        level: getLevelFromContributionLevel(day.contributionLevel),
      })),
    }));
    
    return {
      weeks,
      totalContributions: data.totalContributions,
    };
  } catch (error) {
    console.error('Error fetching contribution data:', error);
    throw new Error('Failed to fetch contribution data');
  }
};

// Helper to convert GitHub's contribution level to a number
const getLevelFromContributionLevel = (level: string): number => {
  switch (level) {
    case 'NONE': return 0;
    case 'FIRST_QUARTILE': return 1;
    case 'SECOND_QUARTILE': return 2;
    case 'THIRD_QUARTILE': return 3;
    case 'FOURTH_QUARTILE': return 4;
    default: return 0;
  }
};

// Calculate streak information
export const calculateStreakInfo = (contributionData: ContributionData) => {
  if (!contributionData || !contributionData.weeks) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Flatten all days
  const allDays = contributionData.weeks.flatMap(week => week.days);
  
  // Sort by date
  allDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Calculate streaks
  for (let i = allDays.length - 1; i >= 0; i--) {
    if (allDays[i].count > 0) {
      tempStreak++;
      
      // If this is the most recent day with contributions, update current streak
      if (i === allDays.length - 1) {
        currentStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
  }
  
  return { currentStreak, longestStreak };
};

// Get leaderboard data
export const getLeaderboard = async (usernames: string[]): Promise<Array<{username: string, contributions: number}>> => {
  try {
    const leaderboardData = await Promise.all(
      usernames.map(async (username) => {
        try {
          const data = await fetchContributionData(username);
          return {
            username,
            contributions: data.totalContributions,
          };
        } catch (error) {
          console.error(`Error fetching data for ${username}:`, error);
          return { username, contributions: 0 };
        }
      })
    );
    
    // Sort by contributions (descending)
    return leaderboardData.sort((a, b) => b.contributions - a.contributions);
  } catch (error) {
    console.error('Error generating leaderboard:', error);
    return [];
  }
};