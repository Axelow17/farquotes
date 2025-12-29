'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Share2, RefreshCw, User, Sparkles, Loader, ExternalLink, Home, Coffee, Plus } from 'lucide-react';
import { sdk } from '@farcaster/miniapp-sdk';
import { quotes } from '@/lib/quotes';

const FarQuotes = () => {
  const [user, setUser] = useState<any>(null);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [quoteId, setQuoteId] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bgColor, setBgColor] = useState('#7c3aed');
  const [lastImageUrl, setLastImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuote, setEditedQuote] = useState('');
  const [editedAuthor, setEditedAuthor] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const bgColors = [
    '#7c3aed', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', 
    '#ef4444', '#8b5cf6', '#06b6d4', '#6366f1', '#14b8a6'
  ];

  useEffect(() => {
    const initSDK = async () => {
      try {
        // Call ready() immediately to dismiss splash screen
        console.log('Calling sdk.actions.ready()...');
        await sdk.actions.ready();
        console.log('SDK ready called successfully');
        
        // Get context from SDK
        const context = await sdk.context;
        console.log('SDK context:', context);
        
        // Set user from context
        if (context?.user) {
          setUser({
            fid: context.user.fid,
            username: context.user.username || 'Anonymous',
            displayName: context.user.displayName || 'Farcaster User',
            pfp: context.user.pfpUrl || null,
            bio: '',
            followerCount: 0,
            followingCount: 0
          });
        } else {
          setUser({
            fid: 0,
            username: 'demo',
            displayName: 'Demo User',
            pfp: null,
            bio: 'This is a demo account. Connect with Farcaster to see your profile.',
            followerCount: 0,
            followingCount: 0
          });
        }
      } catch (error) {
        console.error('Failed to initialize SDK:', error);
        // Still set demo user on error
        setUser({
          fid: 0,
          username: 'demo',
          displayName: 'Demo User',
          pfp: null,
          bio: 'This is a demo account. Connect with Farcaster to see your profile.',
          followerCount: 0,
          followingCount: 0
        });
        
        // Call ready() again in catch block to ensure splash screen dismisses
        try {
          await sdk.actions.ready();
        } catch (readyError) {
          console.error('Failed to call ready() in error handler:', readyError);
        }
      }
    };

    initSDK();
    generateQuote();
  }, []);

  const generateQuote = () => {
    setLoading(true);
    setLastImageUrl('');
    setTimeout(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];
      setQuote(randomQuote.text);
      setAuthor(randomQuote.author);
      setQuoteId(randomQuote.id);
      setEditedQuote(randomQuote.text);
      setEditedAuthor(randomQuote.author);
      setBgColor(randomColor);
      setLoading(false);
    }, 500);
  };

  const startEditing = () => {
    setEditedQuote(quote);
    setEditedAuthor(author);
    setIsEditing(true);
  };

  const saveEditedQuote = () => {
    setQuote(editedQuote);
    setAuthor(editedAuthor);
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setEditedQuote(quote);
    setEditedAuthor(author);
    setIsEditing(false);
  };

  const adjustColor = (color: string, amount: number) => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  };

  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const shareToFarcaster = async () => {
    setUploading(true);
    
    try {
      // Get username for personalized share link
      const username = user?.username || 'anonymous';
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      
      // Map bg color to theme name
      const colorIndex = bgColors.indexOf(bgColor);
      const themes = ['purple', 'pink', 'blue', 'green', 'orange', 'dark', 'mint', 'rose', 'peach', 'sunset'];
      const theme = themes[colorIndex] || 'purple';
      
      // Create simple share URL with quote ID instead of full text
      const shareUrl = `${baseUrl}/share/${username}?id=${quoteId}&t=${theme}`;
      
      // Cast text with quote and author only
      const castText = `"${quote}"\n\n— ${author}`;
      
      // Show the embed image URL for feedback (still needs full quote for image generation)
      const embedImageUrl = `${baseUrl}/api/embed?` +
        `quote=${encodeURIComponent(quote)}` +
        `&author=${encodeURIComponent(author)}` +
        `&theme=${theme}`;
      
      // Pre-warm the share page and embed image by fetching them
      // This ensures metadata is ready before composeCast is called
      console.log('Sharing quote #' + quoteId + ':', shareUrl);
      console.log('Embed image:', embedImageUrl);
      
      try {
        const [shareResponse, embedResponse] = await Promise.all([
          fetch(shareUrl, { method: 'HEAD' }).then(r => ({ status: r.status, ok: r.ok })).catch(() => ({ status: 0, ok: false })),
          fetch(embedImageUrl, { method: 'HEAD' }).then(r => ({ status: r.status, ok: r.ok })).catch(() => ({ status: 0, ok: false }))
        ]);
        console.log('Pre-warm results - Share:', shareResponse.status, 'Embed:', embedResponse.status);
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (e) {
        console.log('Pre-warm failed, continuing:', e);
      }
      
      setLastImageUrl(embedImageUrl);
      
      // Use composeCast with share URL (which has fc:miniapp metadata)
      // The metadata points to the 3:2 embed image
      try {
        console.log('Calling composeCast with quote #' + quoteId);
        await sdk.actions.composeCast({
          text: castText,
          embeds: [shareUrl] as [string]
        });
        console.log('ComposeCast successful for quote #' + quoteId);
      } catch (composeError) {
        console.error('ComposeCast failed, trying openUrl:', composeError);
        // Fallback to openUrl with Warpcast compose
        const composeUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}&embeds[]=${encodeURIComponent(shareUrl)}`;
        await sdk.actions.openUrl(composeUrl);
      }
    } catch (error) {
      console.error('Failed to share:', error);
      const castText = `"${quote}"\n\n— ${author}\n\n✨ Created with FarQuotes`;
      const composeUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}`;
      
      // Last resort fallback
      if (typeof window !== 'undefined') {
        window.open(composeUrl, '_blank');
      }
    } finally {
      setUploading(false);
    }
  };

  const openProfile = async () => {
    if (user && user.fid > 0) {
      try {
        // Use viewProfile action for better integration
        await sdk.actions.viewProfile({ fid: user.fid });
      } catch (error) {
        console.error('Failed to open profile:', error);
        // Fallback to opening URL
        const profileUrl = `https://warpcast.com/${user.username}`;
        await sdk.actions.openUrl(profileUrl);
      }
    }
  };

  const addAppToHome = async () => {
    try {
      await sdk.actions.addFrame();
      console.log('App added to home successfully');
      // Send success notification
      await sendNotification('✨ FarQuotes added to your home!', 'success');
    } catch (error) {
      console.error('Failed to add app to home:', error);
      await sendNotification('Failed to add app', 'error');
    }
  };

  const sendNotification = async (message: string, type: 'success' | 'error' = 'success') => {
    try {
      // Toast notifications may not be available in current SDK version
      console.log(`${type}: ${message}`);
      // await sdk.actions.showToast({
      //   message: message,
      //   type: type
      // });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const renderContent = () => {
    if (activeTab === 'home') {
      return (
        <>
          {/* Quote Card */}
          <div 
            className="bg-white rounded-2xl shadow-2xl p-8 mb-6 relative overflow-hidden transition-all duration-500"
            style={{ borderTopColor: bgColor, borderTopWidth: '4px' }}
          >
            <div 
              className="absolute top-0 left-0 w-full h-1 transition-colors duration-500"
              style={{ background: `linear-gradient(to right, ${bgColor}, ${adjustColor(bgColor, 40)})` }}
            ></div>

            {/* User Profile in Quote Card */}
            {user && (
              <div 
                onClick={openProfile}
                className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100 cursor-pointer hover:bg-gray-50 -mx-8 px-8 py-3 transition-all duration-300"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-purple-200">
                    {user.pfp ? (
                      <img src={user.pfp} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  {user.fid > 0 && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900 font-bold truncate">{user.displayName}</p>
                    {user.fid > 0 && (
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">@{user.username}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
            )}
            
            <div className="text-6xl mb-4 transition-colors duration-500" style={{ color: adjustColor(bgColor, 40) }}>"</div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin" style={{ color: bgColor }} />
              </div>
            ) : isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editedQuote}
                  onChange={(e) => setEditedQuote(e.target.value)}
                  className="w-full p-4 text-xl text-gray-800 font-serif border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
                  rows={4}
                  placeholder="Enter your custom quote..."
                />
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-600">—</span>
                  <input
                    type="text"
                    value={editedAuthor}
                    onChange={(e) => setEditedAuthor(e.target.value)}
                    className="flex-1 p-2 text-lg font-semibold border-2 border-gray-300 rounded focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    placeholder="Author name"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={saveEditedQuote}
                    className="flex-1 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save Custom Quote
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="flex-1 bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <blockquote className="text-2xl text-gray-800 font-serif mb-6 leading-relaxed">
                  {quote}
                </blockquote>
                
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold transition-colors duration-500" style={{ color: bgColor }}>
                    — {author}
                  </p>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                    <span className="text-sm text-gray-500">FarQuotes</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Success Message */}
          {lastImageUrl && (
            <div className="bg-green-500/20 backdrop-blur-sm border-2 border-green-400 rounded-lg p-3 mb-4 flex items-center gap-2 animate-slide-up">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-green-100 text-sm font-semibold">Embed ready!</p>
                <p className="text-green-200 text-xs mt-0.5">Share page includes fc:miniapp metadata</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={generateQuote}
              disabled={loading || uploading || isEditing}
              className="bg-white text-purple-900 font-semibold py-4 px-6 rounded-xl hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              New Quote
            </button>
            
            {isEditing ? (
              <button
                onClick={saveEditedQuote}
                disabled={!editedQuote.trim() || !editedAuthor.trim()}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Share2 className="w-5 h-5" />
                Save & Share
              </button>
            ) : (
              <button
                onClick={startEditing}
                disabled={loading || uploading || !quote}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Quote
              </button>
            )}
          </div>

          {/* Share Button (when not editing) */}
          {!isEditing && (
            <div className="mt-4">
              <button
                onClick={shareToFarcaster}
                disabled={loading || !quote || uploading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
              >
                {uploading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    Share to Cast
                  </>
                )}
              </button>
            </div>
          )}
        </>
      );
    } else if (activeTab === 'tip') {
      return (
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="text-center mb-6">
            <Coffee className="w-16 h-16 text-amber-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Support the Dev</h2>
            <p className="text-gray-600">Help keep FarQuotes running!</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6">
              <p className="text-gray-700 mb-4 leading-relaxed">
                FarQuotes is built with ❤️ for the Farcaster community. Your support helps us maintain and improve the app with new features!
              </p>
              
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">Developer Address:</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-100 px-3 py-2 rounded flex-1 overflow-x-auto">
                    0xA711F79634Bbc4e99736cd95431EB6536C30fDb8
                  </code>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <button className="bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
                  <p className="text-lg font-bold">$5</p>
                  <p className="text-xs">Coffee</p>
                </button>
                <button className="bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                  <p className="text-lg font-bold">$10</p>
                  <p className="text-xs">Pizza</p>
                </button>
                <button className="bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors">
                  <p className="text-lg font-bold">$20</p>
                  <p className="text-xs">Supporter</p>
                </button>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Why Support?</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>✨ New quote categories</li>
                  <li>🎨 Custom themes & styles</li>
                  <li>🚀 Better performance</li>
                  <li>🔧 Bug fixes & maintenance</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-3">Or follow the developer:</p>
              <button 
                onClick={() => window.open('https://farcaster.xyz/axelow17.eth', '_blank')}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg inline-flex items-center gap-2"
              >
                <User className="w-5 h-5" />
                Follow on Warpcast
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Header with Logo */}
      <div className="text-center pt-8 pb-4 px-4">
        <div className="flex items-center justify-between mb-3 max-w-2xl mx-auto">
          <div></div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                <svg viewBox="0 0 200 200" className="w-12 h-12">
                  <defs>
                    <linearGradient id="quotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor:'#fbbf24'}} />
                      <stop offset="100%" style={{stopColor:'#f59e0b'}} />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="95" fill="url(#quotGrad)" opacity="0.3"/>
                  <text x="100" y="130" fontFamily="Georgia, serif" fontSize="120" fontWeight="bold" fill="url(#quotGrad)" textAnchor="middle">"</text>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">FarQuotes</h1>
              <p className="text-purple-200 text-sm">Powered by Farcaster 🎩</p>
            </div>
          </div>
          <button
            onClick={addAppToHome}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full px-4 py-2 shadow-lg transition-colors border border-white/20"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add App</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-24">
        <div className="w-full max-w-2xl mx-auto">
          {renderContent()}

          {/* Footer Info */}
          <div className="text-center mt-6 space-y-2">
            <div className="flex items-center justify-center gap-2 text-purple-200 text-sm">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Dynamic embeds powered by fc:miniapp</span>
            </div>
            <p className="text-purple-300 text-xs">Share beautiful quotes with your Farcaster community 💜</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-300 ${
                activeTab === 'home' 
                  ? 'bg-white/20 text-white' 
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-semibold">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('tip')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-300 ${
                activeTab === 'tip' 
                  ? 'bg-white/20 text-white' 
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <Coffee className="w-6 h-6" />
              <span className="text-xs font-semibold">Dev Tip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarQuotes;
