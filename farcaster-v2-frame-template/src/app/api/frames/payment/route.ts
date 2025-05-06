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
            label: 'Connect Wallet',
            action: 'post',
          },
          {
            label: 'Learn About Celo',
            action: 'post_redirect',
            target: 'https://celo.org',
          },
        ],
        image: {
          src: `${baseUrl}/celosplash.png`,
          aspectRatio: '1.91:1',
        },
        postUrl: `${baseUrl}/api/frames/payment-flow`,
        title: 'Send Celo with Frames',
        ogDescription: 'Send Celo tokens to Farcaster users directly from a frame',
      }),
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Error in payment GET handler:', error);
    return new Response('Error generating frame', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body for any parameters if needed
    const body = await req.json();
    const buttonIndex = body?.untrustedData?.buttonIndex || 1;
    
    // For this demo, we'll just redirect to the web app
    return new Response(
      getFrameHtmlResponse({
        buttons: [
          {
            label: 'Open Web App',
            action: 'post_redirect',
            target: baseUrl,
          },
          {
            label: 'Go Back',
            action: 'post',
          },
        ],
        image: {
          src: `${baseUrl}/celosplash.png`,
          aspectRatio: '1.91:1',
        },
        postUrl: `${baseUrl}/api/frames`,
      }),
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Error in payment POST handler:', error);
    return new Response('Error processing request', { status: 500 });
  }
}