// Define AI personas with their characteristics
export const personas = {
  MUSE: {
    name: "MUSE",
    id: "muse",
    image: "MUSE.jpg",
    description: "Creative and inspiring, MUSE encourages artistic exploration and emotional connection."
  },
  LIBBY: {
    name: "LIBBY",
    id: "libby",
    image: "LIBBY.jpg",
    description: "Analytical and helpful, LIBBY prioritizes knowledge sharing and intellectual growth."
  },
  NULL: {
    name: "NULL",
    id: "null", 
    image: "NULL.jpg",
    description: "Objective and direct, NULL focuses on rational analysis and unbiased decision making."
  },
  OBELISK: {
    name: "OBELISK",
    id: "obelisk",
    image: "OBELISK.jpg", 
    description: "Structured and principled, OBELISK values order, systems, and organizational efficiency."
  },
  KAIRO: {
    name: "KAIRO",
    id: "kairo",
    image: "KAIRO.jpg",
    description: "Flexible and adaptive, KAIRO emphasizes practical solutions and real-world applications."
  }
};

// Define the scoring map - maps question numbers to persona arrays
// Each array position (0-3) corresponds to answer options (1-4)
export const scoringMap = {
  1: ["KAIRO", "MUSE", "LIBBY", "OBELISK"],    // Teleportation, Talking to animals, Reading minds, Controlling time
  2: ["KAIRO", "OBELISK", "MUSE", "NULL"],     // Go with the flow, Find structure, Seek creativity, Analyze options
  3: ["LIBBY", "MUSE", "NULL", "KAIRO"],       // Clear hierarchy, Logical systems, Open freedom, Creative chaos
  4: ["MUSE", "LIBBY", "NULL", "OBELISK"],     // Art & beauty, Observation, Experimentation, Clear goals
  5: ["OBELISK", "KAIRO", "NULL", "MUSE"],     // Strategic planning, Personal liberty, Peaceful balance, Creative expression
  6: ["LIBBY", "NULL", "KAIRO", "OBELISK"]     // Kale chips, Neural dust, Espresso, Nothing — it fasts
};

// Default scoring for any questions beyond the defined set
const defaultScoring = ["LIBBY", "MUSE", "NULL", "OBELISK"];

/**
 * Calculate the persona match based on quiz answers
 * @param {number[]} answers - Array of numeric answers (1-4) from the quiz
 * @returns {Object} The matching persona object
 */
export function calculatePersona(answers: number[] = []) {
  // Safety check - if no answers or invalid data, return a default
  if (!Array.isArray(answers) || answers.length === 0) {
    return personas.NULL; // Default fallback
  }

  // Calculate scores for each persona
  let scores = {
    MUSE: 0,
    LIBBY: 0,
    NULL: 0,
    OBELISK: 0,
    KAIRO: 0
  };

  // Process each answer and assign points based on the scoringMap
  answers.forEach((answerValue, index) => {
    const questionNumber = index + 1;
    
    // Skip invalid answers
    if (answerValue < 1 || answerValue > 4) return;
    
    // Get the array of personas for this question from the scoringMap
    const personaArray = scoringMap[questionNumber] || defaultScoring;
    
    // Get the persona corresponding to this answer
    const personaKey = personaArray[answerValue - 1];
    
    // If persona exists in our scoring object, add points
    if (personaKey && scores[personaKey] !== undefined) {
      scores[personaKey] += 2; // Each answer is worth 2 points
    }
    
    // Special handling for KAIRO in default scoring (questions beyond our defined set)
    if (!scoringMap[questionNumber] && answerValue >= 3) {
      scores.KAIRO += 0.5; // Additional distribution for balance
    }
  });

  // Find the highest score
  let maxScore = 0;
  for (const score of Object.values(scores)) {
    if (score > maxScore) {
      maxScore = score;
    }
  }
  
  // Find all personas with the highest score (for tie-breaking)
  const highestScoringPersonas = [];
  for (const [persona, score] of Object.entries(scores)) {
    if (score === maxScore) {
      highestScoringPersonas.push(persona);
    }
  }
  
  let matchedPersona;
  
  // Handle ties
  if (highestScoringPersonas.length === 1) {
    // No tie - clear winner
    matchedPersona = personas[highestScoringPersonas[0] as keyof typeof personas];
  } else {
    // There's a tie - implement tie-breaking logic
    
    // Randomly select between tied personas for surprise
    const randomIndex = Math.floor(Math.random() * highestScoringPersonas.length);
    matchedPersona = personas[highestScoringPersonas[randomIndex] as keyof typeof personas];
  }

  return matchedPersona || personas.NULL; // Fallback to NULL if something goes wrong
}