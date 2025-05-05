"use client";

import { useState } from "react";
import sdk from "@farcaster/frame-sdk";

interface AIOption {
  id: number;
  name: string;
  description: string;
}

const aiOptions: AIOption[] = [
  {
    id: 1,
    name: "Liberty AI",
    description: "Values freedom, privacy, and minimal regulation"
  },
  {
    id: 2,
    name: "Harmony AI",
    description: "Balances human welfare with technological advancement"
  },
  {
    id: 3,
    name: "Guardian AI",
    description: "Prioritizes safety, security, and ethical considerations"
  }
];

export default function Quiz() {
  const [selectedAI, setSelectedAI] = useState<number | null>(null);
  const [signed, setSigned] = useState(false);

  const handleAISelect = (aiIndex: number) => {
    setSelectedAI(aiIndex);
    
    // Tell the Farcaster Frame SDK that the button was clicked
    sdk.actions.buttonClicked({
      buttonIndex: aiIndex + 1,
      inputText: `Selected: ${aiOptions[aiIndex].name}`
    });
  };

  const handleSign = () => {
    if (selectedAI !== null) {
      setSigned(true);
      
      // Tell the Farcaster Frame SDK that the sign button was clicked
      sdk.actions.buttonClicked({
        buttonIndex: 4,
        inputText: `Signed with: ${aiOptions[selectedAI].name}`
      });
    }
  };

  const reset = () => {
    setSelectedAI(null);
    setSigned(false);
  };

  return (
    <div className="w-full bg-white rounded-lg p-6">
      <p className="text-lg mb-6 text-center text-gray-600">Sign with the AI that shares your values</p>
      
      {!signed ? (
        <div>
          <div className="space-y-3 mb-6">
            {aiOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAISelect(index)}
                className={`w-full py-2 px-4 text-left rounded-md transition-colors ${
                  selectedAI === index 
                    ? "bg-blue-100 border border-blue-500" 
                    : "bg-gray-100 hover:bg-gray-200 text-black"
                }`}
              >
                <div className="font-bold">{option.name}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </button>
            ))}
          </div>
          
          <div className="text-center">
            <button
              onClick={handleSign}
              disabled={selectedAI === null}
              className={`py-2 px-6 rounded-md transition-colors ${
                selectedAI !== null
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Sign the Accord
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-black">Thank You!</h2>
          <p className="text-xl mb-6 text-black">You've signed The AI Accord with {aiOptions[selectedAI!].name}</p>
          <button
            onClick={reset}
            className="py-2 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            Make Another Selection
          </button>
        </div>
      )}
    </div>
  );
}