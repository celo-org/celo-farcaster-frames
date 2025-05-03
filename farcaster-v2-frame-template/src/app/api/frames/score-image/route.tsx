import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
 
export const runtime = 'edge'
 
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const score = searchParams.get('score') || '0'
    
    // Calculate message based on score
    const scoreNum = parseInt(score)
    let message = "Thanks for playing!"
    
    if (scoreNum === 50) {
      message = "Perfect score! You're a Celo expert!"
    } else if (scoreNum >= 30) {
      message = "Great job! You know Celo well!"
    } else if (scoreNum >= 10) {
      message = "Good effort! Keep learning about Celo!"
    } else {
      message = "Thanks for playing! Learn more about Celo!"
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#1F2937',
            color: 'white',
            padding: '40px 20px',
            textAlign: 'center',
            fontFamily: '"SF Pro Display", sans-serif',
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 'bold', marginBottom: 10 }}>Quiz Results</div>
          <div style={{ 
            fontSize: 96, 
            fontWeight: 'bold', 
            margin: '20px 0 30px',
            color: '#4CBB17' 
          }}>
            {score}/50
          </div>
          <p style={{ fontSize: 32, marginTop: 20 }}>
            {message}
          </p>
          <div style={{ 
            fontSize: 24, 
            marginTop: 40,
            padding: '10px 20px',
            borderRadius: '8px',
            backgroundColor: '#4338CA',
          }}>
            Play Again
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e) {
    console.error(e)
    return new Response('Failed to generate image', { status: 500 })
  }
}