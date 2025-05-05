import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DeepGov Compass",
  description: "Discover your governance persona with this interactive quiz!",
};

export default function FramesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}