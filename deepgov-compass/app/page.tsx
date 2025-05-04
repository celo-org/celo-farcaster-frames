import { getFrame } from "frames.js";
import "./globals.css";

export async function generateMetadata() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  // Since fetchMetadata is not available, we'll use getFrame to generate appropriate metadata
  const frameMetadata = await getFrame({
    frame: {
      image: `${baseUrl}/images/landing.png`,
      version: "vNext",
      buttons: [{ label: "Start Quiz", action: "post" }],
      postUrl: `${baseUrl}/frames/question1`,
    },
    pathname: "/frames",
    baseUrl
  });

  return {
    title: "AI Accord Quiz",
    description: "Discover your governance persona by answering a few quick questions!",
    // Include frame metadata
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": frameMetadata.image,
      "fc:frame:post_url": frameMetadata.postUrl,
      "fc:frame:button:1": frameMetadata.buttons[0].label
    },
  };
}

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-6">AI Accord Quiz</h1>
      <p className="text-xl mb-8">Discover your governance persona by answering a few quick questions!</p>
      <p className="text-lg">View this page in a Farcaster client to take the quiz.</p>
    </div>
  );
}