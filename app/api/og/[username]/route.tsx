import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Gradient backgrounds
const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const { searchParams } = new URL(request.url);
    
    // Get parameters from URL - support both quote and default message
    const quote = searchParams.get('quote') || `Join me on FarQuotes! Share beautiful quotes on Farcaster 🎩✨`;
    const author = searchParams.get('author') || username || 'FarQuotes';
    const colorIndex = parseInt(searchParams.get('color') || Math.floor(Math.random() * 10).toString()) % gradients.length;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: gradients[colorIndex],
            fontSize: 32,
            fontWeight: 600,
            padding: '80px',
          }}
        >
          {/* Quote Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '24px',
              padding: '60px',
              maxWidth: '900px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Quote Mark */}
            <div
              style={{
                display: 'flex',
                fontSize: 120,
                color: gradients[colorIndex].includes('#667eea') ? '#667eea' : '#f093fb',
                fontFamily: 'Georgia, serif',
                lineHeight: '1',
                marginBottom: '20px',
                opacity: 0.3,
              }}
            >
              "
            </div>

            {/* Quote Text */}
            <div
              style={{
                display: 'flex',
                fontSize: 42,
                color: '#1f2937',
                lineHeight: '1.4',
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                marginBottom: '30px',
                textAlign: 'center',
              }}
            >
              {quote}
            </div>

            {/* Author */}
            <div
              style={{
                display: 'flex',
                fontSize: 32,
                color: '#6b7280',
                fontWeight: 600,
                fontFamily: 'system-ui, sans-serif',
                textAlign: 'center',
                justifyContent: 'center',
              }}
            >
              — {author}
            </div>
          </div>

          {/* Branding */}
          <div
            style={{
              display: 'flex',
              marginTop: '40px',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 48,
                color: 'white',
                fontFamily: 'Georgia, serif',
                fontWeight: 'bold',
              }}
            >
              "
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                color: 'white',
              }}
            >
              <div style={{ display: 'flex', fontSize: 32, fontWeight: 'bold' }}>
                FarQuotes
              </div>
              <div style={{ display: 'flex', fontSize: 20, opacity: 0.9 }}>
                Shared by @{username || 'anonymous'}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error('Error generating OG image:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
