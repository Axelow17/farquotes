# Dynamic Embed Images - Testing Guide

## 🎯 What Was Implemented

We've added dynamic embed image generation for FarQuotes, following Farcaster's best practices:

### 1. **Dynamic OG Image API** - `/api/og/[username]/route.tsx`
- Generates unique images for each user
- Accepts query parameters: `quote`, `author`, `color`
- Returns 1200x630 images optimized for Farcaster embeds
- Example: `/api/og/alice?quote=Hello&author=Alice&color=0`

### 2. **Shareable Pages** - `/share/[username]/page.tsx`
- Dynamic metadata with `fc:miniapp` for each user
- Personalized OG images in the feed
- Beautiful landing page for web visitors
- Example: `/share/alice`

### 3. **Enhanced Share Flow** - `components/FarQuotes.tsx`
- `composeCast` now uses personalized share URLs
- Each share creates a unique embed with the user's name
- Dynamic quote, author, and color in the embed
- Fallback to image upload if needed

## 🧪 Testing Locally

### 1. Start the development server:
```bash
npm run dev
```

### 2. Test the OG image endpoint:
```bash
# Visit in browser or use curl
http://localhost:3000/api/og/testuser

# With parameters
http://localhost:3000/api/og/alice?quote=Hello+World&author=Alice&color=2
```

### 3. Test the share page:
```bash
# Visit in browser
http://localhost:3000/share/testuser

# Check metadata
curl http://localhost:3000/share/testuser | grep "fc:miniapp"
```

### 4. Test the full flow:
1. Open `http://localhost:3000` in your browser
2. Generate a quote
3. Click "Share to Cast"
4. The compose window should open with your personalized link like:
   `http://localhost:3000/share/yourname?quote=...&author=...&color=0`

## 🚀 Testing in Production

### 1. Deploy to Vercel:
```bash
npx vercel --prod
```

### 2. Update environment variable:
```bash
# In Vercel dashboard or CLI
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

### 3. Sign the manifest:
1. Visit https://farcaster.xyz/~/developers/mini-apps/manifest?domain=your-domain.vercel.app
2. Sign with your Farcaster account
3. Update `public/.well-known/farcaster.json` with signed values

### 4. Test with Farcaster Preview:
```bash
https://farcaster.xyz/~/developers/mini-apps/preview?url=https://your-domain.vercel.app/share/alice
```

## 📊 How It Works

```
User clicks "Share" 
    ↓
composeCast opens with:
  text: "Quote text..."
  embeds: ["https://your-app.com/share/username?quote=...&author=..."]
    ↓
Farcaster reads the /share/username page
    ↓
Extracts fc:miniapp metadata with imageUrl: /api/og/username?...
    ↓
Fetches the dynamic image from /api/og/username
    ↓
Displays beautiful embed with:
  - Personalized quote image
  - User's name
  - Launch button to open the app
```

## ✨ Features

### Dynamic Embeds:
- ✅ Unique image for each user
- ✅ Custom quote and author in embed
- ✅ 10 different gradient colors
- ✅ "Shared by @username" branding

### Viral Loop:
- ✅ Each share promotes the app
- ✅ Launch button in every embed
- ✅ Personalized for higher engagement
- ✅ Works with Farcaster's feed algorithm

### Fallbacks:
- ✅ ImgBB image upload backup
- ✅ Text-only share if image fails
- ✅ Browser window.open as last resort

## 🐛 Troubleshooting

### Embed not showing?
- Check `NEXT_PUBLIC_BASE_URL` is set correctly
- Verify manifest is signed properly
- Test OG image endpoint directly

### Image not loading?
- Check the image returns 200 status
- Verify 1200x630 dimensions
- Ensure ImageResponse has proper structure

### composeCast not working?
- Make sure you're in Farcaster app
- Check SDK is initialized (sdk.actions.ready())
- Test in production (some features don't work in dev)

## 📚 Next Steps

1. **Analytics**: Track share clicks and conversions
2. **A/B Testing**: Test different OG image designs
3. **Rewards**: Incentivize sharing with tokens
4. **Collections**: Let users save favorite quotes
5. **Leaderboard**: Show top sharers

## 🎓 Resources

- [Farcaster Mini Apps Docs](https://docs.base.org/mini-apps)
- [Dynamic Embeds Guide](https://docs.base.org/mini-apps/guides/generate-embeds)
- [@vercel/og Documentation](https://vercel.com/docs/functions/og-image-generation)
