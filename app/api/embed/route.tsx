import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

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

    const quote = searchParams.get('quote') || 'Create and share beautiful quotes on Farcaster';
    const author = searchParams.get('author') || 'FarQuotes';
    const theme = searchParams.get('theme') || 'purple';
    const style = searchParams.get('style') || 'card'; // card | minimal | bold

    const colors = colorSchemes[theme as keyof typeof colorSchemes] || colorSchemes.purple;

    // Base miniapp embed spec asks for 3:2 aspect ratio.
    // We render at 1200x800 (3:2).
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
              padding: '90px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 34,
                color: colors.accent,
                fontWeight: 800,
              }}
            >
              FarQuotes
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '22px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 60,
                  color: '#111827',
                  lineHeight: '1.25',
                  fontWeight: 700,
                }}
              >
                {quote}
              </div>
              <div style={{ display: 'flex', fontSize: 34, color: '#6b7280' }}>— {author}</div>
            </div>

            <div style={{ display: 'flex', fontSize: 26, color: '#9ca3af' }}>Open in FarQuotes</div>
          </div>
        ),
        { width: 1200, height: 800 }
      );
    }

    if (style === 'bold') {
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
              padding: '110px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '46px',
                maxWidth: '980px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 74,
                  fontWeight: 900,
                  color: 'white',
                  lineHeight: '1.15',
                  textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                {quote}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 42,
                  color: 'rgba(255,255,255,0.92)',
                  fontWeight: 700,
                }}
              >
                — {author}
              </div>
              <div style={{ display: 'flex', fontSize: 30, color: 'rgba(255,255,255,0.85)' }}>✨ FarQuotes</div>
            </div>
          </div>
        ),
        { width: 1200, height: 800 }
      );
    }

    // card (default)
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
            padding: '90px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '26px',
              padding: '70px',
              maxWidth: '980px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 110,
                color: colors.accent,
                fontFamily: 'Georgia, serif',
                lineHeight: '1',
                marginBottom: '16px',
                opacity: 0.25,
              }}
            >
              "
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: 54,
                color: '#1f2937',
                lineHeight: '1.32',
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
                fontSize: 36,
                color: '#6b7280',
                fontWeight: 700,
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
      { width: 1200, height: 800 }
    );
  } catch (e) {
    console.error('Error generating embed image:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
