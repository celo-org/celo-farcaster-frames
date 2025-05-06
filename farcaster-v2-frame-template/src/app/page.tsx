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
  return {
    title: "The AI Accord",
    description: "Sign with the AI that shares your values",
    openGraph: {
      title: "The AI Accord",
      description: "Sign with the AI that shares your values",
      images: [`${appUrl}/tipme.png`],
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": `${appUrl}/tipme.png`,
      "fc:frame:post_url": `${appUrl}/api/frames/accord`,
      "fc:frame:button:1": "🖊 Sign the Accord",
      "fc:frame:button:2": "📖 Read the Charter"
    }
  };
}

export default function Home() {
  return (<App />);
}
