import { NextRequest } from "next/server";
import { getFrameHtmlResponse } from '@coinbase/onchainkit';

export async function GET(req: NextRequest) {
  return new Response(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Teleportation',
          action: 'post',
        },
        {
          label: 'Talking to animals',
          action: 'post',
        },
        {
          label: 'Reading minds',
          action: 'post',
        },
        {
          label: 'Controlling time',
          action: 'post',
        },
      ],
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/q1.jpg`,
        aspectRatio: '1.91:1',
      },
      postUrl: `${process.env.NEXT_PUBLIC_URL}/api/frames`,
    }),
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const buttonIndex = body?.untrustedData?.buttonIndex || 1;
  
  // Store the answer (we'll use this later in the quiz to calculate results)
  // In a real app, you'd store this in a database or session
  
  return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/api/frames/question2?q1=${buttonIndex}`, 302);
}