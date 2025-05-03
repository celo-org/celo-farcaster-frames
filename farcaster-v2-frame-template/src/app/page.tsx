import { Metadata } from "next";
import App from "./app";

const appUrl = process.env.NEXT_PUBLIC_URL;

//
// This is the main frame — the one that appears embedded when we share our link.
//
const frame = {
  version: "next",
  // This is the image displayed when sharing the link.
  imageUrl: `${appUrl}/tipme.png`,
  // This is the button displayed when sharing the link.
  button: {
    title: "Start Quiz",
    action: {
      type: "launch_frame",
      name: "Farcaster Quiz",
      url: appUrl,
      splashImageUrl: `${appUrl}/celosplash.png`,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Farcaster Quiz",
    openGraph: {
      title: "Farcaster Quiz",
      description: "Test your knowledge about Farcaster and blockchain!",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return (<App />);
}
