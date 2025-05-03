import { NextRequest } from "next/server";
import { getFrameHtmlResponse } from '@coinbase/onchainkit';

// This is the main entry point for the quiz frames
export async function GET(req: NextRequest) {
  return new Response(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Start Quiz',
          action: 'post',
        },
      ],
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/celosplash.png`,
        aspectRatio: '1.91:1',
      },
      postUrl: `${process.env.NEXT_PUBLIC_URL}/api/frames`,
      title: 'DeepGov Compass Quiz',
    }),
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}

// Handle POST requests to start the quiz
export async function POST() {
  return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/api/frames/question1`, 302);
}