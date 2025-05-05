import { Metadata } from 'next'

// Define the base URL from env variable with a fallback for local development
const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

// Metadata for the frame
export const metadata: Metadata = {
  title: 'DeepGov Compass Quiz',
  description: 'Discover your governance persona with this interactive quiz!',
  openGraph: {
    title: 'DeepGov Compass Quiz',
    description: 'Discover your governance persona with this interactive quiz!',
    images: [`${baseUrl}/celosplash.png`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${baseUrl}/celosplash.png`,
    'fc:frame:post_url': `${baseUrl}/api/frames/quiz`,
    'fc:frame:button:1': 'Start Quiz',
  },
}

// Simple static page that will show metadata to crawlers but won't be seen by users
export default function FramesIndexPage() {
  return (
    <div>
      <h1>DeepGov Compass Quiz</h1>
      <p>Discover your governance persona with this interactive quiz!</p>
    </div>
  )
}