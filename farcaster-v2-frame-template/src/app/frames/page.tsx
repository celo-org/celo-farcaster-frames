"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/frame-sdk";

// Updated component with Farcaster SDK ready event
export default function FramesIndexPage() {
  useEffect(() => {
    sdk.actions.ready(); // Notifies Farcaster the app is ready
  }, []);

  return (
    <div>
      <h1>The AI Accord</h1>
      <p>Loading your personalized AI contract...</p>
    </div>
  );
}