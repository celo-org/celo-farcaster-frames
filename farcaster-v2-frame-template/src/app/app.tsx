"use client";

import dynamic from "next/dynamic";

// Use dynamic imports for client components that use browser features
const Quiz = dynamic(() => import("../components/farcaster/Quiz"), {
  ssr: false,
});

export default function App() {
  return (
    <div className="max-w-screen-md mx-auto p-4">
      <div className="w-full max-w-md mx-auto py-6 px-4 bg-card rounded-xl shadow-sm border border-border">
        <img alt="Logo" src="/Celo_Wordmark_RGB_Onyx.svg" className="w-24 mx-auto block mt-6" />
        <h1 className="text-3xl font-bold text-center mb-6 text-black">The AI Accord</h1>
        <Quiz />
      </div>
      
      <footer className="text-center mt-8 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Celo AI Accord Quiz</p>
      </footer>
    </div>
  );
}
