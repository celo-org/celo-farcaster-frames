"use client";

import dynamic from "next/dynamic";

// Use relative import instead of alias for better Next.js compatibility
const Demo = dynamic(() => import("../components/Demo"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title: "The AI Accord" }
) {
  return <Demo title={title} />;
}
