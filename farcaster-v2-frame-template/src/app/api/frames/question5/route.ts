import { NextRequest } from "next/server";
import { getFrameHtmlResponse } from '@coinbase/onchainkit';

// Define baseUrl safely with fallback
const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export async function GET(req: NextRequest) {
  // Get the previous answers from query params
  const url = new URL(req.url);
  const q1 = url.searchParams.get('q1') || '1';
  const q2 = url.searchParams.get('q2') || '1';
  const q3 = url.searchParams.get('q3') || '1';
  const q4 = url.searchParams.get('q4') || '1';
  
  try {
    return new Response(
      getFrameHtmlResponse({
        buttons: [
          {
            label: 'Strategic planning',
            action: 'post',
          },
          {
            label: 'Personal liberty',
            action: 'post',
          },
          {
            label: 'Peaceful balance',
            action: 'post',
          },
          {
            label: 'Creative expression',
            action: 'post',
          },
        ],
        image: {
          src: `${baseUrl}/images/q5.jpg`,
          aspectRatio: '1.91:1',
        },
        postUrl: `${baseUrl}/api/frames/question5?q1=${q1}&q2=${q2}&q3=${q3}&q4=${q4}`,
      }),
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Error in question5 GET handler:', error);
    return new Response('Error generating frame', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const buttonIndex = body?.untrustedData?.buttonIndex || 1;
    
    // Get the previous answers from the URL parameters
    const url = new URL(req.url);
    const q1Answer = url.searchParams.get('q1') || '1';
    const q2Answer = url.searchParams.get('q2') || '1';
    const q3Answer = url.searchParams.get('q3') || '1';
    const q4Answer = url.searchParams.get('q4') || '1';
    
    // Redirect to the next question with all answers in the URL
    return Response.redirect(`${baseUrl}/api/frames/question6?q1=${q1Answer}&q2=${q2Answer}&q3=${q3Answer}&q4=${q4Answer}&q5=${buttonIndex}`, 302);
  } catch (error) {
    console.error('Error in question5 POST handler:', error);
    return new Response('Error processing request', { status: 500 });
  }
}