import { NextRequest } from "next/server";
import { getFrameHtmlResponse } from "@coinbase/onchainkit";

// Define baseUrl safely with fallback
const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export async function GET(req: NextRequest) {
  // Get the previous answer from query params
  const url = new URL(req.url);
  const q1 = url.searchParams.get('q1') || '1';
  
  try {
    return new Response(
      getFrameHtmlResponse({
        buttons: [
          {
            label: 'Representative governance',
            action: 'post',
          },
          {
            label: 'Direct democracy',
            action: 'post',
          },
          {
            label: 'Expert council',
            action: 'post',
          },
          {
            label: 'Decentralized autonomous',
            action: 'post',
          },
        ],
        image: {
          src: `${baseUrl}/images/q2.jpg`,
          aspectRatio: '1.91:1',
        },
        postUrl: `${baseUrl}/api/frames?q1=${q1}`,
      }),
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Error in question2 GET handler:', error);
    return new Response('Error generating frame', { status: 500 });
  }
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