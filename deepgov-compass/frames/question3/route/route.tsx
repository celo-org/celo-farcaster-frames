/* eslint-disable react/jsx-key */
import { frames } from "../../frames";
import { Button } from "frames.js/next";

export const POST = frames(async (ctx) => {
  // Get the previous answers from state
  const state = ctx.previousState || { userId: "anon", answers: [] };
  
  return {
    image: {
      src: `${ctx.baseUrl}/images/q3.jpg`,
    },
    buttons: [
      <Button action="post" target="/frames/question4" state={{...state, answers: [...state.answers, 1]}}>
        Clear hierarchy
      </Button>,
      <Button action="post" target="/frames/question4" state={{...state, answers: [...state.answers, 2]}}>
        Logical systems
      </Button>,
      <Button action="post" target="/frames/question4" state={{...state, answers: [...state.answers, 3]}}>
        Open freedom
      </Button>,
      <Button action="post" target="/frames/question4" state={{...state, answers: [...state.answers, 4]}}>
        Creative chaos
      </Button>,
    ],
  };
});