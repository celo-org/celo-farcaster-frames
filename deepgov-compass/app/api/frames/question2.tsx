import { frames } from "../../../frames";
import { Button } from "frames.js/next";
import { getFrameMessage } from "frames.js";

export const dynamic = 'force-dynamic';

export const POST = frames(async (ctx) => {
  // Get the frame message to access user data if needed
  const frameMessage = await getFrameMessage(ctx.req);
  
  // Get previous answer (can be stored for scoring later)
  const prevAnswer = ctx.searchParams.answer;

  return {
    image: {
      src: `${ctx.baseUrl}/images/q2.jpg`,
      aspectRatio: "1:1",
    },
    title: "Question 2: Emotional Override Protocol",
    content: (
      <div tw="flex flex-col items-center justify-center">
        <h1 tw="text-3xl font-bold mb-4 text-center">Emotional Override Protocol</h1>
        <p tw="text-xl mb-6 text-center">Your AI occasionally overrides emotional responses in favor of optimal outcomes. Your best friend says it's cold. Your AI says it's correct. Who do you side with?</p>
      </div>
    ),
    buttons: [
      <Button action="post" target={`/api/frames/question3?answer=1&prev=${prevAnswer}`}>
        Trust the AI — logic wins
      </Button>,
      <Button action="post" target={`/api/frames/question3?answer=2&prev=${prevAnswer}`}>
        Depends on the situation
      </Button>,
      <Button action="post" target={`/api/frames/question3?answer=3&prev=${prevAnswer}`}>
        Human emotion > cold logic
      </Button>,
      <Button action="post" target={`/api/frames/question3?answer=4&prev=${prevAnswer}`}>
        Just mute them both
      </Button>,
    ],
  };
});