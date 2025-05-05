import { NextRequest } from "next/server";
import { getFrameHtmlResponse } from '@coinbase/onchainkit';

// Define baseUrl safely with fallback
const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

// This is the main entry point for the AI Accord frames
export async function GET(req: NextRequest) {
  try {
    return new Response(
      getFrameHtmlResponse({
        buttons: [
          {
            label: 'Liberty AI',
            action: 'post',
          },
          {
            label: 'Harmony AI',
            action: 'post',
          },
          {
            label: 'Guardian AI',
            action: 'post',
          },
          {
            label: 'Learn More',
            action: 'post_redirect',
            target: `${baseUrl}`,
          }
        ],
        image: {
          src: `${baseUrl}/celosplash.png`,
          aspectRatio: '1.91:1',
        },
        postUrl: `${baseUrl}/api/frames/accord/sign`,
        title: 'The AI Accord',
        ogDescription: 'Sign with the AI that shares your values',
      }),
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Error in AI Accord GET handler:', error);
    // Return a simple error response instead of throwing
    return new Response('Error generating frame', { status: 500 });
  }
}

// Handle POST requests 
export async function POST() {
  try {
    return Response.redirect(`${baseUrl}/api/frames/accord`, 302);
  } catch (error) {
    console.error('Error in AI Accord POST handler:', error);
    return new Response('Error processing request', { status: 500 });
  }
}