import React from 'react';
import { Heart, Users, Target, ExternalLink, ShoppingCart, Eye } from 'lucide-react';
import { Project } from '../types/project';

interface ProjectCardProps {
  project: Project;
  mode: 'simple' | 'advanced';
  onAddToCart?: () => void;
  onDonate: () => void;
  onSeeProject: () => void;
  isInCart?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  mode,
  onAddToCart,
  onDonate,
  onSeeProject,
  isInCart = false
}) => {
  const progressPercentage = (parseInt(project.amountRaised.replace(/[^0-9]/g, '')) / parseInt(project.goal.replace(/[^0-9]/g, ''))) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {project.category}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-green-600">{project.amountRaised}</span>
            <span className="text-gray-500">of {project.goal}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-1" />
            <span className="text-sm">{project.contributors} contributors</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Target className="w-4 h-4 mr-1" />
            <span className="text-sm">{Math.round(progressPercentage)}% funded</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          {mode === 'simple' ? (
            <>
              <button
                onClick={onSeeProject}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                <Eye className="w-4 h-4" />
                See Project
              </button>
              <button
                onClick={onDonate}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all"
              >
                <Heart className="w-4 h-4" />
                Donate
              </button>
            </>
          ) : (
            <button
              onClick={onAddToCart}
              disabled={isInCart}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                isInCart 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isInCart ? 'Added to Cart' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};