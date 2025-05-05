import { NextRequest } from "next/server";
import { getFrameMessage } from "frames.js";

// Define baseUrl safely with fallback
const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

// AI options with their descriptions
const aiOptions = [
  { name: "Liberty AI", description: "Values freedom, privacy, and minimal regulation" },
  { name: "Harmony AI", description: "Balances human welfare with technological advancement" },
  { name: "Guardian AI", description: "Prioritizes safety, security, and ethical considerations" }
];

// This handles the confirmation page after a user selects an AI option
export async function POST(req: NextRequest) {
  try {
    // Parse the frame request
    const body = await req.json();
    const buttonIndex = body?.untrustedData?.buttonIndex || 1;
    
    // Button index corresponds to the AI option (1-3)
    // Make sure it's within the valid range for the AI options
    const aiIndex = Math.min(Math.max(buttonIndex, 1), 3) - 1;
    const selectedAI = aiOptions[aiIndex];
    
    // Create a valid Farcaster frame using frames.js
    const frameMessage = getFrameMessage({
      buttons: [
        {
          label: 'Share Your Choice',
          action: 'post',
        },
        {
          label: 'Make Another Selection',
          action: 'post_redirect',
          target: `${baseUrl}/api/frames/accord`,
        }
      ],
      image: `${baseUrl}/celosplash.png`,
      postUrl: `${baseUrl}/api/frames/accord`,
    });

    // Return the HTML response with valid frame metadata
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta property="og:title" content="Thank You for Signing" />
          <meta property="og:description" content="You've signed The AI Accord with ${selectedAI.name} - ${selectedAI.description}" />
          <meta property="og:image" content="${baseUrl}/celosplash.png" />
          ${frameMessage}
        </head>
        <body>
          <h1>Thank You for Signing</h1>
          <p>You've signed The AI Accord with ${selectedAI.name} - ${selectedAI.description}</p>
        </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Error in AI Accord sign handler:', error);
    return new Response('Error generating frame', { status: 500 });
  }
}