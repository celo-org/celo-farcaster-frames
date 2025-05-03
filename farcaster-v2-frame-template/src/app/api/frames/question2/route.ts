import { NextRequest } from "next/server";
import { getFrameHtmlResponse } from '@coinbase/onchainkit';

export async function GET(req: NextRequest) {
  return new Response(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Go with the flow',
          action: 'post',
        },
        {
          label: 'Find structure',
          action: 'post',
        },
        {
          label: 'Seek creativity',
          action: 'post',
        },
        {
          label: 'Analyze options',
          action: 'post',
        },
      ],
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/q2.jpg`,
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
  
  // Get the answer from question 1 from the URL parameters
  const url = new URL(req.url);
  const q1Answer = url.searchParams.get('q1') || '1';
  
  // Redirect to the next question with both answers in the URL
  return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/api/frames/question3?q1=${q1Answer}&q2=${buttonIndex}`, 302);
}