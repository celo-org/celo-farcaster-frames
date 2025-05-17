import { NextApiRequest, NextApiResponse } from 'next';
import { fetchContributionData, fetchGitHubUserData, calculateStreakInfo } from '@/utils/githubUtils';
import { generateContributionHeatmap } from '@/utils/imageUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { username } = req.query;
    
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'GitHub username is required' });
    }
    
    // Fetch user and contribution data
    const userData = await fetchGitHubUserData(username);
    const contributionData = await fetchContributionData(username);
    
    // Generate the heatmap image
    const imageBuffer = await generateContributionHeatmap(contributionData, userData);
    
    // Set the correct content type and send the image
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error generating heatmap:', error);
    res.status(500).json({ error: 'Failed to generate contribution heatmap' });
  }
}