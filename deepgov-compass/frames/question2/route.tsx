/* eslint-disable react/jsx-key */
import { frames } from "../../frames";
import { Button } from "frames.js/next";

export const POST = frames(async (ctx) => {
  // Get the previous state with fallbacks for missing data
  const state = ctx.previousState || { userId: "anon", answers: [] };
  // Use optional chaining and nullish coalescing for safer state access
  const prevAnswers = state.answers?.length ? state.answers : [];
  
  return {
    image: {
      src: `${ctx.baseUrl}/images/q2.jpg`,
    },
    buttons: [
      <Button action="post" target="/frames/question3" state={{...state, answers: [...prevAnswers, 1]}}>
        Go with the flow
      </Button>,
      <Button action="post" target="/frames/question3" state={{...state, answers: [...prevAnswers, 2]}}>
        Find structure
      </Button>,
      <Button action="post" target="/frames/question3" state={{...state, answers: [...prevAnswers, 3]}}>
        Seek creativity
      </Button>,
      <Button action="post" target="/frames/question3" state={{...state, answers: [...prevAnswers, 4]}}>
        Analyze options
      </Button>,
    ],
  };
});

// Handle direct GET requests as well with a clean initial state
export const GET = frames(async (ctx) => {
  // If accessed directly, start with empty state but prompt to start from beginning
  return {
    image: {
      src: `${ctx.baseUrl}/images/q2.jpg`,
    },
    buttons: [
      <Button action="post" target="/frames/question1">
        ⬅️ Start from beginning
      </Button>,
      <Button action="post" target="/frames/question3" state={{ userId: "anon", answers: [1, 1] }}>
        Go with the flow
      </Button>,
      <Button action="post" target="/frames/question3" state={{ userId: "anon", answers: [1, 2] }}>
        Find structure
      </Button>,
      <Button action="post" target="/frames/question3" state={{ userId: "anon", answers: [1, 3] }}>
        Seek creativity
      </Button>,
    ],
  };
});