import { useState} from 'react';
import { Header } from './components/Header';
import { ProjectGrid } from './components/ProjectGrid';
import { Cart } from './components/Cart';
import { DonationModal } from './components/DonationModal';
import { mockProjects } from './data/projects';
import { Project, CartItem } from './types/project';

type View = 'projects' | 'cart';
type Mode = 'simple' | 'advanced';

function App() {
  const [currentView, setCurrentView] = useState<View>('projects');
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [mode, setMode] = useState<Mode>('advanced');

  const addToCart = (project: Project) => {
    if (!cartItems.find(item => item.project.id === project.id)) {
      setCartItems(prev => [...prev, { project, donationAmount: 25 }]);
    }
  };

  const removeFromCart = (projectId: string) => {
    setCartItems(prev => prev.filter(item => item.project.id !== projectId));
  };

  const updateCartAmount = (projectId: string, amount: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.project.id === projectId 
          ? { ...item, donationAmount: amount }
          : item
      )
    );
  };

  const handleNext = () => {
    if (currentProjectIndex < mockProjects.length - 1) {
      setCurrentProjectIndex(prev => prev + 1);
    }
  };

  const handleDonate = (project: Project) => {
    setSelectedProject(project);
    setShowDonationModal(true);
  };

  const handleSeeProject = (project: Project) => {
    window.open(`https://explorer.gitcoin.co/#/project/${project.id}`, '_blank');
  };

  const handleCartDonate = () => {
    const total = cartItems.reduce((sum, item) => sum + item.donationAmount, 0);
    alert(`Thank you for donating $${total} to ${cartItems.length} projects! This would normally open your Celo wallet.`);
    setCartItems([]);
    setCurrentView('projects');
  };

  const cartProjectIds = cartItems.map(item => item.project.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Header
        title={mode === 'simple' ? 'Gitcoin Project' : 'Gitcoin Real World Builders Round'}
        cartCount={cartItems.length}
        onViewCart={() => setCurrentView('cart')}
        onBack={currentView === 'cart' ? () => setCurrentView('projects') : undefined}
        showCart={mode === 'advanced'}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setMode('simple')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                mode === 'simple'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Simple Flow
            </button>
            <button
              onClick={() => setMode('advanced')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                mode === 'advanced'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Advanced Flow
            </button>
          </div>
        </div>

        {currentView === 'projects' ? (
          <ProjectGrid
            projects={mockProjects}
            currentIndex={currentProjectIndex}
            mode={mode}
            cartItems={cartProjectIds}
            onAddToCart={addToCart}
            onDonate={handleDonate}
            onSeeProject={handleSeeProject}
            onNext={handleNext}
          />
        ) : (
          <Cart
            items={cartItems}
            onUpdateAmount={updateCartAmount}
            onRemoveItem={removeFromCart}
            onDonate={handleCartDonate}
          />
        )}
      </main>

      <DonationModal
        project={selectedProject!}
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
      />
    </div>
  );
}

export default App;