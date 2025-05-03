import { fetchMetadata } from "frames.js/next";
import "./globals.css";

export async function generateMetadata() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  return {
    title: "DeepGov Compass Quiz",
    description: "Discover your governance persona by answering a few quick questions!",
    // Fetch and include frame metadata
    other: await fetchMetadata(new URL("/frames", baseUrl)),
  };
}

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-6">DeepGov Compass Quiz</h1>
      <p className="text-xl mb-8">Discover your governance persona by answering a few quick questions!</p>
      <p className="text-lg">View this page in a Farcaster client to take the quiz.</p>
    </div>
  );
}