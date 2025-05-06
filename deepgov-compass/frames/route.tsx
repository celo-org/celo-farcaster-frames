/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";

// This handler serves as the entry point to our AI Accord quiz
export const GET = frames(async (ctx) => {
  return {
    image: {
      src: `${ctx.baseUrl}/images/accord.png`,
      aspectRatio: "1:1",
    },
    title: "Welcome to AI Accord!",
    content: (
          <h1 tw="text-4xl font-bold mb-6 text-center">AI Accord Quiz</h1>
    ),
    buttons: [
      <Button action="post" target="/api/frames/question1">
        Start Quiz
      </Button>,
    ],
  };
});

// Also handle POST requests
export const POST = frames(async (ctx) => {
  return {
    image: {
      src: `${ctx.baseUrl}/images/accord.png`,
      aspectRatio: "1:1",
    },
    title: "Welcome to AI Accord!",
    buttons: [
      <Button action="post" target="/api/frames/question1">
        Start Quiz
      </Button>,
    ],
  };
});