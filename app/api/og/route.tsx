import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Color schemes
const colorSchemes = {
  purple: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#667eea' },
  pink: { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', accent: '#f093fb' },
  blue: { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', accent: '#4facfe' },
  green: { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', accent: '#43e97b' },
  orange: { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', accent: '#fa709a' },
  dark: { bg: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', accent: '#30cfd0' },
  mint: { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', accent: '#a8edea' },
  rose: { bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', accent: '#ff9a9e' },
  peach: { bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', accent: '#ffecd2' },
  sunset: { bg: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)', accent: '#ff6e7f' },
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Dynamic parameters
    const quote = searchParams.get('quote') || 'Create and share beautiful quotes on Farcaster';
    const author = searchParams.get('author') || 'FarQuotes';
    const theme = searchParams.get('theme') || 'purple';
    const style = searchParams.get('style') || 'card'; // card, minimal, bold
    
    const colors = colorSchemes[theme as keyof typeof colorSchemes] || colorSchemes.purple;

    // Card style (default)
    if (style === 'card') {
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
              background: colors.bg,
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
              <div
                style={{
                  display: 'flex',
                  fontSize: 100,
                  color: colors.accent,
                  fontFamily: 'Georgia, serif',
                  lineHeight: '1',
                  marginBottom: '20px',
                  opacity: 0.3,
                }}
              >
                "
              </div>
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
            <div
              style={{
                display: 'flex',
                marginTop: '40px',
                fontSize: 28,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              ✨ FarQuotes
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    // Minimal style
    if (style === 'minimal') {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'white',
              padding: '80px',
            }}
          >
            <div style={{ display: 'flex', fontSize: 32, color: colors.accent, fontWeight: 'bold' }}>
              FarQuotes
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 56,
                  color: '#111827',
                  lineHeight: '1.3',
                  fontWeight: 600,
                }}
              >
                {quote}
              </div>
              <div style={{ display: 'flex', fontSize: 32, color: '#6b7280' }}>— {author}</div>
            </div>
            <div style={{ display: 'flex', fontSize: 24, color: '#9ca3af' }}>Share on Farcaster</div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    // Bold style
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: colors.bg,
            padding: '100px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 72,
                fontWeight: 900,
                color: 'white',
                lineHeight: '1.2',
                textShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              {quote}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 40,
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 600,
              }}
            >
              — {author}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: '40px',
                fontSize: 32,
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              ✨ FarQuotes
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
