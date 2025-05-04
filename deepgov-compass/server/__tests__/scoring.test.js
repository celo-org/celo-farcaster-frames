// scoring.test.js
const { calculatePersona, personas, scoringMap } = require('../scoring');

describe('AI Governance Persona Scoring System', () => {
  // Test the personas are defined correctly
  test('personas should be properly defined', () => {
    expect(personas.MUSE).toBeDefined();
    expect(personas.LIBBY).toBeDefined();
    expect(personas.NULL).toBeDefined();
    expect(personas.OBELISK).toBeDefined();
    expect(personas.KAIRO).toBeDefined();
  });

  // Test that the scoring map is correctly defined
  test('scoringMap should be properly defined for all 6 questions', () => {
    expect(scoringMap[1]).toEqual(["KAIRO", "MUSE", "LIBBY", "OBELISK"]);
    expect(scoringMap[2]).toEqual(["KAIRO", "OBELISK", "MUSE", "NULL"]);
    expect(scoringMap[3]).toEqual(["LIBBY", "MUSE", "NULL", "KAIRO"]);
    expect(scoringMap[4]).toEqual(["MUSE", "LIBBY", "NULL", "OBELISK"]);
    expect(scoringMap[5]).toEqual(["OBELISK", "KAIRO", "NULL", "MUSE"]);
    expect(scoringMap[6]).toEqual(["LIBBY", "NULL", "KAIRO", "OBELISK"]);
  });

  // Test the default case (empty answers)
  test('calculatePersona should return NULL for empty answers', () => {
    expect(calculatePersona([])).toEqual(personas.NULL);
    expect(calculatePersona()).toEqual(personas.NULL);
    expect(calculatePersona(null)).toEqual(personas.NULL);
  });

  // Test specific persona scoring for different answer combinations
  test('should identify MUSE persona with creative/expressive answers', () => {
    // Answers that should favor MUSE (creative options)
    const museAnswers = [2, 3, 2, 1, 4, 1]; // Creative-leaning answers
    
    const result = calculatePersona(museAnswers);
    expect(result).toEqual(personas.MUSE);
  });

  test('should identify LIBBY persona with analytical answers', () => {
    // Answers that should favor LIBBY (analytical options)
    const libbyAnswers = [3, 4, 1, 2, 1, 1]; // Analytical-leaning answers
    
    const result = calculatePersona(libbyAnswers);
    expect(result).toEqual(personas.LIBBY);
  });

  test('should identify NULL persona with logical/objective answers', () => {
    // Answers that should favor NULL (logical/objective options)
    const nullAnswers = [4, 4, 3, 3, 3, 2]; // Logical/objective-leaning answers
    
    const result = calculatePersona(nullAnswers);
    expect(result).toEqual(personas.NULL);
  });

  test('should identify OBELISK persona with structured/ordered answers', () => {
    // Answers that should favor OBELISK (structured options)
    const obeliskAnswers = [4, 2, 1, 4, 1, 4]; // Structured/ordered-leaning answers
    
    const result = calculatePersona(obeliskAnswers);
    expect(result).toEqual(personas.OBELISK);
  });

  test('should identify KAIRO persona with adaptive/flexible answers', () => {
    // Answers that should favor KAIRO (adaptive options)
    const kairoAnswers = [1, 1, 4, 2, 2, 3]; // Adaptive/flexible-leaning answers
    
    const result = calculatePersona(kairoAnswers);
    expect(result).toEqual(personas.KAIRO);
  });

  // Test individual questions 4-6 which were enhanced
  test('Question 4: should assign appropriate scores based on answer', () => {
    // Testing only question 4 with different answers
    expect(calculatePersona([0, 0, 0, 1, 0, 0]).name).toEqual('MUSE');    // Art & beauty → MUSE
    expect(calculatePersona([0, 0, 0, 2, 0, 0]).name).toEqual('LIBBY');   // Observation → LIBBY
    expect(calculatePersona([0, 0, 0, 3, 0, 0]).name).toEqual('NULL');    // Experimentation → NULL
    expect(calculatePersona([0, 0, 0, 4, 0, 0]).name).toEqual('OBELISK'); // Clear goals → OBELISK
  });

  test('Question 5: should assign appropriate scores based on answer', () => {
    // Testing only question 5 with different answers
    expect(calculatePersona([0, 0, 0, 0, 1, 0]).name).toEqual('OBELISK'); // Strategic planning → OBELISK
    expect(calculatePersona([0, 0, 0, 0, 2, 0]).name).toEqual('KAIRO');   // Personal liberty → KAIRO
    expect(calculatePersona([0, 0, 0, 0, 3, 0]).name).toEqual('NULL');    // Peaceful balance → NULL
    expect(calculatePersona([0, 0, 0, 0, 4, 0]).name).toEqual('MUSE');    // Creative expression → MUSE
  });

  test('Question 6: should assign appropriate scores based on answer', () => {
    // Testing only question 6 with different answers
    expect(calculatePersona([0, 0, 0, 0, 0, 1]).name).toEqual('LIBBY');   // Kale chips → LIBBY
    expect(calculatePersona([0, 0, 0, 0, 0, 2]).name).toEqual('NULL');    // Neural dust → NULL
    expect(calculatePersona([0, 0, 0, 0, 0, 3]).name).toEqual('KAIRO');   // Espresso → KAIRO
    expect(calculatePersona([0, 0, 0, 0, 0, 4]).name).toEqual('OBELISK'); // Nothing/fasting → OBELISK
  });

  // Test edge cases
  test('handles partial answer sets correctly', () => {
    // Only answers for questions 1-3
    const partialAnswers = [2, 3, 2];
    expect(calculatePersona(partialAnswers)).toBeDefined();
  });

  test('handles more answers than defined questions', () => {
    // More answers than our 6 defined questions
    const extraAnswers = [1, 2, 3, 4, 1, 2, 3, 4];
    expect(calculatePersona(extraAnswers)).toBeDefined();
  });

  // Test scoringMap approach specifically
  test('correctly applies scoringMap to calculate persona scores', () => {
    // Testing a combination that should heavily favor NULL
    const nullFavoringAnswers = [
      4, // Q1: Controlling time (OBELISK)
      4, // Q2: Analyze options (NULL)
      3, // Q3: Open freedom (NULL)
      3, // Q4: Experimentation (NULL)
      3, // Q5: Peaceful balance (NULL)
      2  // Q6: Neural dust (NULL)
    ];
    
    // NULL should have 4 answers (8 points), more than any other persona
    const result = calculatePersona(nullFavoringAnswers);
    expect(result).toEqual(personas.NULL);
  });
});