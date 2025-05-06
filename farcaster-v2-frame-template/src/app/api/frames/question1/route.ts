import { NextRequest } from "next/server";
import { getFrameHtmlResponse } from "@coinbase/onchainkit";

// Define baseUrl safely with fallback
const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export async function GET(req: NextRequest) {
  try {
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
          src: `${baseUrl}/images/q1.jpg`,
          aspectRatio: '1.91:1',
        },
        postUrl: `${baseUrl}/api/frames/question1`,
      }),
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Error in question1 GET handler:', error);
    return new Response('Error generating frame', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const buttonIndex = body?.untrustedData?.buttonIndex || 1;
    
    // Store the answer (buttonIndex) and redirect to question 2
    return Response.redirect(`${baseUrl}/api/frames/question2?q1=${buttonIndex}`, 302);
  } catch (error) {
    console.error('Error in question1 POST handler:', error);
    return new Response('Error processing request', { status: 500 });
  }
}