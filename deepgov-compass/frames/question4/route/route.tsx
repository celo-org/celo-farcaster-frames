/* eslint-disable react/jsx-key */
import { frames } from "../../frames";
import { Button } from "frames.js/next";

export const POST = frames(async (ctx) => {
  // Get the previous answers from state
  const state = ctx.previousState || { userId: "anon", answers: [] };
  
  return {
    image: {
      src: `${ctx.baseUrl}/images/q4.jpg`,
    },
    buttons: [
      <Button action="post" target="/frames/question5" state={{...state, answers: [...state.answers, 1]}}>
        Art & beauty
      </Button>,
      <Button action="post" target="/frames/question5" state={{...state, answers: [...state.answers, 2]}}>
        Observation
      </Button>,
      <Button action="post" target="/frames/question5" state={{...state, answers: [...state.answers, 3]}}>
        Experimentation
      </Button>,
      <Button action="post" target="/frames/question5" state={{...state, answers: [...state.answers, 4]}}>
        Clear goals
      </Button>,
    ],
  };
});