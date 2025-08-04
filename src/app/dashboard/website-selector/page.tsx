"use client";

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import SelectorForm from "./components/SelectorForm";
import WebsitePreview from "./components/WebsitePreview";

interface SelectorConfig {
  containerSelector: string;
  headlineSelector: string;
  summarySelector: string;
}

export default function WebsiteSelectorPage() {
  const router = useRouter();
  const createRssFeed = useMutation(api.functions.rssFeeds.createRssFeed);
  
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [selectors, setSelectors] = useState<SelectorConfig>({
    containerSelector: "",
    headlineSelector: "",
    summarySelector: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'url' | 'selectors'>('url');

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl.trim()) return;
    
    try {
      new URL(websiteUrl.trim());
      setCurrentStep('selectors');
      setError(null);
    } catch {
      setError('Please enter a valid URL');
    }
  };

  const handleSelectorSubmit = async (selectorConfig: SelectorConfig) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Create the RSS feed with the website URL and selector configuration
      await createRssFeed({
        url: websiteUrl.trim(),
        selectors: selectorConfig,
        sourceType: 'website',
      });

      // Redirect back to dashboard with success
      router.push('/dashboard?success=website-added');
    } catch (error) {
      console.error("Failed to add website source:", error);
      setError("Failed to add website source. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'selectors') {
      setCurrentStep('url');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Configure Website Source
            </h1>
            <p className="text-gray-600 mt-1">
              Set up CSS selectors to extract content from your website
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${currentStep === 'url' ? 'text-orange-600' : 'text-green-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep === 'url' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
            }`}>
              {currentStep === 'selectors' ? '✓' : '1'}
            </div>
            <span className="font-medium">Website URL</span>
          </div>
          <div className="flex-1 h-px bg-gray-200"></div>
          <div className={`flex items-center gap-2 ${currentStep === 'selectors' ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep === 'selectors' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
            }`}>
              2
            </div>
            <span className="font-medium">CSS Selectors</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Step 1: URL Input */}
      {currentStep === 'url' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Enter Website URL
            </h2>
            <p className="text-gray-600">
              Provide the URL of the website you want to monitor for news articles or blog posts.
            </p>
          </div>

          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                id="websiteUrl"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Examples:</strong> News websites like TechCrunch, BBC News, or any blog with regular content updates.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-400 to-amber-400 text-white py-3 px-6 rounded-xl hover:from-orange-500 hover:to-amber-500 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-200 font-semibold"
            >
              Continue to Selector Configuration
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Selector Configuration */}
      {currentStep === 'selectors' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Website Preview */}
          <div className="order-2 lg:order-1">
            <WebsitePreview 
              url={websiteUrl}
              selectors={selectors}
            />
          </div>

          {/* Selector Form */}
          <div className="order-1 lg:order-2">
            <SelectorForm
              selectors={selectors}
              onSelectorsChange={setSelectors}
              onSubmit={handleSelectorSubmit}
              isSubmitting={isSubmitting}
              websiteUrl={websiteUrl}
            />
          </div>
        </div>
      )}
    </div>
  );
}
