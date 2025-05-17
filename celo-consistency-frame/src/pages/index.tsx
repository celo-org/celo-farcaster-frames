import { NextPage } from 'next';
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

const Home: NextPage = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [frameUrl, setFrameUrl] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username) return;
    
    setIsLoading(true);
    
    try {
      // Generate the frame URL
      const host = process.env.NEXT_PUBLIC_HOST || window.location.origin;
      const url = `${host}/frames?username=${encodeURIComponent(username)}`;
      setFrameUrl(url);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Celo Consistency Frame</title>
        <meta name="description" content="Track your consistency of building on Celo" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Frame metadata */}
        {frameUrl && (
          <>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content={`${process.env.NEXT_PUBLIC_HOST}/api/heatmap/${username}`} />
            <meta property="fc:frame:button:1" content="View Heatmap" />
            <meta property="fc:frame:button:2" content="Weekly Summary" />
            <meta property="fc:frame:button:3" content="Leaderboard" />
            <meta property="fc:frame:post_url" content={frameUrl} />
          </>
        )}
      </Head>
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Celo Consistency Frame</h1>
            <p className="text-xl text-gray-300">
              Track your GitHub consistency and compete with other Celo developers
            </p>
          </div>
          
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Generate Your Frame</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  GitHub Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-celo-green"
                  placeholder="Enter your GitHub username"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-celo-green hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {isLoading ? 'Loading...' : 'Generate Frame'}
              </button>
            </form>
            
            {frameUrl && (
              <div className="mt-8 p-4 bg-gray-700 rounded-md">
                <h3 className="text-lg font-medium mb-2">Your Frame URL</h3>
                <div className="flex">
                  <input
                    type="text"
                    value={frameUrl}
                    readOnly
                    className="flex-grow px-3 py-2 bg-gray-800 border border-gray-600 rounded-l-md focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(frameUrl);
                      alert('URL copied to clipboard!');
                    }}
                    className="bg-celo-green px-4 py-2 rounded-r-md hover:bg-opacity-90"
                  >
                    Copy
                  </button>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-md font-medium mb-2">Preview</h4>
                  <div className="border border-gray-600 rounded-md overflow-hidden">
                    <Image
                      src={`/api/heatmap/${username}`}
                      alt="Frame Preview"
                      width={600}
                      height={320}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-12 bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium">1. Add your GitHub profile</h3>
                <p className="text-gray-300">Enter your GitHub username to generate your consistency frame.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium">2. Share your weekly activity</h3>
                <p className="text-gray-300">Your frame will display your GitHub contribution activity in a Farcaster frame.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium">3. Join the leaderboard</h3>
                <p className="text-gray-300">Compete with other Celo developers and track your streak.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium">4. Stay consistent</h3>
                <p className="text-gray-300">Build your streak by consistently contributing to GitHub repositories.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-400">
              Built for the Celo community. Share your building journey on Farcaster.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;