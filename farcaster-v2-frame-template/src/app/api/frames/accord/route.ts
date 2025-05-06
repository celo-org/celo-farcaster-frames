import { NextRequest } from "next/server";
import { getFrameMessage } from "frames.js";

// Define baseUrl safely with fallback
const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

// This is the main entry point for the AI Accord frames
export async function GET(req: NextRequest) {
  try {
    // Create a valid Farcaster frame using frames.js correctly
    const frameMessage = getFrameMessage({
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
      image: `${baseUrl}/splash.png`, // Changed from celosplash.png to splash.png
      postUrl: `${baseUrl}/api/frames/accord/sign`,
    });

    // Return the HTML response with valid frame metadata
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta property="og:title" content="The AI Accord" />
          <meta property="og:description" content="Sign with the AI that shares your values" />
          <meta property="og:image" content="${baseUrl}/splash.png" /> <!-- Changed from celosplash.png to splash.png -->
          ${frameMessage}
        </head>
        <body>
          <h1>The AI Accord</h1>
          <p>Sign with the AI that shares your values</p>
        </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Error in AI Accord GET handler:', error);
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