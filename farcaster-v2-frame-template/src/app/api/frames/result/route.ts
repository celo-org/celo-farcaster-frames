import { NextRequest } from "next/server";
import { getFrameHtmlResponse } from '@coinbase/onchainkit';
import { calculatePersona, personas } from '../../../../lib/utils/scoring';

// Define baseUrl safely with fallback
const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

// Persona quotes - could be moved to the scoring.js file in the future
const personaQuotes = {
  muse: "Imagination is your compass. You seek beautiful chaos.",
  libby: "Freedom first, rules later. You are built to rebel.",
  null: "You prefer to watch, observe, and let the world unfold.",
  obelisk: "Logic prevails. Strategy wins. You see the long game.",
  kairo: "You value control, command, and clear lines of action.",
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  
  // Get all answers from URL parameters and convert to array format for scoring.js
  const answersArray = [
    parseInt(url.searchParams.get('q1') || '1'),
    parseInt(url.searchParams.get('q2') || '1'),
    parseInt(url.searchParams.get('q3') || '1'),
    parseInt(url.searchParams.get('q4') || '1'),
    parseInt(url.searchParams.get('q5') || '1'),
    parseInt(url.searchParams.get('q6') || '1'),
  ];
  
  // Use the imported calculatePersona function to determine the result
  const result = calculatePersona(answersArray);
  
  // Get the persona ID (lowercase) for accessing quotes
  const personaId = result.id;
  
  return new Response(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Share Results',
          action: 'post',
        },
        {
          label: 'Retake Quiz',
          action: 'post',
        },
      ],
      image: {
        src: `${baseUrl}/images/${result.image}`,
        aspectRatio: '1.91:1',
      },
      postUrl: `${baseUrl}/api/frames/result`,
      title: `Your AI Accord Persona: ${result.name}`,
      ogDescription: personaQuotes[personaId] || result.description,
    }),
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}

// Also handle POST requests
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const buttonIndex = body?.untrustedData?.buttonIndex || 1;
    
    if (buttonIndex === 2) {
      // Retake Quiz button was pressed - go back to first question
      return Response.redirect(`${baseUrl}/api/frames/question1`, 302);
    } else {
      // Share Results button was pressed - stay on the result page
      const url = new URL(req.url);
      const queryParams = url.search; // Keep all existing query parameters
      return Response.redirect(`${baseUrl}/api/frames/result${queryParams}`, 302);
    }
  } catch (error) {
    console.error('Error in result POST handler:', error);
    return new Response('Error processing request', { status: 500 });
  }
}