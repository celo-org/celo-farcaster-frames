import { Project } from '../types/project';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'DeFi Education Platform',
    description: 'Building accessible DeFi education resources for underserved communities worldwide.',
    amount: '$2,450',
    amountRaised: '$2,450',
    goal: '$10,000',
    contributors: 42,
    category: 'Education',
    image: 'https://images.pexels.com/photos/6329956/pexels-photo-6329956.jpeg?auto=compress&cs=tinysrgb&w=800',
    roundName: 'Real World Builders Round'
  },
  {
    id: '2',
    title: 'Climate Impact DAO',
    description: 'Decentralized organization funding renewable energy projects in developing nations.',
    amount: '$5,890',
    amountRaised: '$5,890',
    goal: '$25,000',
    contributors: 127,
    category: 'Climate',
    image: 'https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg?auto=compress&cs=tinysrgb&w=800',
    roundName: 'Real World Builders Round'
  },
  {
    id: '3',
    title: 'Web3 Healthcare Registry',
    description: 'Blockchain-based medical records system for improved patient data portability.',
    amount: '$3,200',
    amountRaised: '$3,200',
    goal: '$15,000',
    contributors: 89,
    category: 'Healthcare',
    image: 'https://images.pexels.com/photos/4099468/pexels-photo-4099468.jpeg?auto=compress&cs=tinysrgb&w=800',
    roundName: 'Real World Builders Round'
  },
  {
    id: '4',
    title: 'Decentralized Supply Chain',
    description: 'Transparent supply chain tracking system for ethical sourcing verification.',
    amount: '$1,800',
    amountRaised: '$1,800',
    goal: '$8,000',
    contributors: 34,
    category: 'Supply Chain',
    image: 'https://images.pexels.com/photos/8728382/pexels-photo-8728382.jpeg?auto=compress&cs=tinysrgb&w=800',
    roundName: 'Real World Builders Round'
  }
];