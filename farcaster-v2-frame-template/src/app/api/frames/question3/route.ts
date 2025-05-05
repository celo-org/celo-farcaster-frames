import { NextRequest } from "next/server";
import { getFrameHtmlResponse } from "@coinbase/onchainkit";

// Define baseUrl safely with fallback
const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export async function GET(req: NextRequest) {
  // Get the previous answers from query params
  const url = new URL(req.url);
  const q1 = url.searchParams.get('q1') || '1';
  const q2 = url.searchParams.get('q2') || '1';
  
  try {
    return new Response(
      getFrameHtmlResponse({
        buttons: [
          {
            label: 'Efficiency',
            action: 'post',
          },
          {
            label: 'Fairness',
            action: 'post',
          },
          {
            label: 'Innovation',
            action: 'post',
          },
          {
            label: 'Stability',
            action: 'post',
          },
        ],
        image: {
          src: `${baseUrl}/images/q3.jpg`,
          aspectRatio: '1.91:1',
        },
        postUrl: `${baseUrl}/api/frames?q1=${q1}&q2=${q2}`,
      }),
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Error in question3 GET handler:', error);
    return new Response('Error generating frame', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const buttonIndex = body?.untrustedData?.buttonIndex || 1;
  
  // Get the previous answers from the URL parameters
  const url = new URL(req.url);
  const q1Answer = url.searchParams.get('q1') || '1';
  const q2Answer = url.searchParams.get('q2') || '1';
  
  // Redirect to the next question with all answers in the URL
  return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/api/frames/question4?q1=${q1Answer}&q2=${q2Answer}&q3=${buttonIndex}`, 302);
}