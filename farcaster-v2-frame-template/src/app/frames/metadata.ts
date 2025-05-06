import { Metadata } from 'next';

export function generateMetadata(): Metadata {
  const appUrl = process.env.NEXT_PUBLIC_URL || 'https://your-app.vercel.app';

  return {
    title: 'The AI Accord',
    description: 'Sign with the AI that shares your values.',
    openGraph: {
      images: [`${appUrl}/celosplash.png`],
    },
    other: {
      'fc:frame': 'vNext',
      'fc:frame:image': `${appUrl}/celosplash.png`,
      'fc:frame:post_url': `${appUrl}/api/frames/accord`,
      'fc:frame:button:1': '🖊 Sign the Accord',
      'fc:frame:button:2': '📖 Read the Charter',
    },
  };
}