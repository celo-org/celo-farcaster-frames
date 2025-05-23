import { NextApiRequest, NextApiResponse } from 'next';
import { getLeaderboard } from '@/utils/githubUtils';
import { generateLeaderboard as generateLeaderboardImage } from '@/utils/imageUtils';
import { getLeaderboard as getLeaderboardFromDB } from '@/utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the list of GitHub usernames from our database
    const usernames = getLeaderboardFromDB();
    
    if (usernames.length === 0) {
      return res.status(404).json({ error: 'No users on the leaderboard yet' });
    }
    
    // Get contribution data for the leaderboard
    const leaderboardData = await getLeaderboard(usernames);
    
    // Generate the leaderboard image
    const imageBuffer = await generateLeaderboardImage(leaderboardData);
    
    // Set the correct content type and send the image
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error generating leaderboard:', error);
    res.status(500).json({ error: 'Failed to generate leaderboard' });
  }
}