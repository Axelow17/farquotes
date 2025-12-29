'use client';

import { useState } from 'react';

const styles = ['card', 'minimal', 'bold'];
const themes = ['purple', 'pink', 'blue', 'green', 'orange', 'dark', 'mint', 'rose', 'peach', 'sunset'];

export default function PreviewPage() {
  const [quote, setQuote] = useState('The only way to do great work is to love what you do');
  const [author, setAuthor] = useState('Steve Jobs');
  const [selectedStyle, setSelectedStyle] = useState('card');
  const [selectedTheme, setSelectedTheme] = useState('purple');

  const generateUrl = (style: string, theme: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://farquotes-khaki.vercel.app';
    return `${baseUrl}/api/og?quote=${encodeURIComponent(quote)}&author=${encodeURIComponent(author)}&style=${style}&theme=${theme}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎨 OG Image Generator Preview
          </h1>
          <p className="text-gray-600 mb-8">
            Test all dynamic OG image styles and themes for FarQuotes
          </p>

          {/* Input Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quote Text
              </label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author Name
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Preview
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedStyle('card')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      selectedStyle === 'card'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Card
                  </button>
                  <button
                    onClick={() => setSelectedStyle('minimal')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      selectedStyle === 'minimal'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Minimal
                  </button>
                  <button
                    onClick={() => setSelectedStyle('bold')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      selectedStyle === 'bold'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Bold
                  </button>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {themes.map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setSelectedTheme(theme)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        selectedTheme === theme
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Preview */}
          <div className="bg-gray-100 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Current Preview: {selectedStyle} / {selectedTheme}
            </h2>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={generateUrl(selectedStyle, selectedTheme)}
                alt="OG Image Preview"
                className="w-full"
                key={generateUrl(selectedStyle, selectedTheme)}
              />
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Generated URL:</p>
              <code className="block bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
                {generateUrl(selectedStyle, selectedTheme)}
              </code>
            </div>
          </div>

          {/* All Styles Preview */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Styles with {selectedTheme} Theme
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {styles.map((style) => (
              <div key={style} className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                  {style} Style
                </h3>
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <img
                    src={generateUrl(style, selectedTheme)}
                    alt={`${style} style`}
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* All Themes Preview */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Themes with {selectedStyle} Style
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme) => (
              <div key={theme} className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                  {theme} Theme
                </h3>
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <img
                    src={generateUrl(selectedStyle, theme)}
                    alt={`${theme} theme`}
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Documentation */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📚 API Documentation
          </h2>
          <div className="prose max-w-none">
            <h3>Parameters</h3>
            <ul>
              <li><code>quote</code> - The quote text (required)</li>
              <li><code>author</code> - Author name (default: "FarQuotes")</li>
              <li><code>style</code> - Visual style: card, minimal, bold (default: "card")</li>
              <li><code>theme</code> - Color theme: purple, pink, blue, green, orange, dark, mint, rose, peach, sunset (default: "purple")</li>
            </ul>
            
            <h3>Example Usage</h3>
            <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto">
{`// Card style with purple theme
/api/og?quote=Your quote&author=Author&style=card&theme=purple

// Minimal style with blue theme
/api/og?quote=Your quote&author=Author&style=minimal&theme=blue

// Bold style with green theme
/api/og?quote=Your quote&author=Author&style=bold&theme=green`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
