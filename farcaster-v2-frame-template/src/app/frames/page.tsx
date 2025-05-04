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
    images: [`${baseUrl}/celosplash.png`], // Using the splash image from the root public directory
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${baseUrl}/celosplash.png`, // Using the splash image instead of q1.jpg
    'fc:frame:post_url': `${baseUrl}/api/frames/quiz`,
    'fc:frame:button:1': 'Start Quiz',
  },
}

export default function FramesPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">DeepGov Compass Quiz</h1>
      <div className="mb-8">
        <p className="text-lg mb-4">
          This Farcaster Frame helps you discover your governance persona!
        </p>
        <p className="text-md">
          Share this page on Farcaster to start the quiz experience.
        </p>
      </div>
      
      <div className="border border-gray-300 rounded-lg p-6 max-w-md">
        <h2 className="text-xl font-bold mb-4">Frame Preview</h2>
        <div className="aspect-[1.91/1] relative overflow-hidden rounded-md bg-gray-100 mb-4">
          <img
            src="/celosplash.png" 
            alt="Frame Preview"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="grid grid-cols-1 gap-3 w-full">
          <button className="py-2 px-4 bg-blue-500 text-white rounded">Start Quiz</button>
        </div>
      </div>
    </div>
  )
}