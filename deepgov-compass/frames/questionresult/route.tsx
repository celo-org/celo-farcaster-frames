/* eslint-disable react/jsx-key */
import { frames } from "../../frames";
import { Button } from "frames.js/next";
import { calculatePersona } from "../../server/scoring";

export const POST = frames(async (ctx) => {
  // Safely retrieve state with fallback for missing data
  const state = ctx.previousState || { userId: "anon", answers: [] };
  const { userId, answers = [] } = state;
  
  // Calculate the matching persona
  const persona = calculatePersona(answers);

  // Provide detailed information about what answers led to this result
  const totalQuestions = answers.length;
  
  return {
    image: {
      src: `${ctx.baseUrl}/images/${persona.image}`,
    },
    title: `Your AI Accord Match: ${persona.name}`,
    buttons: [
      <Button action="post" target={`https://warpcast.com/~/compose?text=I%20took%20the%20AI%20Accord%20quiz%20and%20my%20persona%20is%20${persona.name}!%20Find%20your%20match%20at%20${encodeURIComponent(ctx.baseUrl)}`}>
        Share Result
      </Button>,
      <Button action="post" target="/frames">
        Try Again
      </Button>,
      <Button action="link" target={`${ctx.baseUrl}/personas/${persona.id}`}>
        Learn More
      </Button>,
    ],
  };
});

// Handle direct GET requests to the result page
export const GET = frames(async (ctx) => {
  // For direct access, show a default message encouraging to take the quiz
  const defaultPersona = {
    name: "Your AI Persona",
    image: "landing.png", 
  };

  return {
    image: {
      src: `${ctx.baseUrl}/images/${defaultPersona.image}`,
    },
    title: "Take the AI Accord Quiz to find your match!",
    buttons: [
      <Button action="post" target="/frames">
        Start Quiz
      </Button>,
    ],
  };
});