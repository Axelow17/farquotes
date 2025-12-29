# FarQuotes - Farcaster Mini App 🎩✨

A beautiful quote-sharing Mini App built for Farcaster with full SDK integration, dynamic OpenGraph images, and seamless sharing capabilities.

## ✨ Features

- 🎨 **Dynamic OpenGraph Images** - Server-generated OG images for each quote
- 🎩 **Full Farcaster Mini App SDK Integration** - Uses official `@farcaster/miniapp-sdk`
- 📱 **Responsive Design** - Works perfectly on mobile and desktop
- 🔄 **50+ Inspirational Quotes** - Random quotes from famous authors
- 🖼️ **Canvas-based Image Generation** - Create beautiful quote cards
- 🔗 **One-Click Sharing** - Compose casts directly from the app
- 🎯 **Proper Manifest** - Fully compliant with Farcaster Mini App specification
- 🚀 **Production Ready** - Includes webhooks, notifications support, and more

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or higher
- npm, pnpm, or yarn
- ImgBB API key (free at [imgbb.com](https://api.imgbb.com))
- Farcaster account for testing

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Edit `.env.local`:
   ```
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   IMGBB_API_KEY=your_imgbb_api_key_here
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `IMGBB_API_KEY`: Your ImgBB API key
     - `NEXT_PUBLIC_BASE_URL`: Will be auto-set by Vercel
   - Deploy!

3. **Update Domain Configuration:**
   
   After deployment, update these files with your Vercel domain:
   
   **`.env.local`:**
   ```
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```
   
   **`public/.well-known/farcaster.json`:**
   - Replace all `YOUR_DOMAIN` with your actual domain (8 occurrences)
   - Example: `https://your-app.vercel.app`

4. **Sign Your Manifest:**
   - Visit: `https://farcaster.xyz/~/developers/mini-apps/manifest?domain=your-app.vercel.app`
   - Follow the signing process
   - Copy the signed values (accountAssociation, signature, fields)
   - Update `public/.well-known/farcaster.json`:
     - Replace `REPLACE_WITH_SIGNED_ACCOUNT_ASSOCIATION`
     - Replace `REPLACE_WITH_SIGNED_SIGNATURE`
     - Replace `REPLACE_WITH_SIGNED_FIELDS`

5. **Redeploy:**
   ```bash
   git add .
   git commit -m "Update domain and manifest signing"
   git push
   ```

## 📋 Farcaster Mini App Setup

### 1. Enable Developer Mode

1. Visit [https://farcaster.xyz/~/settings/developer-tools](https://farcaster.xyz/~/settings/developer-tools)
2. Toggle on "Developer Mode"

### 2. Sign Your Manifest

1. Deploy your app to production
2. Visit the [Manifest Tool](https://farcaster.xyz/~/developers/mini-apps/manifest)
3. Enter your domain
4. Sign the manifest with your Farcaster account
5. Copy the signed `accountAssociation` object
6. Update `public/.well-known/farcaster.json` with your signed data

### 3. Update Manifest URLs

Replace `YOUR_DOMAIN` in `public/.well-known/farcaster.json` with your actual domain:

```json
{
  "miniapp": {
    "iconUrl": "https://your-domain.com/.well-known/icon.png",
    "homeUrl": "https://your-domain.com",
    ...
  }
}
```

### 4. Test Your Mini App

Use the [Preview Tool](https://farcaster.xyz/~/developers/mini-apps/preview) to test your app:

```
https://farcaster.xyz/~/developers/mini-apps/preview?url=https://your-domain.com
```

## 🔧 Configuration

### Dynamic OpenGraph

The app uses Next.js Image Response API to generate dynamic OG images at `/api/og`.

Parameters:
- `quote` - The quote text
- `author` - Quote author
- `color` - Gradient color index (0-9)
- `username` - Farcaster username for attribution

Example:
```
https://your-domain.com/api/og?quote=Hello&author=World&color=0&username=alice
```

### Mini App Embed Metadata

Each page includes proper `fc:miniapp` meta tags for embedding in casts:

```typescript
const miniappEmbed = {
  version: "1",
  imageUrl: "https://your-domain.com/api/og",
  button: {
    title: "✨ Generate Quote",
    action: {
      type: "launch_frame",
      name: "FarQuotes",
      url: "https://your-domain.com",
      splashImageUrl: "https://your-domain.com/logo.svg",
      splashBackgroundColor: "#7c3aed"
    }
  }
};
```

## 🎯 Farcaster SDK Features Used

- ✅ `sdk.actions.ready()` - Hide splash screen
- ✅ `sdk.actions.composeCast()` - Create casts with quotes
- ✅ `sdk.actions.viewProfile()` - View user profiles
- ✅ `sdk.actions.openUrl()` - Open external URLs
- ✅ `sdk.context.user` - Get user information
- ✅ `sdk.context.location` - Get launch context
- ✅ `sdk.isInMiniApp()` - Detect mini app environment

## 📦 Project Structure

```
farquotes/
├── app/
│   ├── api/
│   │   ├── og/
│   │   │   └── route.tsx       # Dynamic OG image generation
│   │   ├── upload/
│   │   │   └── route.ts        # Image upload API
│   │   ├── webhook/
│   │   │   └── route.ts        # Farcaster webhooks
│   │   └── health/
│   │       └── route.ts        # Health check
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/
│   └── FarQuotes.tsx           # Main component
├── public/
│   ├── .well-known/
│   │   └── farcaster.json      # Mini App manifest
│   ├── manifest.json           # PWA manifest
│   └── logo.svg                # App logo
└── README.md
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Deploy to Vercel:**
   ```bash
   npx vercel --prod
   ```

2. **Set environment variables in Vercel:**
   - `NEXT_PUBLIC_BASE_URL` - Your production domain
   - `IMGBB_API_KEY` - Your ImgBB API key

3. **Update manifest:**
   - Sign your manifest at the [Manifest Tool](https://farcaster.xyz/~/developers/mini-apps/manifest)
   - Update `public/.well-known/farcaster.json` with signed data
   - Redeploy

### Custom Domain

If using a custom domain, make sure to:
1. Update `NEXT_PUBLIC_BASE_URL` in environment variables
2. Re-sign your manifest with the new domain
3. Update all URLs in `farcaster.json`

## 🧪 Testing

### Local Testing with Tunnels

```bash
# Using ngrok
ngrok http 3000

# Test in preview tool
https://farcaster.xyz/~/developers/mini-apps/preview?url=https://your-ngrok-url.ngrok.io
```

**Note:** Some SDK actions like `composeCast` require a production domain.

## 📚 Documentation

- [Farcaster Mini Apps Docs](https://miniapps.farcaster.xyz/)
- [Mini App SDK Reference](https://miniapps.farcaster.xyz/docs/sdk)
- [Manifest Specification](https://miniapps.farcaster.xyz/docs/specification#manifest)
- [Publishing Guide](https://miniapps.farcaster.xyz/docs/guides/publishing)

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Farcaster team for the amazing Mini App SDK
- ImgBB for free image hosting
- All quote authors for their wisdom

## 💜 Support

Built with 💜 for the Farcaster community

---

Made with ❤️ for the Farcaster community
