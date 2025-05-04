import { NextRequest } from "next/server";
import { getFrameHtmlResponse } from '@coinbase/onchainkit/frames';

export async function GET(req: NextRequest) {
  return new Response(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Art & beauty',
          action: 'post',
        },
        {
          label: 'Observation',
          action: 'post',
        },
        {
          label: 'Experimentation',
          action: 'post',
        },
        {
          label: 'Clear goals',
          action: 'post',
        },
      ],
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/q4.jpg`,
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
  
  // Get the previous answers from the URL parameters
  const url = new URL(req.url);
  const q1Answer = url.searchParams.get('q1') || '1';
  const q2Answer = url.searchParams.get('q2') || '1';
  const q3Answer = url.searchParams.get('q3') || '1';
  
  // Redirect to the next question with all answers in the URL
  return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/api/frames/question5?q1=${q1Answer}&q2=${q2Answer}&q3=${q3Answer}&q4=${buttonIndex}`, 302);
}