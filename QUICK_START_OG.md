# 🎨 Advanced Dynamic OG Images - Quick Reference

## ✨ Features Implemented

Your FarQuotes app now has **professional, customizable OG images** with:

- **3 Visual Styles**: Card, Minimal, Bold
- **10 Color Themes**: Purple, Pink, Blue, Green, Orange, Dark, Mint, Rose, Peach, Sunset
- **Dynamic Parameters**: Custom quote, author, style, theme
- **30 Total Combinations**: Every style works with every theme
- **Edge Runtime**: Fast worldwide performance (~1.4s response time)
- **Optimal Size**: 30KB-200KB per image, 1200×630 pixels

## 🚀 Quick Test URLs

### Card Style Examples
```
# Purple (default)
https://farquotes-khaki.vercel.app/api/og?quote=The only way to do great work is to love what you do&author=Steve Jobs&style=card&theme=purple

# Pink
https://farquotes-khaki.vercel.app/api/og?quote=Innovation distinguishes between a leader and a follower&author=Steve Jobs&style=card&theme=pink

# Blue
https://farquotes-khaki.vercel.app/api/og?quote=Stay hungry stay foolish&author=Steve Jobs&style=card&theme=blue
```

### Minimal Style Examples
```
# Clean and modern
https://farquotes-khaki.vercel.app/api/og?quote=Design is not just what it looks like&author=Steve Jobs&style=minimal&theme=blue

# Professional look
https://farquotes-khaki.vercel.app/api/og?quote=Simplicity is the ultimate sophistication&author=Leonardo da Vinci&style=minimal&theme=dark
```

### Bold Style Examples
```
# High impact
https://farquotes-khaki.vercel.app/api/og?quote=Just Do It&author=Nike&style=bold&theme=green

# Motivational
https://farquotes-khaki.vercel.app/api/og?quote=Dream Big&author=Anonymous&style=bold&theme=sunset
```

## 🎯 Usage in Code

### TypeScript/JavaScript
```typescript
// Generate dynamic OG image URL
const generateOGUrl = (quote: string, author: string, style = 'card', theme = 'purple') => {
  const baseUrl = 'https://farquotes-khaki.vercel.app/api/og';
  const params = new URLSearchParams({
    quote,
    author,
    style,
    theme
  });
  return `${baseUrl}?${params}`;
};

// Example usage
const ogUrl = generateOGUrl(
  'The only way to do great work is to love what you do',
  'Steve Jobs',
  'card',
  'purple'
);
```

### In React Component
```tsx
const [ogImage, setOgImage] = useState('');

const generateQuoteImage = () => {
  const url = `https://farquotes-khaki.vercel.app/api/og?` +
    `quote=${encodeURIComponent(selectedQuote)}` +
    `&author=${encodeURIComponent(selectedAuthor)}` +
    `&style=${selectedStyle}` +
    `&theme=${selectedTheme}`;
  
  setOgImage(url);
};
```

## 📱 Integration Points

### 1. Farcaster Manifest
Currently using static image for reliability:
```json
"imageUrl": "https://farquotes-khaki.vercel.app/og-image.png"
```

To use dynamic:
```json
"imageUrl": "https://farquotes-khaki.vercel.app/api/og?style=card&theme=purple"
```

### 2. Share Function
Update the `shareToFarcaster` function in FarQuotes.tsx to use dynamic OG:
```typescript
const shareUrl = `https://farquotes-khaki.vercel.app/share/${username}?` +
  `quote=${encodeURIComponent(currentQuote.text)}` +
  `&author=${encodeURIComponent(currentQuote.author)}` +
  `&style=card` +
  `&theme=purple`;
```

### 3. User-specific OG Images
```
https://farquotes-khaki.vercel.app/api/og/username?quote=...&author=...&color=5
```

## 🎨 Style Guidelines

### Card Style
- **Best for**: Long inspirational quotes, professional content
- **Features**: White card on gradient, quote mark, centered text
- **Length**: Works well with 50-200 characters

### Minimal Style  
- **Best for**: Short quotes, modern brands, clean aesthetics
- **Features**: White background, bold typography, lots of space
- **Length**: Best with 20-100 characters

### Bold Style
- **Best for**: Motivational content, social media, eye-catching posts
- **Features**: Full gradient background, large text, dramatic
- **Length**: Works with 10-80 characters

## 🌈 Theme Selection Guide

| Theme | Use Case | Mood |
|-------|----------|------|
| **purple** | Default, professional, tech | Trust, wisdom |
| **pink** | Female-focused, beauty, fashion | Energy, passion |
| **blue** | Business, corporate, trust | Calm, professional |
| **green** | Nature, health, growth | Fresh, positive |
| **orange** | Fun, creative, energetic | Warm, cheerful |
| **dark** | Luxury, mystery, elegance | Sophisticated |
| **mint** | Calming, wellness, spa | Peaceful, soft |
| **rose** | Romantic, gentle, feminine | Sweet, lovely |
| **peach** | Warm, inviting, friendly | Cozy, welcoming |
| **sunset** | Vibrant, dynamic, adventure | Bold, exciting |

## 🔧 Advanced Configuration

### Rotate Themes Randomly
```typescript
const themes = ['purple', 'pink', 'blue', 'green', 'orange', 'dark', 'mint', 'rose', 'peach', 'sunset'];
const randomTheme = themes[Math.floor(Math.random() * themes.length)];
```

### Match Theme to Quote Category
```typescript
const getThemeForCategory = (category: string) => {
  const themeMap = {
    inspiration: 'purple',
    love: 'rose',
    success: 'green',
    motivation: 'orange',
    wisdom: 'dark',
    happiness: 'sunset',
  };
  return themeMap[category] || 'purple';
};
```

## 📊 Performance Metrics

- **Response Time**: ~1.4 seconds (Edge runtime)
- **Image Size**: 30KB - 200KB (varies by style/content)
- **Format**: PNG, 1200×630 pixels
- **Cache**: Public, immutable, 1 year
- **Availability**: 99.9% (Vercel Edge Network)

## 🌐 Live Demo

Visit the interactive preview page:
**https://farquotes-khaki.vercel.app/preview**

Test all 30 combinations with your own quotes!

## 📖 Full Documentation

See [OG_IMAGE_API.md](./OG_IMAGE_API.md) for complete API reference.

---

**Status**: ✅ Production Ready
**Deployed**: Vercel Edge Network
**Last Updated**: December 26, 2025
