/* eslint-disable react/jsx-key */
import { frames } from "../../../frames";
import { Button } from "frames.js/next";

// Import persona quotes from your existing scoring logic
const personaQuotes = {
  obelisk: "Logic prevails. Strategy wins. You see the long game.",
  muse: "Imagination is your compass. You seek beautiful chaos.",
  kairo: "You value control, command, and clear lines of action.",
  null: "You prefer to watch, observe, and let the world unfold.",
  libby: "Freedom first, rules later. You are built to rebel.",
};

// Scoring function adapted from your existing server/scoring.js
function scoreAnswers(answers) {
  // Initialize scores for each persona
  const scores = {
    obelisk: 0,
    muse: 0,
    kairo: 0,
    null: 0,
    libby: 0,
  };

  // Define scoring rules based on questions.md
  const scoringRules = [
    // Question 1
    { 1: 'obelisk', 2: 'muse', 3: 'kairo', 4: 'null' },
    // Question 2
    { 1: 'libby', 2: 'kairo', 3: 'muse', 4: 'obelisk' },
    // Question 3
    { 1: 'kairo', 2: 'obelisk', 3: 'libby', 4: 'muse' },
    // Question 4
    { 1: 'muse', 2: 'null', 3: 'libby', 4: 'kairo' },
    // Question 5
    { 1: 'obelisk', 2: 'libby', 3: 'null', 4: 'muse' },
  ];

  // Calculate scores based on answers
  answers.forEach((answer, index) => {
    if (index < scoringRules.length) {
      const questionRules = scoringRules[index];
      const persona = questionRules[answer];
      if (persona) {
        scores[persona]++;
      }
    }
  });

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

export const POST = frames(async (ctx) => {
  // Get the previous answers from state
  const state = ctx.previousState || { userId: "anon", answers: [] };
  
  // Calculate the result based on answers
  const result = scoreAnswers(state.answers);
  
  // Capitalize the persona name for the image filename
  const personaImageName = result.winner.toUpperCase();
  
  return {
    image: {
      src: `${ctx.baseUrl}/images/${personaImageName}.jpg`,
    },
    title: `Your AI Accord Persona: ${result.winner.toUpperCase()}`,
    description: result.quote,
    buttons: [
      <Button action="post" target="/frames/route">
        Share Results
      </Button>,
      <Button action="post" target="/frames/question1">
        Retake Quiz
      </Button>,
    ],
  };
});