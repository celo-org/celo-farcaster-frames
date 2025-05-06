import { Metadata } from "next";
import App from "./app";

const appUrl = process.env.NEXT_PUBLIC_URL;

//
// This is the main frame — the one that appears embedded when we share our link.
//
const frame = {
  version: "1",
  image: `${appUrl}/splash.png`,
  buttons: [
    {
      label: "Start AI Accord Quiz",
      action: "post"
    }
  ],
  post_url: `${appUrl}/api/frames`,
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Celo AI Accord Quiz",
    description: "Take the AI Accord Quiz to find your AI alignment",
    openGraph: {
      title: "Celo AI Accord Quiz",
      description: "Take the AI Accord Quiz to find your AI alignment",
      images: [`${appUrl}/splash.png`],
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": `${appUrl}/splash.png`,
      "fc:frame:post_url": `${appUrl}/api/frames`,
      "fc:frame:button:1": "Start Quiz"
    }
  };
}

export default function Home() {
  return (<App />);
}
