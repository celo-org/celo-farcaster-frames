import { Metadata } from "next";
import App from "./app";

const appUrl = process.env.NEXT_PUBLIC_URL;

//
// This is the main frame — the one that appears embedded when we share our link.
//
const frame = {
  version: "1",
  image: `${appUrl}/tipme.png`,
  buttons: [
    {
      label: "Sign the Accord",
      action: "post"
    }
  ],
  post_url: `${appUrl}/api/frames`,
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const frameMetadata = {
    version: "1", // Changed from "vNext" to "1" to comply with schema
    imageUrl: `${appUrl}/tipme.png`,
    button: {
      title: "Sign the Accord",
      action: {
        type: "post",
        target: `${appUrl}/api/frames`
      }
    }
  };

  return {
    title: "The AI Accord",
    description: "Sign with the AI that shares your values",
    openGraph: {
      title: "The AI Accord",
      description: "Sign with the AI that shares your values",
      images: [{
        url: `${appUrl}/tipme.png`,
      }],
    },
    other: {
      // Farcaster frame metadata as a single JSON string
      "fc:frame": JSON.stringify(frameMetadata),
    },
  };
}

export default function Home() {
  return (<App />);
}
