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
    title: "Buy Hypercert",
    action: {
      type: "launch_frame",
      name: "Buy Hypercert",
      url: appUrl,
      splashImageUrl: `${appUrl}/celo
      `,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Buy Hypercert",
    openGraph: {
      title: "Buy Hypercert",
      description: "Buy a fraction of a hypercert on Celo!",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return (<App />);
}
