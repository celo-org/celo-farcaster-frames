import React, { useState } from 'react';
import { Trash2, Plus, Minus, Heart } from 'lucide-react';
import { CartItem } from '../types/project';

interface CartProps {
  items: CartItem[];
  onUpdateAmount: (projectId: string, amount: number) => void;
  onRemoveItem: (projectId: string) => void;
  onDonate: () => void;
}

export const Cart: React.FC<CartProps> = ({ items, onUpdateAmount, onRemoveItem, onDonate }) => {
  const [donationAmounts, setDonationAmounts] = useState<Record<string, number>>({});

  const updateDonationAmount = (projectId: string, amount: number) => {
    const newAmount = Math.max(1, amount);
    setDonationAmounts(prev => ({ ...prev, [projectId]: newAmount }));
    onUpdateAmount(projectId, newAmount);
  };

  const getDonationAmount = (projectId: string) => {
    return donationAmounts[projectId] || 25;
  };

  const totalAmount = items.reduce((sum, item) => {
    return sum + getDonationAmount(item.project.id);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600">Add some projects to start making an impact!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Donation Cart</h2>
        <p className="text-gray-600">Review and adjust your donations before contributing</p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.project.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-start gap-4">
              <img 
                src={item.project.image} 
                alt={item.project.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.project.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.project.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Donation:</span>
                    <div className="flex items-center bg-gray-100 rounded-lg">
                      <button
                        onClick={() => updateDonationAmount(item.project.id, getDonationAmount(item.project.id) - 5)}
                        className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <input
                        type="number"
                        value={getDonationAmount(item.project.id)}
                        onChange={(e) => updateDonationAmount(item.project.id, parseInt(e.target.value) || 0)}
                        className="w-16 text-center bg-transparent py-2 text-sm font-medium"
                        min="1"
                      />
                      <button
                        onClick={() => updateDonationAmount(item.project.id, getDonationAmount(item.project.id) + 5)}
                        className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <span className="font-semibold text-green-600">${getDonationAmount(item.project.id)}</span>
                  </div>
                  
                  <button
                    onClick={() => onRemoveItem(item.project.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg text-gray-600">Total Donation</span>
          <span className="text-3xl font-bold text-green-600">${totalAmount}</span>
        </div>
        
        <button
          onClick={onDonate}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105"
        >
          Donate ${totalAmount} to {items.length} Project{items.length > 1 ? 's' : ''}
        </button>
        
        <p className="text-center text-sm text-gray-500 mt-3">
          Secure donation via Celo blockchain
        </p>
      </div>
    </div>
  );
};