import { NextRequest } from "next/server";
import { getFrameHtmlResponse } from '@coinbase/onchainkit';

// Persona quotes
const personaQuotes = {
  obelisk: "Logic prevails. Strategy wins. You see the long game.",
  muse: "Imagination is your compass. You seek beautiful chaos.",
  kairo: "You value control, command, and clear lines of action.",
  null: "You prefer to watch, observe, and let the world unfold.",
  libby: "Freedom first, rules later. You are built to rebel.",
};

// Scoring function to determine the user's persona
function scoreAnswers(answers: Record<string, string>) {
  // Initialize scores for each persona
  const scores = {
    obelisk: 0,
    muse: 0,
    kairo: 0,
    null: 0,
    libby: 0,
  };

  // Define scoring rules based on questions
  const scoringRules: Record<string, Record<string, string>> = {
    q1: { '1': 'obelisk', '2': 'muse', '3': 'kairo', '4': 'null' },
    q2: { '1': 'libby', '2': 'kairo', '3': 'muse', '4': 'obelisk' },
    q3: { '1': 'kairo', '2': 'obelisk', '3': 'libby', '4': 'muse' },
    q4: { '1': 'muse', '2': 'null', '3': 'libby', '4': 'kairo' },
    q5: { '1': 'obelisk', '2': 'libby', '3': 'null', '4': 'muse' },
  };

  // Calculate scores based on answers
  for (const questionId in answers) {
    const answer = answers[questionId];
    const questionRules = scoringRules[questionId];
    
    if (questionRules && questionRules[answer]) {
      const persona = questionRules[answer];
      scores[persona]++;
    }
  }

  // Determine the winner
  let winner = 'null'; // Default persona
  let maxScore = 0;
  for (const persona in scores) {
    if (scores[persona] > maxScore) {
      maxScore = scores[persona];
      winner = persona;
    }
  }

  // Return the winner and their quote
  return {
    winner,
    quote: personaQuotes[winner]
  };
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  
  // Get all answers from URL parameters
  const answers = {
    q1: url.searchParams.get('q1') || '1',
    q2: url.searchParams.get('q2') || '1',
    q3: url.searchParams.get('q3') || '1',
    q4: url.searchParams.get('q4') || '1',
    q5: url.searchParams.get('q5') || '1',
  };
  
  // Calculate the result based on answers
  const result = scoreAnswers(answers);
  
  // Capitalize the persona name for the image filename
  const personaImageName = result.winner.toUpperCase();
  
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
        src: `${process.env.NEXT_PUBLIC_URL}/images/${personaImageName}.jpg`,
        aspectRatio: '1.91:1',
      },
      postUrl: `${process.env.NEXT_PUBLIC_URL}/api/frames`,
      title: `Your DeepGov Persona: ${result.winner.toUpperCase()}`,
      ogDescription: result.quote,
    }),
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const buttonIndex = body?.untrustedData?.buttonIndex || 1;
  
  if (buttonIndex === 2) {
    // Retake Quiz button was pressed - go back to first question
    return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/api/frames/question1`, 302);
  } else {
    // Share Results button was pressed - stay on the result page
    return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/api/frames/result`, 302);
  }
}