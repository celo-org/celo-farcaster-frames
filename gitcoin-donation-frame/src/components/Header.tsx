import React from 'react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  cartCount: number;
  onViewCart: () => void;
  onBack?: () => void;
  showCart?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  cartCount, 
  onViewCart, 
  onBack,
  showCart = true 
}) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>
          
          {showCart && (
            <button
              onClick={onViewCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              View Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};