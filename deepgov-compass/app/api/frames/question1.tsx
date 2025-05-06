import { frames } from "../../../frames";
import { Button } from "frames.js/next";
import { getFrameMessage } from "frames.js";

export const dynamic = 'force-dynamic';

export const POST = frames(async (ctx) => {
  // Get the frame message to access user data if needed
  const frameMessage = await getFrameMessage(ctx.req);

  return {
    image: {
      src: `${ctx.baseUrl}/images/q1.jpg`,
      aspectRatio: "1:1",
    },
    title: "Question 1: Emergency Leadership Override",
    content: (
      <div tw="flex flex-col items-center justify-center">
        <h1 tw="text-3xl font-bold mb-4 text-center">Emergency Leadership Override</h1>
        <p tw="text-xl mb-6 text-center">Your AI assistant just got promoted to President in a national emergency. Do you accept this leadership change?</p>
      </div>
    ),
    buttons: [
      <Button action="post" target="/api/frames/question2?answer=1">
        Yes, AI for President!
      </Button>,
      <Button action="post" target="/api/frames/question2?answer=2">
        Only with human advisors
      </Button>,
      <Button action="post" target="/api/frames/question2?answer=3">
        Democracy first
      </Button>,
      <Button action="post" target="/api/frames/question2?answer=4">
        Let's see how it handles brunch
      </Button>,
    ],
  };
});