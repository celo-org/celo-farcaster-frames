import { NextRequest } from "next/server";
import { getFrameHtmlResponse } from '@coinbase/onchainkit';

export async function GET(req: NextRequest) {
  return new Response(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Return to Start',
          action: 'post',
        },
      ],
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/lore.jpg`,
        aspectRatio: '1.91:1',
      },
      postUrl: `${process.env.NEXT_PUBLIC_URL}/api/frames`,
      title: 'The Accord Begins',
      ogDescription: 'The year is 2049. Humanity no longer governs alone.'
    }),
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}

export async function POST(req: NextRequest) {
  // Return to the main frame
  return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/api/frames/quiz`, 302);
}