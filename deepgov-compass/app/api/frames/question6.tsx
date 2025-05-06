import { frames } from "../../../frames";
import { Button } from "frames.js/next";
import { getFrameMessage } from "frames.js";

export const dynamic = 'force-dynamic';

export const POST = frames(async (ctx) => {
  // Get the frame message to access user data if needed
  const frameMessage = await getFrameMessage(ctx.req);
  
  // Get previous answers
  const currentAnswer = ctx.searchParams.answer;
  const previousAnswers = ctx.searchParams.prev;
  
  // Build answer string for tracking responses
  const answerString = `${previousAnswers}-${currentAnswer}`;

  return {
    image: {
      src: `${ctx.baseUrl}/images/q6.jpg`,
      aspectRatio: "1:1",
    },
    title: "Question 6: AI Snack Protocol (Humor Wildcard)",
    content: (
      <div tw="flex flex-col items-center justify-center">
        <h1 tw="text-3xl font-bold mb-4 text-center">AI Snack Protocol</h1>
        <p tw="text-xl mb-6 text-center">Your AI roommate is hungry. What do you offer?</p>
      </div>
    ),
    buttons: [
      <Button action="post" target={`/api/frames/results?answer=1&prev=${answerString}`}>
        Kale chips
      </Button>,
      <Button action="post" target={`/api/frames/results?answer=2&prev=${answerString}`}>
        Neural dust
      </Button>,
      <Button action="post" target={`/api/frames/results?answer=3&prev=${answerString}`}>
        Espresso
      </Button>,
      <Button action="post" target={`/api/frames/results?answer=4&prev=${answerString}`}>
        Nothing — it fasts
      </Button>,
    ],
  };
});