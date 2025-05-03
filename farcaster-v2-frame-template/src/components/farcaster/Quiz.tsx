"use client";

import { useState } from "react";
import sdk from "@farcaster/frame-sdk";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer?: number;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is Farcaster?",
    options: ["A social network", "A blockchain", "A programming language", "A web browser"],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "What is a Frame in Farcaster?",
    options: ["A picture frame", "An interactive app", "A browser extension", "A wallet type"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What language is commonly used to build Farcaster frames?",
    options: ["Python", "Java", "TypeScript/JavaScript", "C++"],
    correctAnswer: 2
  }
];

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    // Save the selected answer
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);

    // Check if this was the correct answer
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }

    // Move to next question or show results
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      }, 500);
    } else {
      setTimeout(() => {
        setShowResults(true);
      }, 500);
    }

    // Tell the Farcaster Frame SDK that the button was clicked
    sdk.actions.buttonClicked({
      buttonIndex: answerIndex + 1,
      inputText: `Question ${currentQuestion.id}, Answer: ${currentQuestion.options[answerIndex]}`
    });
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  return (
    <div className="w-full bg-white rounded-lg p-6">
      {!showResults ? (
        <div>
          <h2 className="text-xl font-bold mb-4 text-black">Question {currentQuestion.id} of {quizQuestions.length}</h2>
          <p className="text-lg mb-6 text-black">{currentQuestion.question}</p>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className="w-full py-2 px-4 text-left bg-gray-100 hover:bg-gray-200 text-black rounded-md transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-black">Quiz Complete!</h2>
          <p className="text-xl mb-6 text-black">Your score: {score} / {quizQuestions.length}</p>
          <button
            onClick={resetQuiz}
            className="py-2 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            Take Quiz Again
          </button>
        </div>
      )}
    </div>
  );
}