/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";

// This handler serves as the entry point to our DeepGov Compass quiz
const frameHandler = frames(async () => {
  return {
    image: (
      <div tw="flex w-full h-full bg-blue-100 items-center justify-center">
        <div tw="flex flex-col items-center p-10 max-w-4xl">
          <h1 tw="text-4xl font-bold mb-6 text-center">DeepGov Compass Quiz</h1>
          <p tw="text-xl mb-8 text-center">Discover your governance persona by answering a few quick questions!</p>
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target="/frames/question1">
        Start Quiz
      </Button>,
    ],
  };
});

// Export both GET and POST handlers using the same frame handler
export const GET = frameHandler;
export const POST = frameHandler;