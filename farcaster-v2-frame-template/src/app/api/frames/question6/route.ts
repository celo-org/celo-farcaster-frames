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
  const q5 = url.searchParams.get('q5') || '1';
  
  try {
    return new Response(
      getFrameHtmlResponse({
        buttons: [
          {
            label: 'Analyze data',
            action: 'post',
          },
          {
            label: 'Trust intuition',
            action: 'post',
          },
          {
            label: 'Consult experts',
            action: 'post',
          },
          {
            label: 'Collaborative decision',
            action: 'post',
          },
        ],
        image: {
          src: `${baseUrl}/images/q6.jpg`,
          aspectRatio: '1.91:1',
        },
        postUrl: `${baseUrl}/api/frames/question6?q1=${q1}&q2=${q2}&q3=${q3}&q4=${q4}&q5=${q5}`,
      }),
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Error in question6 GET handler:', error);
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
    const q5Answer = url.searchParams.get('q5') || '1';
    
    // Redirect to the results page with all answers in the URL
    return Response.redirect(`${baseUrl}/api/frames/result?q1=${q1Answer}&q2=${q2Answer}&q3=${q3Answer}&q4=${q4Answer}&q5=${q5Answer}&q6=${buttonIndex}`, 302);
  } catch (error) {
    console.error('Error in question6 POST handler:', error);
    return new Response('Error processing request', { status: 500 });
  }
}