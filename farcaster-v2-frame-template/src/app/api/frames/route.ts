import { safeParseFrameEmbed } from '@farcaster/frame-core'
import { NextRequest, NextResponse } from 'next/server'

// Extend the message type with the properties we need
interface ExtendedFrameMessage {
  buttonIndex?: number;
  url?: string;
  // Use unknown instead of any for better type safety
  [key: string]: unknown;
}

/**
 * Handle frame requests with frame navigation and state
 */
export async function POST(req: NextRequest) {
  try {
    // Parse the frame request
    const body = await req.json()
    const result = safeParseFrameEmbed(body)
    
    if (!result.success) {
      return new Response('Invalid frame request', { status: 400 })
    }
    
    const message = result.data as unknown as ExtendedFrameMessage
    // Get button index from the message when available or default to 1
    const buttonIndex = message.buttonIndex || 1
    
    // Get the path from the frame URL
    const url = message.url || ''
    const framePath = new URL(url).pathname
    
    // Handle the quiz entry point from /api/frames/quiz
    if (framePath.includes('/frames/quiz')) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/api/frames/question1`, 302)
    }
    
    // Handle result page actions
    if (framePath.includes('/result')) {
      if (buttonIndex === 2) {
        // Retake Quiz button was pressed (button index 2)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/api/frames/question1`, 302)
      } else {
        // Share Results button was pressed (button index 1) - just stay on the result page
        // This could be enhanced to share to social media, etc.
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/api/frames/result?${new URL(url).search}`, 302)
      }
    }
    
    // Handle the start quiz button from the main frame
    if (framePath === '/frames') {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/api/frames/question1`, 302)
    }
    
    // For individual question responses, extract question number and redirect to next question
    const questionMatch = framePath.match(/\/question(\d+)/)
    if (questionMatch) {
      const currentQuestionNum = parseInt(questionMatch[1])
      const nextQuestionNum = currentQuestionNum + 1
      
      // If this is the last question (5), redirect to result
      if (currentQuestionNum === 5) {
        // Pass all previous answers and the current answer to the result page
        const searchParams = new URL(url).searchParams
        searchParams.append(`q${currentQuestionNum}`, buttonIndex.toString())
        
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_URL}/api/frames/result?${searchParams.toString()}`, 
          302
        )
      } else {
        // Pass all previous answers and the current answer to the next question
        const searchParams = new URL(url).searchParams
        searchParams.append(`q${currentQuestionNum}`, buttonIndex.toString())
        
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_URL}/api/frames/question${nextQuestionNum}?${searchParams.toString()}`, 
          302
        )
      }
    }
    
    // Default fallback - go to question 1
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/api/frames/question1`, 302)
  } catch (error) {
    console.error('Error handling frame request:', error)
    return NextResponse.json({ error: 'Failed to process frame request' }, { status: 500 })
  }
}