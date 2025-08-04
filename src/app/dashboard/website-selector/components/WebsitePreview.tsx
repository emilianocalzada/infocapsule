"use client";

import { useState } from "react";

interface WebsitePreviewProps {
  url: string;
  selectors: {
    containerSelector: string;
    headlineSelector: string;
    summarySelector: string;
  };
}

export default function WebsitePreview({ url, selectors }: WebsitePreviewProps) {
  const [showExample, setShowExample] = useState(true);

  // Mock website layout for demonstration
  const ExampleWebsite = () => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">TechNews Daily</h1>
        <nav className="mt-2 text-sm">
          <span className="mr-4">Home</span>
          <span className="mr-4">Technology</span>
          <span className="mr-4">Science</span>
          <span>Business</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div 
          className={`space-y-4 ${
            selectors.containerSelector && selectors.containerSelector.includes('news-container') 
              ? 'ring-2 ring-orange-400 ring-opacity-50 bg-orange-50' 
              : ''
          }`}
          data-selector="news-container"
        >
          {/* Article 1 */}
          <article className="border-b border-gray-200 pb-4">
            <h2 
              className={`text-lg font-semibold text-gray-900 mb-2 ${
                selectors.headlineSelector && selectors.headlineSelector.includes('article-title')
                  ? 'ring-2 ring-green-400 ring-opacity-50 bg-green-50'
                  : ''
              }`}
              data-selector="article-title"
            >
              Revolutionary AI Breakthrough Changes Everything
            </h2>
            <p 
              className={`text-gray-600 text-sm ${
                selectors.summarySelector && selectors.summarySelector.includes('article-summary')
                  ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50'
                  : ''
              }`}
              data-selector="article-summary"
            >
              Scientists have developed a new AI system that can understand and generate human-like responses with unprecedented accuracy. This breakthrough could revolutionize how we interact with technology.
            </p>
            <div className="text-xs text-gray-500 mt-2">
              By John Smith • 2 hours ago
            </div>
          </article>

          {/* Article 2 */}
          <article className="border-b border-gray-200 pb-4">
            <h2 
              className={`text-lg font-semibold text-gray-900 mb-2 ${
                selectors.headlineSelector && selectors.headlineSelector.includes('article-title')
                  ? 'ring-2 ring-green-400 ring-opacity-50 bg-green-50'
                  : ''
              }`}
              data-selector="article-title"
            >
              Climate Tech Startup Raises $50M Series B
            </h2>
            <p 
              className={`text-gray-600 text-sm ${
                selectors.summarySelector && selectors.summarySelector.includes('article-summary')
                  ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50'
                  : ''
              }`}
              data-selector="article-summary"
            >
              GreenTech Solutions announced a major funding round to accelerate development of their carbon capture technology. The company plans to deploy the solution across major industrial facilities.
            </p>
            <div className="text-xs text-gray-500 mt-2">
              By Sarah Johnson • 4 hours ago
            </div>
          </article>

          {/* Article 3 */}
          <article className="pb-4">
            <h2 
              className={`text-lg font-semibold text-gray-900 mb-2 ${
                selectors.headlineSelector && selectors.headlineSelector.includes('article-title')
                  ? 'ring-2 ring-green-400 ring-opacity-50 bg-green-50'
                  : ''
              }`}
              data-selector="article-title"
            >
              New Smartphone Features Leaked Ahead of Launch
            </h2>
            <p 
              className={`text-gray-600 text-sm ${
                selectors.summarySelector && selectors.summarySelector.includes('article-summary')
                  ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50'
                  : ''
              }`}
              data-selector="article-summary"
            >
              Leaked documents reveal exciting new features coming to the next generation of smartphones, including advanced camera capabilities and improved battery life.
            </p>
            <div className="text-xs text-gray-500 mt-2">
              By Mike Chen • 6 hours ago
            </div>
          </article>
        </div>
      </div>

      {/* Sidebar */}
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Trending Topics</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <div>Artificial Intelligence</div>
          <div>Climate Change</div>
          <div>Technology</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Website Preview
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExample(true)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                showExample 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Example
            </button>
            <button
              onClick={() => setShowExample(false)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                !showExample 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Live Preview
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-600">
          {showExample 
            ? "This example shows a typical news website layout. Configure your selectors to match similar elements on your target website."
            : "Live preview of your website (coming soon)"
          }
        </p>
      </div>

      {/* Legend */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Color Legend:</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-200 border border-orange-400 rounded"></div>
            <span>News Container (contains all articles)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-200 border border-green-400 rounded"></div>
            <span>Headlines (article titles)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-200 border border-blue-400 rounded"></div>
            <span>Summaries (article descriptions)</span>
          </div>
        </div>
      </div>

      {/* Website Preview */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {showExample ? (
          <ExampleWebsite />
        ) : (
          <div className="p-8 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
            </div>
            <p className="text-sm">Live preview coming soon</p>
            <p className="text-xs text-gray-400 mt-1">
              For now, use the example to understand selector configuration
            </p>
          </div>
        )}
      </div>

      {/* Selector Status */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${
            selectors.containerSelector ? 'bg-green-500' : 'bg-gray-300'
          }`}></div>
          <span className={selectors.containerSelector ? 'text-green-700' : 'text-gray-500'}>
            Container selector configured
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${
            selectors.headlineSelector ? 'bg-green-500' : 'bg-gray-300'
          }`}></div>
          <span className={selectors.headlineSelector ? 'text-green-700' : 'text-gray-500'}>
            Headline selector configured
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${
            selectors.summarySelector ? 'bg-green-500' : 'bg-gray-300'
          }`}></div>
          <span className={selectors.summarySelector ? 'text-green-700' : 'text-gray-500'}>
            Summary selector configured
          </span>
        </div>
      </div>
    </div>
  );
}
