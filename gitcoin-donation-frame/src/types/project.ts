export interface Project {
  id: string;
  title: string;
  description: string;
  amount: string;
  amountRaised: string;
  goal: string;
  contributors: number;
  category: string;
  image: string;
  roundName?: string;
}

export interface CartItem {
  project: Project;
  donationAmount: number;
}