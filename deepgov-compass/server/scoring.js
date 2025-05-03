const personaQuotes = {
  obelisk: "Logic prevails. Strategy wins. You see the long game.",
  muse: "Imagination is your compass. You seek beautiful chaos.",
  kairo: "You value control, command, and clear lines of action.",
  null: "You prefer to watch, observe, and let the world unfold.",
  libby: "Freedom first, rules later. You are built to rebel.",
};

function scoreAnswers(answers) {
  // Initialize scores for each persona
  const scores = {
    obelisk: 0,
    muse: 0,
    kairo: 0,
    null: 0,
    libby: 0,
  };

  // Define scoring rules based on questions.md (example structure)
  const scoringRules = [
    // Question 1: Approach to a complex problem?
    { 1: 'obelisk', 2: 'muse', 3: 'kairo', 4: 'null' }, // Answer index maps to persona
    // Question 2: Reaction to sudden change?
    { 1: 'libby', 2: 'kairo', 3: 'muse', 4: 'obelisk' },
    // Question 3: Preferred work environment?
    { 1: 'kairo', 2: 'obelisk', 3: 'libby', 4: 'muse' },
    // Question 4: Source of inspiration?
    { 1: 'muse', 2: 'null', 3: 'libby', 4: 'kairo' },
    // Question 5: Definition of success?
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
    } else if (scores[persona] === maxScore) {
      // Handle ties if necessary, e.g., default to 'null' or another rule
      // For simplicity, we can just keep the first one found or default
    }
  }

  // Return the winner and their quote
  return {
    winner: winner,
    quote: personaQuotes[winner]
  };
}

// This function is now integrated into scoreAnswers
// function determinePersona(scores) { ... }

module.exports = { scoreAnswers }; // Only export scoreAnswers