/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare global {
  interface Window {
    sdk?: {
      ready: () => Promise<void>;
      context: Promise<{
        user?: {
          fid: number;
          username?: string;
          displayName?: string;
          pfpUrl?: string;
          bio?: string;
          followerCount?: number;
          followingCount?: number;
        };
      }>;
      actions?: {
        openUrl: (url: string) => Promise<void>;
      };
    };
  }
}

export {};
