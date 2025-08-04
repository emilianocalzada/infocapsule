"use client";

import { useState } from "react";

interface SelectorConfig {
  containerSelector: string;
  headlineSelector: string;
  summarySelector: string;
}

interface SelectorFormProps {
  selectors: SelectorConfig;
  onSelectorsChange: (selectors: SelectorConfig) => void;
  onSubmit: (selectors: SelectorConfig) => void;
  isSubmitting: boolean;
  websiteUrl: string;
}

export default function SelectorForm({ 
  selectors, 
  onSelectorsChange, 
  onSubmit, 
  isSubmitting,
  websiteUrl 
}: SelectorFormProps) {
  const [showHelp, setShowHelp] = useState(false);

  const handleInputChange = (field: keyof SelectorConfig, value: string) => {
    onSelectorsChange({
      ...selectors,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectors);
  };

  const isFormValid = selectors.containerSelector && selectors.headlineSelector && selectors.summarySelector;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Configure CSS Selectors
        </h3>
        <p className="text-sm text-gray-600">
          Define how to extract content from <span className="font-medium">{websiteUrl}</span>
        </p>
      </div>

      {/* Help Section */}
      <div className="mb-6">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          What are CSS selectors?
        </button>

        {showHelp && (
          <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">CSS Selector Examples:</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div><code className="bg-blue-100 px-1 rounded">.news-container</code> - Selects elements with class "news-container"</div>
              <div><code className="bg-blue-100 px-1 rounded">#main-content</code> - Selects element with ID "main-content"</div>
              <div><code className="bg-blue-100 px-1 rounded">article h2</code> - Selects h2 elements inside article tags</div>
              <div><code className="bg-blue-100 px-1 rounded">.post-title</code> - Selects elements with class "post-title"</div>
              <div><code className="bg-blue-100 px-1 rounded">p.summary</code> - Selects paragraph elements with class "summary"</div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Use your browser's developer tools (F12) to inspect the website and find the right selectors.
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Container Selector */}
        <div>
          <label htmlFor="containerSelector" className="block text-sm font-medium text-gray-700 mb-2">
            News Container Selector
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="containerSelector"
            type="text"
            value={selectors.containerSelector}
            onChange={(e) => handleInputChange('containerSelector', e.target.value)}
            placeholder=".news-container"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            The main container that holds all news articles or blog posts
          </p>
        </div>

        {/* Headline Selector */}
        <div>
          <label htmlFor="headlineSelector" className="block text-sm font-medium text-gray-700 mb-2">
            Headline Selector
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="headlineSelector"
            type="text"
            value={selectors.headlineSelector}
            onChange={(e) => handleInputChange('headlineSelector', e.target.value)}
            placeholder=".article-title"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Selector for article titles/headlines within each news item
          </p>
        </div>

        {/* Summary Selector */}
        <div>
          <label htmlFor="summarySelector" className="block text-sm font-medium text-gray-700 mb-2">
            Summary Selector
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="summarySelector"
            type="text"
            value={selectors.summarySelector}
            onChange={(e) => handleInputChange('summarySelector', e.target.value)}
            placeholder=".article-summary"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Selector for article summaries/descriptions within each news item
          </p>
        </div>

        {/* Common Patterns */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Common Patterns:</h4>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onSelectorsChange({
                containerSelector: '.news-container',
                headlineSelector: '.article-title',
                summarySelector: '.article-summary'
              })}
              className="w-full text-left p-2 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">News Website Pattern</div>
              <div className="text-gray-600">Container: .news-container, Title: .article-title, Summary: .article-summary</div>
            </button>
            
            <button
              type="button"
              onClick={() => onSelectorsChange({
                containerSelector: 'main',
                headlineSelector: 'h2',
                summarySelector: '.excerpt'
              })}
              className="w-full text-left p-2 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Blog Pattern</div>
              <div className="text-gray-600">Container: main, Title: h2, Summary: .excerpt</div>
            </button>

            <button
              type="button"
              onClick={() => onSelectorsChange({
                containerSelector: '.posts',
                headlineSelector: '.post-title',
                summarySelector: '.post-excerpt'
              })}
              className="w-full text-left p-2 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">WordPress Pattern</div>
              <div className="text-gray-600">Container: .posts, Title: .post-title, Summary: .post-excerpt</div>
            </button>
          </div>
        </div>

        {/* Testing Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-yellow-800 mb-1">Testing Your Selectors</h4>
              <p className="text-xs text-yellow-700">
                Open your browser's developer tools (F12), go to the website, and use the Console tab to test your selectors with <code className="bg-yellow-100 px-1 rounded">document.querySelectorAll('your-selector')</code>
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full bg-gradient-to-r from-orange-400 to-amber-400 text-white py-3 px-6 rounded-xl hover:from-orange-500 hover:to-amber-500 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Adding Website Source...
            </div>
          ) : (
            "Add Website Source"
          )}
        </button>

        {!isFormValid && (
          <p className="text-xs text-gray-500 text-center">
            Please fill in all required fields to continue
          </p>
        )}
      </form>
    </div>
  );
}
