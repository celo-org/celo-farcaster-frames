/* eslint-disable react/jsx-key */
import { frames } from "../../frames";
import { Button } from "frames.js/next";

export const POST = frames(async (ctx) => {
  // Get the previous answers from state
  const state = ctx.previousState || { userId: "anon", answers: [] };
  
  return {
    image: {
      src: `${ctx.baseUrl}/images/q5.jpg`,
    },
    buttons: [
      <Button action="post" target="/frames/questionresult" state={{...state, answers: [...state.answers, 1]}}>
        Strategic planning
      </Button>,
      <Button action="post" target="/frames/questionresult" state={{...state, answers: [...state.answers, 2]}}>
        Personal liberty
      </Button>,
      <Button action="post" target="/frames/questionresult" state={{...state, answers: [...state.answers, 3]}}>
        Peaceful balance
      </Button>,
      <Button action="post" target="/frames/questionresult" state={{...state, answers: [...state.answers, 4]}}>
        Creative expression
      </Button>,
    ],
  };
});