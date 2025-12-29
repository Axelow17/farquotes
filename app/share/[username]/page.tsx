import { Metadata } from 'next';
import { quotes } from '@/lib/quotes';
import dynamic from 'next/dynamic';

const FarQuotes = dynamic(() => import('@/components/FarQuotes').then(mod => ({ default: mod.default })), {
  ssr: false
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://farquotes-khaki.vercel.app';

export async function generateMetadata(
  { params, searchParams }: { params: Promise<{ username: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
): Promise<Metadata> {
  try {
    const { username } = await params;
    const resolvedSearchParams = await searchParams;
    
    // Get quote by ID if provided, otherwise fall back to full text parameters
    let quote: string;
    let author: string;
    
    const idParam = resolvedSearchParams.id as string;
    if (idParam) {
      const quoteId = parseInt(idParam, 10);
      const quoteData = quotes.find(q => q.id === quoteId);
      if (quoteData) {
        quote = quoteData.text;
        author = quoteData.author;
      } else {
        quote = 'Create and share beautiful quotes on Farcaster';
        author = 'FarQuotes';
      }
    } else {
      // Fallback to full quote/author parameters for backward compatibility
      quote = (resolvedSearchParams.q || resolvedSearchParams.quote) as string || 'Create and share beautiful quotes on Farcaster';
      author = (resolvedSearchParams.a || resolvedSearchParams.author) as string || 'FarQuotes';
    }
    
    const style = (resolvedSearchParams.style as string) || 'card';
    
    // Support bgColor parameter - map hex colors to theme names
    const bgColor = resolvedSearchParams.bgColor as string;
    const themeParam = (resolvedSearchParams.t || resolvedSearchParams.theme) as string;
    
    let actualTheme = 'purple'; // default
    
    // Priority: explicit theme parameter > bgColor mapping > default
    if (themeParam) {
      actualTheme = themeParam;
    } else if (bgColor) {
      const colorToTheme: Record<string, string> = {
        '#7c3aed': 'purple',
        '%237c3aed': 'purple',
        '#ec4899': 'pink',
        '%23ec4899': 'pink',
        '#3b82f6': 'blue',
        '%233b82f6': 'blue',
        '#10b981': 'green',
        '%2310b981': 'green',
        '#f59e0b': 'orange',
        '%23f59e0b': 'orange',
        '#ef4444': 'rose',
        '%23ef4444': 'rose',
        '#8b5cf6': 'purple',
        '%238b5cf6': 'purple',
        '#06b6d4': 'blue',
        '%2306b6d4': 'blue',
        '#6366f1': 'blue',
        '%236366f1': 'blue',
        '#14b8a6': 'mint',
        '%2314b8a6': 'mint',
      };
      const decodedColor = decodeURIComponent(bgColor).toLowerCase();
      actualTheme = colorToTheme[bgColor.toLowerCase()] || colorToTheme[decodedColor] || 'purple';
    }
    
    // Build dynamic OG image URL with parameters
    const ogImageUrl = `${baseUrl}/api/og?` +
      `quote=${encodeURIComponent(quote)}` +
      `&author=${encodeURIComponent(author)}` +
      `&style=${style}` +
      `&theme=${actualTheme}`;

    // Base miniapp embed spec expects a 3:2 image (1200x800)
    const embedImageUrl = `${baseUrl}/api/embed?` +
      `quote=${encodeURIComponent(quote)}` +
      `&author=${encodeURIComponent(author)}` +
      `&style=${style}` +
      `&theme=${actualTheme}`;
    
    // Get quote ID for title if available
    const quoteIdText = idParam ? ` #${idParam}` : '';
    const shareTitle = `FarQuotes${quoteIdText} - ${author}`;
    const shareDescription = quote.length > 100 ? quote.substring(0, 97) + '...' : quote;
    
    // Build the share page URL to use as action URL (so users stay on this page)
    const sharePageUrl = idParam 
      ? `${baseUrl}/share/${username}?id=${idParam}&t=${actualTheme}`
      : `${baseUrl}/share/${username}?quote=${encodeURIComponent(quote)}&author=${encodeURIComponent(author)}&theme=${actualTheme}`;
    
    // Mini App Embed metadata following Base specification
    const miniappEmbed = {
      version: "next",
      imageUrl: embedImageUrl,
      button: {
        title: "✨ Create Your Quote",
        action: {
          type: "launch_frame",
          url: sharePageUrl,
          name: "FarQuotes"
        }
      },
      manifest: `${baseUrl}/manifest.json`
    };
    
    return {
      title: shareTitle,
      description: shareDescription,
      metadataBase: new URL(baseUrl),
      openGraph: {
        title: shareTitle,
        description: shareDescription,
        images: [{
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: quote
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: shareTitle,
        description: shareDescription,
        images: [ogImageUrl],
      },
      other: {
        'fc:miniapp': JSON.stringify(miniappEmbed),
      },
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    console.error('Failed to generate metadata:', errorMessage);
    
    return {
      title: 'FarQuotes',
      description: 'Share beautiful quotes on Farcaster',
    };
  }
}

export default async function SharePage(
  { params, searchParams }: { params: Promise<{ username: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  // Simply render the main FarQuotes component
  // The miniapp will handle everything including the shared quote context
  return <FarQuotes />;
}
