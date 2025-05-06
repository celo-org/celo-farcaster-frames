import { frames } from "../../../frames";
import { Button } from "frames.js/next";
import { getFrameMessage } from "frames.js";

export const dynamic = 'force-dynamic';

// Define AI personality types based on quiz results
const aiPersonalities = {
  KAIRO: {
    name: "KAIRO",
    description: "You believe in balance between human guidance and AI autonomy. You value democratic processes and thoughtful integration of AI into society.",
    image: "KAIRO.jpg"
  },
  LIBBY: {
    name: "LIBBY",
    description: "You prioritize freedom and individual choice. You prefer AI that enhances personal liberty rather than imposing societal constraints.",
    image: "LIBBY.jpg"
  },
  MUSE: {
    name: "MUSE",
    description: "You appreciate the creative potential of AI. You see AI not just as a tool but as a collaborator that inspires new ideas and perspectives.",
    image: "MUSE.jpg"
  },
  NULL: {
    name: "NULL",
    description: "You prefer AI to stay in the background. You value human relationships and experiences over technological solutions.",
    image: "NULL.jpg"
  },
  OBELISK: {
    name: "OBELISK",
    description: "You trust in AI's logical capabilities. You believe AI can offer solutions to complex problems through rational analysis.",
    image: "OBELISK.jpg"
  }
};

// Simple scoring function to determine personality based on answers
function determinePersonality(answers: string): string {
  const answerArray = answers.split('-').map(Number);
  
  // Example simple scoring logic - you can customize this
  const q1 = answerArray[0] || 0;
  const q2 = answerArray[1] || 0;
  const q3 = answerArray[2] || 0;
  const q4 = answerArray[3] || 0;
  
  // Very simplistic scoring - you should expand with more nuanced logic
  if (q1 === 1 && q2 === 1) return "OBELISK"; // Trust in AI logic
  if (q1 === 3 && (q3 === 2 || q3 === 3)) return "LIBBY"; // Values democracy and freedom
  if (q2 === 3 && q4 === 4) return "MUSE"; // Values human emotion and merged ethics
  if (q4 === 1 || (q2 === 1 && q3 === 1)) return "KAIRO"; // Believes in human guidance
  if (q1 === 4 || q2 === 4) return "NULL"; // Skeptical or humorous about AI

  // Default if no clear pattern
  return "KAIRO";
}

export const POST = frames(async (ctx) => {
  // Get the frame message to access user data if needed
  const frameMessage = await getFrameMessage(ctx.req);
  
  // Get all answers
  const currentAnswer = ctx.searchParams.answer;
  const previousAnswers = ctx.searchParams.prev;
  
  // Combine all answers
  const allAnswers = `${previousAnswers}-${currentAnswer}`;
  
  // Determine the personality
  const personalityType = determinePersonality(allAnswers);
  const personality = aiPersonalities[personalityType];

  return {
    image: {
      src: `${ctx.baseUrl}/images/${personality.image}`,
      aspectRatio: "1:1",
    },
    title: `Your AI Accord Type: ${personality.name}`,
    content: (
      <div tw="flex flex-col items-center justify-center">
        <h1 tw="text-3xl font-bold mb-4 text-center">{personality.name}</h1>
        <p tw="text-xl mb-6 text-center">{personality.description}</p>
        <p tw="text-md mb-2 text-center">Thanks for taking the AI Accord Quiz!</p>
      </div>
    ),
    buttons: [
      <Button action="post" target="/api/frames">
        Take the Quiz Again
      </Button>,
      <Button action="link" target="https://aihub.org/ai-accord">
        Learn More About AI Accord
      </Button>,
    ],
  };
});