import { NextApiRequest, NextApiResponse } from 'next';
import { fetchContributionData, fetchGitHubUserData, calculateStreakInfo } from '@/utils/githubUtils';
import { generateWeeklySummary } from '@/utils/imageUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { username } = req.query;
    
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'GitHub username is required' });
    }
    
    // Fetch user and contribution data
    const userData = await fetchGitHubUserData(username);
    const contributionData = await fetchContributionData(username);
    
    // Calculate streak information
    const streakInfo = calculateStreakInfo(contributionData);
    
    // Generate the weekly summary image
    const imageBuffer = await generateWeeklySummary(contributionData, userData, streakInfo);
    
    // Set the correct content type and send the image
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error generating weekly summary:', error);
    res.status(500).json({ error: 'Failed to generate weekly summary' });
  }
}