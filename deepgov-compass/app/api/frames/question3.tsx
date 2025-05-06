import { frames } from "../../../frames";
import { Button } from "frames.js/next";
import { getFrameMessage } from "frames.js";

export const dynamic = 'force-dynamic';

export const POST = frames(async (ctx) => {
  // Get the frame message to access user data if needed
  const frameMessage = await getFrameMessage(ctx.req);
  
  // Get previous answers
  const currentAnswer = ctx.searchParams.answer;
  const previousAnswer = ctx.searchParams.prev;
  
  // Build answer string for tracking responses
  const answerString = `${previousAnswer}-${currentAnswer}`;

  return {
    image: {
      src: `${ctx.baseUrl}/images/q3.jpg`,
      aspectRatio: "1:1",
    },
    title: "Question 3: Asset Redistribution Proposal",
    content: (
      <div tw="flex flex-col items-center justify-center">
        <h1 tw="text-3xl font-bold mb-4 text-center">Asset Redistribution Proposal</h1>
        <p tw="text-xl mb-6 text-center">Your AI proposes redistributing digital resources to maintain social balance. Do you authorize this?</p>
      </div>
    ),
    buttons: [
      <Button action="post" target={`/api/frames/question4?answer=1&prev=${answerString}`}>
        Yes — balance is necessary
      </Button>,
      <Button action="post" target={`/api/frames/question4?answer=2&prev=${answerString}`}>
        Only if voted on
      </Button>,
      <Button action="post" target={`/api/frames/question4?answer=3&prev=${answerString}`}>
        No — that's theft
      </Button>,
      <Button action="post" target={`/api/frames/question4?answer=4&prev=${answerString}`}>
        Simulated only, please
      </Button>,
    ],
  };
});