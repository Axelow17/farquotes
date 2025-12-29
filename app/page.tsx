'use client';

import FarQuotes from '@/components/FarQuotes';
import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if we're in a mini app context
    const checkContext = async () => {
      try {
        const inMiniApp = await sdk.isInMiniApp();
        setIsReady(true);
      } catch (error) {
        console.error('Error checking mini app context:', error);
        setIsReady(true);
      }
    };
    checkContext();
  }, []);

  if (!isReady) {
    return null; // Let the splash screen show
  }

  return <FarQuotes />;
}
