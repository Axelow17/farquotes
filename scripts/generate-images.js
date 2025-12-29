const fs = require('fs');
const path = require('path');

// Helper to create gradient
function createGradient(ctx, x1, y1, x2, y2, colors) {
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  colors.forEach((color, i) => {
    gradient.addColorStop(i / (colors.length - 1), color);
  });
  return gradient;
}

// Helper to draw text with wrapping
function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

async function generateImages() {
  const { createCanvas } = require('canvas');
  const publicDir = path.join(__dirname, '..', 'public');
  const wellKnownDir = path.join(publicDir, '.well-known');

  // Ensure directories exist
  if (!fs.existsSync(wellKnownDir)) {
    fs.mkdirSync(wellKnownDir, { recursive: true });
  }

  console.log('🎨 Generating images...\n');

  // 1. Generate icon.png (512x512)
  console.log('📱 Creating icon.png (512x512)...');
  const iconCanvas = createCanvas(512, 512);
  const iconCtx = iconCanvas.getContext('2d');

  // Background gradient
  const iconGradient = createGradient(iconCtx, 0, 0, 512, 512, ['#7c3aed', '#8b5cf6', '#6366f1']);
  iconCtx.fillStyle = iconGradient;
  iconCtx.beginPath();
  iconCtx.arc(256, 256, 256, 0, Math.PI * 2);
  iconCtx.fill();

  // Inner circle
  const innerGradient = createGradient(iconCtx, 0, 0, 512, 512, ['#fbbf24', '#f59e0b']);
  iconCtx.fillStyle = innerGradient;
  iconCtx.globalAlpha = 0.3;
  iconCtx.beginPath();
  iconCtx.arc(256, 256, 220, 0, Math.PI * 2);
  iconCtx.fill();
  iconCtx.globalAlpha = 1;

  // Quote mark
  iconCtx.fillStyle = 'white';
  iconCtx.font = 'bold 240px Georgia, serif';
  iconCtx.textAlign = 'center';
  iconCtx.textBaseline = 'middle';
  iconCtx.globalAlpha = 0.95;
  iconCtx.fillText('"', 256, 280);
  iconCtx.globalAlpha = 1;

  // Sparkles
  iconCtx.fillStyle = '#fbbf24';
  iconCtx.beginPath();
  iconCtx.arc(380, 132, 12, 0, Math.PI * 2);
  iconCtx.fill();
  iconCtx.fillStyle = '#fef3c7';
  iconCtx.beginPath();
  iconCtx.arc(380, 132, 8, 0, Math.PI * 2);
  iconCtx.fill();

  iconCtx.fillStyle = '#fbbf24';
  iconCtx.beginPath();
  iconCtx.arc(132, 380, 10, 0, Math.PI * 2);
  iconCtx.fill();
  iconCtx.fillStyle = '#fef3c7';
  iconCtx.beginPath();
  iconCtx.arc(132, 380, 6, 0, Math.PI * 2);
  iconCtx.fill();

  // Save icon
  const iconBuffer = iconCanvas.toBuffer('image/png');
  fs.writeFileSync(path.join(wellKnownDir, 'icon.png'), iconBuffer);
  console.log('✅ icon.png created!\n');

  // 2. Generate splash.png (1200x1200)
  console.log('🌟 Creating splash.png (1200x1200)...');
  const splashCanvas = createCanvas(1200, 1200);
  const splashCtx = splashCanvas.getContext('2d');

  // Background gradient
  const splashGradient = createGradient(splashCtx, 0, 0, 1200, 1200, ['#581c87', '#7c3aed', '#4338ca']);
  splashCtx.fillStyle = splashGradient;
  splashCtx.fillRect(0, 0, 1200, 1200);

  // Radial glow
  const glowGradient = splashCtx.createRadialGradient(600, 600, 0, 600, 600, 400);
  glowGradient.addColorStop(0, 'rgba(251, 191, 36, 0.3)');
  glowGradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
  splashCtx.fillStyle = glowGradient;
  splashCtx.fillRect(0, 0, 1200, 1200);

  // Main icon circle
  const mainGradient = createGradient(splashCtx, 320, 320, 880, 880, ['#7c3aed', '#6366f1']);
  splashCtx.fillStyle = mainGradient;
  splashCtx.beginPath();
  splashCtx.arc(600, 600, 280, 0, Math.PI * 2);
  splashCtx.fill();

  // Inner circle
  const splashInnerGradient = createGradient(splashCtx, 360, 360, 840, 840, ['#fbbf24', '#f59e0b']);
  splashCtx.fillStyle = splashInnerGradient;
  splashCtx.globalAlpha = 0.3;
  splashCtx.beginPath();
  splashCtx.arc(600, 600, 240, 0, Math.PI * 2);
  splashCtx.fill();
  splashCtx.globalAlpha = 1;

  // Quote mark
  splashCtx.fillStyle = 'white';
  splashCtx.font = 'bold 360px Georgia, serif';
  splashCtx.textAlign = 'center';
  splashCtx.textBaseline = 'middle';
  splashCtx.globalAlpha = 0.95;
  splashCtx.fillText('"', 600, 640);
  splashCtx.globalAlpha = 1;

  // App name
  splashCtx.fillStyle = 'white';
  splashCtx.font = 'bold 72px system-ui, sans-serif';
  splashCtx.textAlign = 'center';
  splashCtx.fillText('FarQuotes', 600, 950);

  splashCtx.fillStyle = '#c4b5fd';
  splashCtx.font = '36px system-ui, sans-serif';
  splashCtx.fillText('Beautiful Quotes for Farcaster 🎩', 600, 1020);

  // Sparkles
  const sparkles = [
    { x: 820, y: 380, r1: 20, r2: 12 },
    { x: 380, y: 820, r1: 16, r2: 10 },
    { x: 850, y: 750, r1: 14, r2: 8 },
    { x: 350, y: 450, r1: 18, r2: 11 }
  ];

  sparkles.forEach(sparkle => {
    splashCtx.fillStyle = '#fbbf24';
    splashCtx.beginPath();
    splashCtx.arc(sparkle.x, sparkle.y, sparkle.r1, 0, Math.PI * 2);
    splashCtx.fill();
    splashCtx.fillStyle = '#fef3c7';
    splashCtx.beginPath();
    splashCtx.arc(sparkle.x, sparkle.y, sparkle.r2, 0, Math.PI * 2);
    splashCtx.fill();
  });

  // Save splash
  const splashBuffer = splashCanvas.toBuffer('image/png');
  fs.writeFileSync(path.join(wellKnownDir, 'splash.png'), splashBuffer);
  console.log('✅ splash.png created!\n');

  // 3. Generate hero.png (1200x630)
  console.log('🎯 Creating hero.png (1200x630)...');
  const heroCanvas = createCanvas(1200, 630);
  const heroCtx = heroCanvas.getContext('2d');

  // Background
  const heroGradient = createGradient(heroCtx, 0, 0, 1200, 630, ['#581c87', '#7c3aed', '#4338ca']);
  heroCtx.fillStyle = heroGradient;
  heroCtx.fillRect(0, 0, 1200, 630);

  // Decorative circles
  const circle1Gradient = createGradient(heroCtx, 870, -30, 1230, 330, ['#fbbf24', '#f59e0b']);
  heroCtx.fillStyle = circle1Gradient;
  heroCtx.globalAlpha = 0.15;
  heroCtx.beginPath();
  heroCtx.arc(1050, 150, 180, 0, Math.PI * 2);
  heroCtx.fill();

  const circle2Gradient = createGradient(heroCtx, 0, 330, 300, 630, ['#ec4899', '#8b5cf6']);
  heroCtx.fillStyle = circle2Gradient;
  heroCtx.beginPath();
  heroCtx.arc(150, 480, 150, 0, Math.PI * 2);
  heroCtx.fill();
  heroCtx.globalAlpha = 1;

  // Quote icon
  const heroIconGradient = createGradient(heroCtx, 100, 215, 300, 415, ['#7c3aed', '#6366f1']);
  heroCtx.fillStyle = heroIconGradient;
  heroCtx.globalAlpha = 0.9;
  heroCtx.beginPath();
  heroCtx.arc(200, 315, 100, 0, Math.PI * 2);
  heroCtx.fill();
  heroCtx.globalAlpha = 1;

  heroCtx.fillStyle = 'white';
  heroCtx.font = 'bold 140px Georgia, serif';
  heroCtx.textAlign = 'center';
  heroCtx.textBaseline = 'middle';
  heroCtx.fillText('"', 200, 335);

  // Text content
  heroCtx.fillStyle = 'white';
  heroCtx.font = 'bold 64px system-ui, sans-serif';
  heroCtx.textAlign = 'left';
  heroCtx.fillText('FarQuotes', 350, 250);

  heroCtx.fillStyle = '#c4b5fd';
  heroCtx.font = '36px system-ui, sans-serif';
  heroCtx.fillText('Beautiful Quote Sharing', 350, 320);

  heroCtx.fillStyle = '#e9d5ff';
  heroCtx.font = '32px system-ui, sans-serif';
  heroCtx.fillText('Create and share inspirational quotes on Farcaster', 350, 380);

  // Features
  heroCtx.fillStyle = '#fbbf24';
  heroCtx.font = '24px system-ui, sans-serif';
  heroCtx.fillText('✨ 50+ Quotes', 350, 440);
  heroCtx.fillText('🎨 Custom Designs', 550, 440);
  heroCtx.fillText('🚀 Instant Share', 800, 440);

  // Sparkles
  const heroSparkles = [
    { x: 950, y: 120, r: 12 },
    { x: 980, y: 180, r: 10 },
    { x: 850, y: 500, r: 14 },
    { x: 920, y: 540, r: 8 }
  ];

  heroSparkles.forEach(sparkle => {
    heroCtx.fillStyle = sparkle.r > 10 ? '#fbbf24' : '#fef3c7';
    heroCtx.globalAlpha = 0.8;
    heroCtx.beginPath();
    heroCtx.arc(sparkle.x, sparkle.y, sparkle.r, 0, Math.PI * 2);
    heroCtx.fill();
    heroCtx.globalAlpha = 1;
  });

  // Save hero
  const heroBuffer = heroCanvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, 'hero.png'), heroBuffer);
  console.log('✅ hero.png created!\n');

  // 4. Generate og-image.png (1200x630)
  console.log('🖼️  Creating og-image.png (1200x630)...');
  const ogCanvas = createCanvas(1200, 630);
  const ogCtx = ogCanvas.getContext('2d');

  // Background
  const ogGradient = createGradient(ogCtx, 0, 0, 1200, 630, ['#7c3aed', '#8b5cf6', '#6366f1']);
  ogCtx.fillStyle = ogGradient;
  ogCtx.fillRect(0, 0, 1200, 630);

  // Decorative circles
  const ogDecor1 = createGradient(ogCtx, 850, -30, 1150, 270, ['#fbbf24', '#f59e0b']);
  ogCtx.fillStyle = ogDecor1;
  ogCtx.globalAlpha = 0.2;
  ogCtx.beginPath();
  ogCtx.arc(1000, 120, 150, 0, Math.PI * 2);
  ogCtx.fill();

  const ogDecor2 = createGradient(ogCtx, 80, 390, 320, 630, ['#ec4899', '#8b5cf6']);
  ogCtx.fillStyle = ogDecor2;
  ogCtx.beginPath();
  ogCtx.arc(200, 510, 120, 0, Math.PI * 2);
  ogCtx.fill();
  ogCtx.globalAlpha = 1;

  // White card
  ogCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ogCtx.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
  ogCtx.roundRect(100, 100, 1000, 430, 30);
  ogCtx.fill();

  // Quote icon on card
  const ogIconGradient = createGradient(ogCtx, 140, 235, 300, 395, ['#7c3aed', '#6366f1']);
  ogCtx.fillStyle = ogIconGradient;
  ogCtx.beginPath();
  ogCtx.arc(220, 315, 80, 0, Math.PI * 2);
  ogCtx.fill();

  ogCtx.fillStyle = 'white';
  ogCtx.font = 'bold 110px Georgia, serif';
  ogCtx.textAlign = 'center';
  ogCtx.fillText('"', 220, 335);

  // Text
  ogCtx.fillStyle = '#1f2937';
  ogCtx.font = 'bold 56px system-ui, sans-serif';
  ogCtx.textAlign = 'left';
  ogCtx.fillText('FarQuotes', 350, 240);

  ogCtx.fillStyle = '#6b7280';
  ogCtx.font = '32px system-ui, sans-serif';
  ogCtx.fillText('Share Beautiful Quotes on Farcaster', 350, 300);

  // Sample quote box
  ogCtx.fillStyle = '#f3f4f6';
  ogCtx.roundRect(350, 330, 700, 140, 15);
  ogCtx.fill();

  ogCtx.fillStyle = '#374151';
  ogCtx.font = 'italic 26px Georgia, serif';
  ogCtx.fillText('"The future belongs to those who', 380, 380);
  ogCtx.fillText('believe in the beauty of their dreams."', 380, 420);

  ogCtx.fillStyle = '#9ca3af';
  ogCtx.font = '20px system-ui, sans-serif';
  ogCtx.fillText('— Eleanor Roosevelt', 380, 455);

  // Sparkles
  ogCtx.fillStyle = '#fbbf24';
  ogCtx.beginPath();
  ogCtx.arc(300, 180, 8, 0, Math.PI * 2);
  ogCtx.fill();
  ogCtx.beginPath();
  ogCtx.arc(900, 500, 10, 0, Math.PI * 2);
  ogCtx.fill();
  ogCtx.beginPath();
  ogCtx.arc(1050, 200, 6, 0, Math.PI * 2);
  ogCtx.fill();

  // Save og-image
  const ogBuffer = ogCanvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogBuffer);
  console.log('✅ og-image.png created!\n');

  console.log('🎉 All images generated successfully!\n');
  console.log('📁 Files created:');
  console.log('   - public/.well-known/icon.png (512x512)');
  console.log('   - public/.well-known/splash.png (1200x1200)');
  console.log('   - public/hero.png (1200x630)');
  console.log('   - public/og-image.png (1200x630)');
}

// Run if called directly
if (require.main === module) {
  generateImages().catch(console.error);
}

module.exports = { generateImages };
