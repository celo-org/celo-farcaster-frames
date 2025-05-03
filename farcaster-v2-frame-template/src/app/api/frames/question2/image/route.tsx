import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export async function GET() {
  try {
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
          <div style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 20 }}>Question 2</div>
          <p style={{ fontSize: 24, margin: '10px 0 30px' }}>
            Which of these is a native stablecoin on Celo?
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            width: '80%',
          }}>
            <div style={{ 
              backgroundColor: '#4338CA', 
              padding: '10px', 
              borderRadius: '8px',
              fontSize: 20
            }}>
              A) cUSD
            </div>
            <div style={{ 
              backgroundColor: '#4338CA', 
              padding: '10px', 
              borderRadius: '8px',
              fontSize: 20
            }}>
              B) cBTC
            </div>
            <div style={{ 
              backgroundColor: '#4338CA', 
              padding: '10px', 
              borderRadius: '8px',
              fontSize: 20
            }}>
              C) cLINK
            </div>
            <div style={{ 
              backgroundColor: '#4338CA', 
              padding: '10px', 
              borderRadius: '8px',
              fontSize: 20
            }}>
              D) cBNB
            </div>
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