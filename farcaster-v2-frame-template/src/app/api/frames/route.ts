import { safeParseFrameEmbed } from '@farcaster/frame-core'
import { NextRequest, NextResponse } from 'next/server'

// Extend the message type with the properties we need
interface ExtendedFrameMessage {
  buttonIndex?: number;
  url?: string;
  inputText?: string;
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
    
    // Handle the AI Accord entry point from /api/frames/quiz
    if (framePath.includes('/frames/quiz')) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/api/frames/accord`, 302)
    }
    
    // Handle the start accord button from the main frame
    if (framePath === '/frames') {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/api/frames/accord`, 302)
    }
    
    // Default fallback - go to the AI Accord selection page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/api/frames/accord`, 302)
  } catch (error) {
    console.error('Error handling frame request:', error)
    return NextResponse.json({ error: 'Failed to process frame request' }, { status: 500 })
  }
}