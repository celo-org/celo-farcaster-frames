import { Metadata } from 'next';

// Define the base URL from env variable with a fallback for local development
const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

// Metadata for the frame
export const metadata: Metadata = {
  title: 'The AI Accord',
  description: 'Sign with the AI that shares your values',
  openGraph: {
    title: 'The AI Accord',
    description: 'Sign with the AI that shares your values',
    images: [`${baseUrl}/celosplash.png`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${baseUrl}/celosplash.png`,
    'fc:frame:post_url': `${baseUrl}/api/frames/quiz`,
    'fc:frame:button:1': 'Sign the Accord',
  },
};