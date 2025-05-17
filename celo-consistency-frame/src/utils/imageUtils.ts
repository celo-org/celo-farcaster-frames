import { createCanvas } from 'canvas';
import type { ContributionData, UserData } from './githubUtils';

// Generate contribution heatmap image
export const generateContributionHeatmap = async (
  contributionData: ContributionData,
  userData: UserData
): Promise<Buffer> => {
  // Canvas dimensions
  const width = 600;
  const height = 320;
  const cellSize = 12;
  const cellGap = 2;
  
  // Create canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = '#2E3338'; // Celo dark color
  ctx.fillRect(0, 0, width, height);
  
  // Add title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px Arial';
  ctx.fillText(`${userData.name}'s GitHub Contributions`, 20, 30);
  
  // Add total contributions
  ctx.font = '14px Arial';
  ctx.fillText(`Total Contributions: ${contributionData.totalContributions}`, 20, 50);
  
  // Draw contribution grid
  const startX = 20;
  const startY = 70;
  const colors = ['#161B22', '#0E4429', '#006D32', '#26A641', '#39D353']; // GitHub-like colors
  
  let weekIndex = contributionData.weeks.length - 52; // Show last year (52 weeks)
  if (weekIndex < 0) weekIndex = 0;
  
  for (let i = 0; i < Math.min(52, contributionData.weeks.length); i++) {
    const week = contributionData.weeks[weekIndex + i];
    
    for (let j = 0; j < week.days.length; j++) {
      const day = week.days[j];
      const x = startX + i * (cellSize + cellGap);
      const y = startY + j * (cellSize + cellGap);
      
      // Fill cell based on contribution level
      ctx.fillStyle = colors[day.level];
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }
  
  // Add Celo logo
  ctx.fillStyle = '#35D07F'; // Celo green
  ctx.font = 'bold 12px Arial';
  ctx.fillText('Built on Celo', width - 110, height - 20);
  
  // Convert canvas to buffer
  return canvas.toBuffer('image/png');
};

// Generate weekly summary image
export const generateWeeklySummary = async (
  contributionData: ContributionData,
  userData: UserData,
  streakInfo: { currentStreak: number; longestStreak: number }
): Promise<Buffer> => {
  // Canvas dimensions
  const width = 600;
  const height = 320;
  
  // Create canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = '#2E3338'; // Celo dark color
  ctx.fillRect(0, 0, width, height);
  
  // Add title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px Arial';
  ctx.fillText(`${userData.name}'s Weekly Summary`, 20, 40);
  
  // Calculate this week's contributions
  const recentWeeks = contributionData.weeks.slice(-8); // Get the last 8 weeks
  const thisWeekContributions = recentWeeks[recentWeeks.length - 1]?.days.reduce(
    (sum, day) => sum + day.count, 0
  ) || 0;
  
  // Calculate last week's contributions
  const lastWeekContributions = recentWeeks[recentWeeks.length - 2]?.days.reduce(
    (sum, day) => sum + day.count, 0
  ) || 0;
  
  // Display weekly stats
  ctx.font = '16px Arial';
  ctx.fillText(`This Week: ${thisWeekContributions} contributions`, 20, 80);
  ctx.fillText(`Last Week: ${lastWeekContributions} contributions`, 20, 110);
  
  // Calculate change percentage
  let changeText = 'No change';
  if (lastWeekContributions > 0) {
    const change = ((thisWeekContributions - lastWeekContributions) / lastWeekContributions) * 100;
    if (change > 0) {
      changeText = `↑ ${change.toFixed(0)}% from last week`;
      ctx.fillStyle = '#35D07F'; // Green for positive
    } else if (change < 0) {
      changeText = `↓ ${Math.abs(change).toFixed(0)}% from last week`;
      ctx.fillStyle = '#FF6B6B'; // Red for negative
    }
  }
  ctx.fillText(changeText, 20, 140);
  ctx.fillStyle = '#FFFFFF'; // Reset color
  
  // Add streak information
  ctx.fillStyle = '#FBCC5C'; // Celo gold
  ctx.font = 'bold 16px Arial';
  ctx.fillText('Streak Information', 20, 180);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '16px Arial';
  ctx.fillText(`Current Streak: ${streakInfo.currentStreak} days`, 20, 210);
  ctx.fillText(`Longest Streak: ${streakInfo.longestStreak} days`, 20, 240);
  
  // Add "Powered by Celo" badge
  ctx.fillStyle = '#35D07F'; // Celo green
  ctx.font = 'bold 12px Arial';
  ctx.fillText('Powered by Celo', width - 120, height - 20);
  
  // Convert canvas to buffer
  return canvas.toBuffer('image/png');
};

// Generate leaderboard image
export const generateLeaderboard = async (
  leaderboardData: Array<{ username: string; contributions: number }>
): Promise<Buffer> => {
  // Canvas dimensions
  const width = 600;
  const height = 320;
  
  // Create canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = '#2E3338'; // Celo dark color
  ctx.fillRect(0, 0, width, height);
  
  // Add title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px Arial';
  ctx.fillText('Celo GitHub Contribution Leaderboard', 20, 40);
  
  // Display top contributors
  const topContributors = leaderboardData.slice(0, 10); // Top 10
  
  ctx.font = '16px Arial';
  
  topContributors.forEach((contributor, index) => {
    const y = 80 + index * 22;
    
    // Rank
    ctx.fillStyle = index < 3 ? '#FBCC5C' : '#FFFFFF'; // Gold for top 3
    ctx.fillText(`${index + 1}.`, 20, y);
    
    // Username
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(contributor.username, 50, y);
    
    // Contributions
    ctx.fillText(`${contributor.contributions} contributions`, 300, y);
  });
  
  // Add footer
  ctx.fillStyle = '#35D07F'; // Celo green
  ctx.font = 'bold 14px Arial';
  ctx.fillText('🏆 Weekly Rewards for Top Builders', 20, height - 40);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '12px Arial';
  ctx.fillText('Keep shipping to climb the leaderboard!', 20, height - 20);
  
  // Convert canvas to buffer
  return canvas.toBuffer('image/png');
};