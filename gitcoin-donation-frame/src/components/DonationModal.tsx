import React, { useState } from 'react';
import { X, Heart, ExternalLink } from 'lucide-react';
import { Project } from '../types/project';

interface DonationModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ project, isOpen, onClose }) => {
  const [amount, setAmount] = useState(25);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDonate = async () => {
    setIsLoading(true);
    // Simulate donation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    alert(`Thank you for donating $${amount} to ${project.title}! This would normally open your Celo wallet.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h2>
          <p className="text-gray-600 mb-6">{project.description}</p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Donation Amount (USD)
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[10, 25, 50, 100, 250, 500].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                    amount === preset
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Custom amount"
              min="1"
            />
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleDonate}
              disabled={isLoading || amount < 1}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-blue-600 transition-all"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Heart className="w-5 h-5" />
              )}
              {isLoading ? 'Processing...' : `Donate $${amount}`}
            </button>
            
            <button
              onClick={() => window.open(`https://explorer.gitcoin.co/#/project/${project.id}`, '_blank')}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View on Gitcoin
            </button>
          </div>
          
          <p className="text-center text-xs text-gray-500 mt-4">
            Donations are processed securely via Celo blockchain
          </p>
        </div>
      </div>
    </div>
  );
};