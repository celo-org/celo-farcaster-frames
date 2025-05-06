import { safeParseFrameEmbed } from '@farcaster/frame-core'
import { NextRequest, NextResponse } from 'next/server'

// Extend the message type with the properties we need
interface ExtendedFrameMessage {
  buttonIndex?: number;
  url?: string;
  inputText?: string;
  [key: string]: unknown;
}

const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

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
    
    // Handle the AI Accord entry point from /api/frames/quiz
    if (framePath.includes('/frames/quiz')) {
      return NextResponse.redirect(`${baseUrl}/api/frames/question1`, 302)
    }
    
    // Handle the start quiz button from the main frame
    if (framePath === '/api/frames') {
      return NextResponse.redirect(`${baseUrl}/api/frames/question1`, 302)
    }

    // Default redirect back to the main frame if no specific path is matched
    return NextResponse.redirect(`${baseUrl}/api/frames`, 302)
  } catch (error) {
    console.error('Error processing frame request:', error)
    return new Response('Error processing frame request', { status: 500 })
  }
}