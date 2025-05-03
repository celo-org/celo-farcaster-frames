/* eslint-disable react/jsx-key */
import { frames } from "../../frames";
import { Button } from "frames.js/next";

export const POST = frames(async (ctx) => {
  // Get the previous answers from state
  const state = ctx.previousState || { userId: "anon", answers: [] };
  
  return {
    image: {
      src: `${ctx.baseUrl}/images/q2.jpg`,
    },
    buttons: [
      <Button action="post" target="/frames/question3" state={{...state, answers: [...state.answers, 1]}}>
        Go with the flow
      </Button>,
      <Button action="post" target="/frames/question3" state={{...state, answers: [...state.answers, 2]}}>
        Find structure
      </Button>,
      <Button action="post" target="/frames/question3" state={{...state, answers: [...state.answers, 3]}}>
        Seek creativity
      </Button>,
      <Button action="post" target="/frames/question3" state={{...state, answers: [...state.answers, 4]}}>
        Analyze options
      </Button>,
    ],
  };
});