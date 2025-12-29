import type { Metadata } from 'next';
import './globals.css';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://farquotes-khaki.vercel.app';

export async function generateMetadata(): Promise<Metadata> {
  // OG image for social sharing (1200x630 - standard OG aspect ratio)
  const defaultOgUrl = `${baseUrl}/api/og?quote=${encodeURIComponent('Create and share beautiful quotes on Farcaster')}&author=FarQuotes&style=card&theme=purple`;
  
  // Embed image for fc:miniapp (1200x800 - 3:2 aspect ratio per miniapp spec)
  const defaultEmbedUrl = `${baseUrl}/api/embed?quote=${encodeURIComponent('Create and share beautiful quotes on Farcaster')}&author=FarQuotes&style=card&theme=purple`;
  
  // Mini App Embed metadata (Base miniapp specification)
  // https://docs.base.org/mini-apps/technical-guides/embeds-and-previews
  const miniappEmbed = {
    version: "next",
    imageUrl: defaultEmbedUrl, // Must be 3:2 aspect ratio
    button: {
      title: "✨ Generate Quote",
      action: {
        type: "launch_frame",
        name: "FarQuotes",
        url: baseUrl
      }
    },
    manifest: `${baseUrl}/manifest.json`
  };

  return {
    title: 'FarQuotes - Share Beautiful Quotes on Farcaster',
    description: 'Create and share beautiful quote images with your Farcaster community. Powered by Farcaster MiniKit.',
    keywords: ['farcaster', 'quotes', 'warpcast', 'social', 'minikit', 'miniapp'],
    authors: [{ name: 'FarQuotes' }],
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: 'FarQuotes - Share Beautiful Quotes on Farcaster',
      description: 'Create and share beautiful quote images with your Farcaster community',
      type: 'website',
      url: baseUrl,
      images: [
        {
          url: defaultOgUrl,
          width: 1200,
          height: 630,
          alt: 'FarQuotes',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'FarQuotes - Share Beautiful Quotes on Farcaster',
      description: 'Create and share beautiful quote images with your Farcaster community',
      images: [defaultOgUrl],
    },
    other: {
      // Mini App embed metadata
      'fc:miniapp': JSON.stringify(miniappEmbed),
    },
  };
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#7c3aed',
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="694eca6ac63ad876c908147b" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
