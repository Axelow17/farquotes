# Advanced Dynamic OG Images API

FarQuotes now supports **advanced dynamic OG image generation** with multiple styles, themes, and customization options!

## API Endpoints

### 1. Main OG Image: `/api/og`
Generate customized OG images with query parameters.

### 2. User-specific OG Image: `/api/og/[username]`
Generate personalized OG images for specific users.

## Parameters

### Required Parameters
None - all parameters have defaults!

### Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `quote` | string | "Create and share beautiful quotes on Farcaster" | The quote text to display |
| `author` | string | "FarQuotes" | Author name |
| `style` | string | "card" | Visual style: `card`, `minimal`, or `bold` |
| `theme` | string | "purple" | Color scheme (see themes below) |

## Styles

### 1. Card Style (Default)
Beautiful quote card with white background and colored gradient backdrop.
- Best for: Long, inspirational quotes
- Features: Large quote mark, centered text, professional look

```
/api/og?style=card&quote=Your quote here&author=Author Name
```

### 2. Minimal Style
Clean, modern design with white background.
- Best for: Short quotes, professional content
- Features: Simple layout, bold typography, lots of whitespace

```
/api/og?style=minimal&quote=Your quote here&author=Author Name
```

### 3. Bold Style
High-impact design with full gradient background.
- Best for: Motivational quotes, social media
- Features: Large text, dramatic gradients, eye-catching

```
/api/og?style=bold&quote=Your quote here&author=Author Name
```

## Themes (Color Schemes)

| Theme | Colors | Vibe |
|-------|--------|------|
| `purple` | Purple to Violet | Default, professional |
| `pink` | Pink to Red | Energetic, feminine |
| `blue` | Blue to Cyan | Cool, trustworthy |
| `green` | Green to Turquoise | Fresh, natural |
| `orange` | Pink-Orange to Yellow | Warm, cheerful |
| `dark` | Cyan to Deep Purple | Mysterious, elegant |
| `mint` | Mint to Pink | Soft, calming |
| `rose` | Rose to Light Pink | Romantic, gentle |
| `peach` | Cream to Peach | Warm, inviting |
| `sunset` | Red-Orange to Light Blue | Vibrant, dynamic |

## Examples

### Example 1: Steve Jobs Quote - Card Style
```
https://farquotes-khaki.vercel.app/api/og?quote=The only way to do great work is to love what you do&author=Steve Jobs&style=card&theme=purple
```

### Example 2: Short Quote - Minimal Style
```
https://farquotes-khaki.vercel.app/api/og?quote=Stay hungry stay foolish&author=Steve Jobs&style=minimal&theme=blue
```

### Example 3: Bold Motivational - Bold Style
```
https://farquotes-khaki.vercel.app/api/og?quote=Innovation distinguishes between a leader and a follower&author=Steve Jobs&style=bold&theme=green
```

### Example 4: Different Themes
```
# Pink theme with card style
/api/og?quote=Life is beautiful&author=Anonymous&theme=pink

# Dark theme with bold style
/api/og?quote=Dream big&author=Motivator&style=bold&theme=dark

# Mint theme with minimal style
/api/og?quote=Keep it simple&author=Designer&style=minimal&theme=mint
```

## Usage in Farcaster

When sharing to Farcaster, use dynamic OG images by passing parameters:

```typescript
const ogImageUrl = `https://farquotes-khaki.vercel.app/api/og?` +
  `quote=${encodeURIComponent(quote)}` +
  `&author=${encodeURIComponent(author)}` +
  `&style=card` +
  `&theme=purple`;
```

## Technical Details

- **Format**: PNG
- **Size**: 1200x630 pixels (optimal for social media)
- **Runtime**: Edge (fast worldwide)
- **Cache**: Public, immutable (1 year)
- **File Size**: 30KB - 200KB depending on style and content

## Testing

Test all combinations:

```bash
# Test all styles with one theme
curl "https://farquotes-khaki.vercel.app/api/og?style=card&theme=purple"
curl "https://farquotes-khaki.vercel.app/api/og?style=minimal&theme=purple"
curl "https://farquotes-khaki.vercel.app/api/og?style=bold&theme=purple"

# Test all themes with one style
curl "https://farquotes-khaki.vercel.app/api/og?theme=purple"
curl "https://farquotes-khaki.vercel.app/api/og?theme=pink"
curl "https://farquotes-khaki.vercel.app/api/og?theme=blue"
# ... etc
```

## Integration with FarQuotes App

The main FarQuotes component can now generate dynamic OG images when sharing quotes. Simply update the share function to include style and theme parameters based on user preferences!

---

**Built with:** Next.js 14, @vercel/og, Edge Runtime
**Deployed on:** Vercel
**Domain:** https://farquotes-khaki.vercel.app
