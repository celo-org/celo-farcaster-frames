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
      src: `${ctx.baseUrl}/images/q5.jpg`,
      aspectRatio: "1:1",
    },
    title: "Question 5: Instinctual Ability Sync (Wildcard)",
    content: (
      <div tw="flex flex-col items-center justify-center">
        <h1 tw="text-3xl font-bold mb-4 text-center">Instinctual Ability Sync</h1>
        <p tw="text-xl mb-6 text-center">Choose an ability for your AI to learn from you:</p>
      </div>
    ),
    buttons: [
      <Button action="post" target={`/api/frames/question6?answer=1&prev=${answerString}`}>
        Teleportation
      </Button>,
      <Button action="post" target={`/api/frames/question6?answer=2&prev=${answerString}`}>
        Talking to animals
      </Button>,
      <Button action="post" target={`/api/frames/question6?answer=3&prev=${answerString}`}>
        Reading minds
      </Button>,
      <Button action="post" target={`/api/frames/question6?answer=4&prev=${answerString}`}>
        Controlling time
      </Button>,
    ],
  };
});