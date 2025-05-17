import { Button, FrameContainer, FrameImage, TextInput, useFramesReducer } from 'frames.js/next/server';
import type { NextRequest } from 'next/server';
import { saveUser, getUser, updateUserVisit, addToLeaderboard } from '@/utils/db';

// Define the frame state
type State = {
  page: 'intro' | 'profile' | 'heatmap' | 'weekly' | 'leaderboard';
  username?: string;
};

// Initial state
const initialState: State = {
  page: 'intro',
};

export async function GET(req: NextRequest) {
  // Parse the URL parameters
  const searchParams = req.nextUrl.searchParams;
  const username = searchParams.get('username') || '';
  
  // Create the frame with initial state
  const { frame, state } = useFramesReducer<State>(initialState, reducer);
  
  // Determine what to display based on state
  switch (state.page) {
    case 'intro':
      return (
        <FrameContainer
          frame={frame}
          state={state}
          postUrl="/frames"
        >
          <FrameImage>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#2E3338',
              color: 'white',
              width: '100%',
              height: '100%',
              padding: '20px'
            }}>
              <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
                Show your consistency of building on Celo
              </h1>
              <p style={{ fontSize: '16px', textAlign: 'center', marginBottom: '10px' }}>
                Track your GitHub contribution streak and compete with others in the Celo ecosystem!
              </p>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#35D07F', 
                width: '80%',
                height: '40px',
                borderRadius: '8px',
                marginTop: '20px'
              }}>
                <p style={{ color: 'white', fontWeight: 'bold' }}>
                  Enter your GitHub username to start
                </p>
              </div>
            </div>
          </FrameImage>
          <TextInput placeholder="Enter your GitHub username" />
          <Button actionId="submit-username">Submit</Button>
        </FrameContainer>
      );
      
    case 'profile':
      return (
        <FrameContainer
          frame={frame}
          state={state}
          postUrl="/frames"
        >
          <FrameImage>
            <div style={{ 
              backgroundColor: '#2E3338',
              color: 'white',
              width: '100%',
              height: '100%',
              padding: '20px'
            }}>
              <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
                Welcome, {state.username || 'Developer'}!
              </h1>
              <p style={{ fontSize: '16px', marginBottom: '10px' }}>
                What would you like to see?
              </p>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li style={{ marginBottom: '10px' }}>• Contribution Heatmap</li>
                <li style={{ marginBottom: '10px' }}>• Weekly Summary</li>
                <li style={{ marginBottom: '10px' }}>• Leaderboard</li>
              </ul>
            </div>
          </FrameImage>
          <Button actionId="show-heatmap">View Heatmap</Button>
          <Button actionId="show-weekly">Weekly Summary</Button>
          <Button actionId="show-leaderboard">View Leaderboard</Button>
        </FrameContainer>
      );
      
    case 'heatmap':
      return (
        <FrameContainer
          frame={frame}
          state={state}
          postUrl="/frames"
        >
          <FrameImage src={`${process.env.NEXT_PUBLIC_HOST}/api/heatmap/${state.username}`} />
          <Button actionId="back-to-profile">Back</Button>
          <Button actionId="show-weekly">Weekly Summary</Button>
          <Button actionId="show-leaderboard">Leaderboard</Button>
        </FrameContainer>
      );
      
    case 'weekly':
      return (
        <FrameContainer
          frame={frame}
          state={state}
          postUrl="/frames"
        >
          <FrameImage src={`${process.env.NEXT_PUBLIC_HOST}/api/weekly/${state.username}`} />
          <Button actionId="back-to-profile">Back</Button>
          <Button actionId="show-heatmap">View Heatmap</Button>
          <Button actionId="show-leaderboard">Leaderboard</Button>
        </FrameContainer>
      );
      
    case 'leaderboard':
      return (
        <FrameContainer
          frame={frame}
          state={state}
          postUrl="/frames"
        >
          <FrameImage src={`${process.env.NEXT_PUBLIC_HOST}/api/leaderboard`} />
          <Button actionId="back-to-profile">Back</Button>
          <Button actionId="show-heatmap">View Heatmap</Button>
          <Button actionId="show-weekly">Weekly Summary</Button>
        </FrameContainer>
      );
  }
}

// Reducer function to handle actions
function reducer(state: State, action: any): State {
  const { buttonIndex, inputText, fid } = action;
  
  // Handle the initial username submission
  if (buttonIndex === 1 && action.actionId === 'submit-username') {
    const username = inputText.trim();
    
    if (username) {
      // Store the username in our database
      if (fid) {
        saveUser(fid.toString(), username);
        addToLeaderboard(username);
      }
      
      return {
        ...state,
        page: 'profile',
        username,
      };
    }
    
    return state;
  }
  
  // If a user is returning, update their visit streak
  if (fid) {
    updateUserVisit(fid.toString());
  }
  
  // Handle navigation between pages
  if (buttonIndex === 1 && action.actionId === 'back-to-profile') {
    return { ...state, page: 'profile' };
  }
  
  if (buttonIndex === 1 && action.actionId === 'show-heatmap') {
    return { ...state, page: 'heatmap' };
  }
  
  if (buttonIndex === 2 && action.actionId === 'show-weekly') {
    return { ...state, page: 'weekly' };
  }
  
  if (buttonIndex === 3 || (buttonIndex === 2 && action.actionId === 'show-leaderboard')) {
    return { ...state, page: 'leaderboard' };
  }
  
  return state;
}

// POST handler for frame actions
export async function POST(req: Request) {
  const body = await req.json();
  const { frame, state, action } = await useFramesReducer<State>(
    initialState,
    reducer,
    body
  );
  
  return frame.response(state);
}