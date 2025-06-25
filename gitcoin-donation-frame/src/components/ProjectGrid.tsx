import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { Project } from '../types/project';

interface ProjectGridProps {
  projects: Project[];
  currentIndex: number;
  mode: 'simple' | 'advanced';
  cartItems: string[];
  onAddToCart: (project: Project) => void;
  onDonate: (project: Project) => void;
  onSeeProject: (project: Project) => void;
  onNext: () => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  currentIndex,
  mode,
  cartItems,
  onAddToCart,
  onDonate,
  onSeeProject,
  onNext
}) => {
  const currentProject = projects[currentIndex];

  if (!currentProject) return null;

  return (
    <div className="space-y-6">
      {mode === 'advanced' && (
        <div className="text-center">
          <div className="inline-flex items-center bg-white rounded-full px-4 py-2 shadow-sm border">
            <span className="text-sm text-gray-600">
              Project {currentIndex + 1} of {projects.length}
            </span>
          </div>
        </div>
      )}
      
      <div className="max-w-md mx-auto">
        <ProjectCard
          project={currentProject}
          mode={mode}
          onAddToCart={() => onAddToCart(currentProject)}
          onDonate={() => onDonate(currentProject)}
          onSeeProject={() => onSeeProject(currentProject)}
          isInCart={cartItems.includes(currentProject.id)}
        />
      </div>
      
      {mode === 'advanced' && currentIndex < projects.length - 1 && (
        <div className="text-center">
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm border"
          >
            Next Project
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};