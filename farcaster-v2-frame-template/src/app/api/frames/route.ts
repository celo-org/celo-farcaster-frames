import { safeParseFrameEmbed } from '@farcaster/frame-core'
import { NextRequest, NextResponse } from 'next/server'
import { incrementUserScore, storeUserAnswer, getUserScore, resetUserData } from '~/lib/state'

/**
 * Handle frame requests with scoring support
 */
export async function POST(req: NextRequest) {
  try {
    // Parse the frame request
    const body = await req.json()
    const result = safeParseFrameEmbed(body)
    
    if (!result.success) {
      return new Response('Invalid frame request', { status: 400 })
    }
    
    const message = result.data
    // Use a default userId since we might not have access to fid in frame data
    const userId = 'anonymous-user'
    // Get button index from the message when available or default to 1
    const buttonIndex = message.buttonIndex || 1
    
    // Get the path from the frame URL
    const framePath = new URL(message.url || '').pathname
    const questionId = framePath.split('/').pop() || 'unknown'
    
    // Process the user's answer
    if (framePath.includes('/question')) {
      // Store the answer
      await storeUserAnswer(userId, questionId, buttonIndex.toString())
      
      // Give points based on the answer (you can customize this scoring logic)
      if (isCorrectAnswer(questionId, buttonIndex)) {
        await incrementUserScore(userId, 10) // 10 points for correct answer
      }
      
      // Determine the next question or if we should show results
      const nextQuestionOrResult = getNextQuestion(questionId)
      
      // Build the next frame response
      return buildFrameResponse(nextQuestionOrResult, userId)
    } 
    else if (framePath.includes('/result')) {
      // Handle actions on the result screen
      if (buttonIndex === 1) {
        // Reset button was pressed, move back to first question
        await resetUserData(userId)
        return buildFrameResponse('question1', userId)
      }
    }
    
    // Default to showing the first question
    return buildFrameResponse('question1', userId)
  } catch (error) {
    console.error('Error handling frame request:', error)
    return NextResponse.json({ error: 'Failed to process frame request' }, { status: 500 })
  }
}

/**
 * Check if the user's answer is correct
 */
function isCorrectAnswer(questionId: string, buttonIndex: number): boolean {
  // Define correct answers for each question
  const correctAnswers: Record<string, number> = {
    'question1': 2, // Option 2 is correct for question 1 (Financial inclusion)
    'question2': 1, // Option 1 is correct for question 2 (cUSD)
    'question3': 3, // Example: Option 3 is correct for question 3
    'question4': 2, // Example: Option 2 is correct for question 4
    'question5': 4, // Example: Option 4 is correct for question 5
  }
  
  return buttonIndex === correctAnswers[questionId]
}

/**
 * Get the next question based on the current one
 */
function getNextQuestion(currentQuestion: string): string {
  const questions = ['question1', 'question2', 'question3', 'question4', 'question5']
  const currentIndex = questions.indexOf(currentQuestion)
  
  if (currentIndex === -1 || currentIndex === questions.length - 1) {
    return 'result' // Go to results if we're at the last question
  }
  
  return questions[currentIndex + 1] // Go to next question
}

/**
 * Build a frame response
 */
async function buildFrameResponse(path: string, userId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://your-vercel-domain.vercel.app'
  
  let frameMetadata
  
  if (path === 'result') {
    // Get the user's score and answers for the result page
    const score = await getUserScore(userId)
    
    frameMetadata = {
      frames: {
        version: '1',
        image: `${baseUrl}/api/frames/score-image?score=${score}`,
        buttons: [
          {
            label: 'Play Again',
            action: 'post'
          },
          {
            label: 'Share Results',
            action: 'post_redirect'
          }
        ],
        post_url: `${baseUrl}/api/frames`
      }
    }
  } else {
    // Regular question frame
    frameMetadata = {
      frames: {
        version: '1',
        image: `${baseUrl}/api/frames/${path}/image`,
        buttons: [
          {
            label: 'Option 1',
            action: 'post'
          },
          {
            label: 'Option 2',
            action: 'post'
          },
          {
            label: 'Option 3',
            action: 'post'
          },
          {
            label: 'Option 4',
            action: 'post'
          }
        ],
        post_url: `${baseUrl}/api/frames`
      }
    }
  }
  
  return NextResponse.json(frameMetadata)
}