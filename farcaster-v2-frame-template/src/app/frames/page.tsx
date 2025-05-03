import { Metadata } from 'next'

// Define the base URL from env variable or default to a placeholder
const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://your-vercel-domain.vercel.app'

// Metadata for the frame
export const metadata: Metadata = {
  title: 'Celo Quiz Frame',
  description: 'Test your knowledge about Celo with this interactive quiz!',
  openGraph: {
    title: 'Celo Quiz Frame',
    description: 'Test your knowledge about Celo with this interactive quiz!',
    images: [`${baseUrl}/api/frames/question1/image`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${baseUrl}/api/frames/question1/image`,
    'fc:frame:post_url': `${baseUrl}/api/frames`,
    'fc:frame:button:1': 'Option 1',
    'fc:frame:button:2': 'Option 2',
    'fc:frame:button:3': 'Option 3',
    'fc:frame:button:4': 'Option 4',
  },
}

export default function FramesPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">Celo Quiz Frame</h1>
      <div className="mb-8">
        <p className="text-lg mb-4">
          This is a Farcaster Frame that tests knowledge about Celo with scoring!
        </p>
        <p className="text-md">
          Share this page on Farcaster to start the quiz experience.
        </p>
      </div>
      
      <div className="border border-gray-300 rounded-lg p-6 max-w-md">
        <h2 className="text-xl font-bold mb-4">Frame Preview</h2>
        <div className="aspect-[1.91/1] relative overflow-hidden rounded-md bg-gray-100 mb-4">
          <img
            src={`${baseUrl}/api/frames/question1/image`} 
            alt="Frame Preview"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 w-full">
          <button className="py-2 px-4 bg-blue-500 text-white rounded">Option 1</button>
          <button className="py-2 px-4 bg-blue-500 text-white rounded">Option 2</button>
          <button className="py-2 px-4 bg-blue-500 text-white rounded">Option 3</button>
          <button className="py-2 px-4 bg-blue-500 text-white rounded">Option 4</button>
        </div>
      </div>
    </div>
  )
}