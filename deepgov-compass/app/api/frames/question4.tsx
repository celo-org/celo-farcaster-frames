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
      src: `${ctx.baseUrl}/images/q4.jpg`,
      aspectRatio: "1:1",
    },
    title: "Question 4: Moral Agency Transfer",
    content: (
      <div tw="flex flex-col items-center justify-center">
        <h1 tw="text-3xl font-bold mb-4 text-center">Moral Agency Transfer</h1>
        <p tw="text-xl mb-6 text-center">Should AI follow human ethics, or evolve its own logic over time?</p>
      </div>
    ),
    buttons: [
      <Button action="post" target={`/api/frames/question5?answer=1&prev=${answerString}`}>
        Humans must guide AI
      </Button>,
      <Button action="post" target={`/api/frames/question5?answer=2&prev=${answerString}`}>
        Depends on the AI's role
      </Button>,
      <Button action="post" target={`/api/frames/question5?answer=3&prev=${answerString}`}>
        Let AI find its own path
      </Button>,
      <Button action="post" target={`/api/frames/question5?answer=4&prev=${answerString}`}>
        Merge human & AI ethics
      </Button>,
    ],
  };
});