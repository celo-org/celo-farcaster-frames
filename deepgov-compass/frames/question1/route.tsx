/* eslint-disable react/jsx-key */
import { frames } from "../../frames";
import { Button } from "frames.js/next";

// This function will handle the Question 1 frame
export const POST = frames(async (ctx) => {
  // Start tracking user answers in the state with proper FID handling
  const fid = ctx.frameData?.fid || "anon";
  const state = { userId: fid, answers: [] };
  
  return {
    image: {
      src: `${ctx.baseUrl}/images/q1.jpg`,
    },
    buttons: [
      <Button action="post" target="/frames/question2" state={{...state, answers: [1]}}>
        Teleportation
      </Button>,
      <Button action="post" target="/frames/question2" state={{...state, answers: [2]}}>
        Talking to animals
      </Button>,
      <Button action="post" target="/frames/question2" state={{...state, answers: [3]}}>
        Reading minds
      </Button>,
      <Button action="post" target="/frames/question2" state={{...state, answers: [4]}}>
        Controlling time
      </Button>,
    ],
  };
});

// Also handle direct GET requests to this route
export const GET = frames(async (ctx) => {
  const fid = ctx.frameData?.fid || "anon";
  const state = { userId: fid, answers: [] };
  
  return {
    image: {
      src: `${ctx.baseUrl}/images/q1.jpg`,
    },
    buttons: [
      <Button action="post" target="/frames/question2" state={{...state, answers: [1]}}>
        Teleportation
      </Button>,
      <Button action="post" target="/frames/question2" state={{...state, answers: [2]}}>
        Talking to animals
      </Button>,
      <Button action="post" target="/frames/question2" state={{...state, answers: [3]}}>
        Reading minds
      </Button>,
      <Button action="post" target="/frames/question2" state={{...state, answers: [4]}}>
        Controlling time
      </Button>,
    ],
  };
});