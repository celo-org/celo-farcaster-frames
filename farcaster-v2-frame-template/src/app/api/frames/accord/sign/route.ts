import { NextRequest } from "next/server";
import { getFrameHtmlResponse } from '@coinbase/onchainkit';
import { safeParseFrameEmbed } from '@farcaster/frame-core';

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
    const result = safeParseFrameEmbed(body);
    
    if (!result.success) {
      return new Response('Invalid frame request', { status: 400 });
    }
    
    // Get button index from the message (1-based index)
    const buttonIndex = result.data.buttonIndex || 1;
    
    // Button index corresponds to the AI option (1-3)
    // Make sure it's within the valid range
    const aiIndex = Math.min(Math.max(buttonIndex, 1), 3) - 1;
    const selectedAI = aiOptions[aiIndex];
    
    return new Response(
      getFrameHtmlResponse({
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
        image: {
          src: `${baseUrl}/celosplash.png`,
          aspectRatio: '1.91:1',
        },
        postUrl: `${baseUrl}/api/frames/accord`,
        title: 'Thank You for Signing',
        ogDescription: `You've signed The AI Accord with ${selectedAI.name} - ${selectedAI.description}`,
      }),
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