"use client";

import { useMutation, useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import RssFeedCard from "./components/RssFeedCard";
import TimeSelection from "./components/TimeSelection";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useQuery(api.functions.users.getAuthUser);
  const rssFeeds = useQuery(api.functions.rssFeeds.listRssFeeds);
  const setPreferredTime = useMutation(api.functions.users.setPreferredTime);
  const createRssFeed = useMutation(api.functions.rssFeeds.createRssFeed);
  const deleteRssFeed = useMutation(api.functions.rssFeeds.deleteRssFeed);
  const sendTestDigest = useMutation(api.functions.rssFeeds.sendTestDigest);

  const [isSubmittingTime, setIsSubmittingTime] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSourceType, setSelectedSourceType] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [sourceSuccess, setSourceSuccess] = useState<string | null>(null);
  const [deletingFeedId, setDeletingFeedId] = useState<string | null>(null);
  const [isSendingTestDigest, setIsSendingTestDigest] = useState(false);
  const [testDigestError, setTestDigestError] = useState<string | null>(null);
  const [testDigestSuccess, setTestDigestSuccess] = useState<string | null>(null);

  // Handle success message from website selector
  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'website-added') {
      setSourceSuccess("Website source added successfully!");
      setTimeout(() => setSourceSuccess(null), 5000);
      // Clean up URL
      router.replace('/dashboard');
    }
  }, [searchParams, router]);

  // Source types configuration
  const sourceTypes = [
    {
      id: 'website',
      name: 'Website',
      icon: '🌐',
      description: 'Any website with news or content (with custom CSS selectors)',
      placeholder: 'https://example.com',
      instructions: 'Configure CSS selectors to extract content from any website. Perfect for news sites, blogs, and content that doesn\'t have RSS feeds.',
      example: 'https://techcrunch.com'
    },
    {
      id: 'reddit',
      name: 'Reddit',
      icon: '🔴',
      description: 'Reddit communities and posts',
      placeholder: 'https://reddit.com/r/technology',
      instructions: 'Enter a Reddit subreddit, user profile, or specific post URL. Get summaries of top posts and discussions.',
      example: 'https://reddit.com/r/programming'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: '📺',
      description: 'YouTube channels and playlists',
      placeholder: 'https://youtube.com/@channel',
      instructions: 'Enter a YouTube channel, playlist, or search URL. Receive summaries of new video content and descriptions.',
      example: 'https://youtube.com/@veritasium'
    },
    {
      id: 'google-news',
      name: 'Google News',
      icon: '📰',
      description: 'Google News topics and searches',
      placeholder: 'https://news.google.com/topics/...',
      instructions: 'Enter a Google News topic or search URL. Get curated news summaries from multiple sources.',
      example: 'https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFZxYUdjU0FtVnVHZ0pWVXlnQVAB'
    },
    {
      id: 'bluesky',
      name: 'Bluesky',
      icon: '🦋',
      description: 'Bluesky profiles and feeds',
      placeholder: 'https://bsky.app/profile/username',
      instructions: 'Enter a Bluesky profile or custom feed URL. Stay updated with posts and conversations.',
      example: 'https://bsky.app/profile/jack.bsky.social'
    },
    {
      id: 'rss',
      name: 'RSS / ATOM',
      icon: '📡',
      description: 'Existing RSS or ATOM feeds',
      placeholder: 'https://example.com/feed.xml',
      instructions: 'Enter an existing RSS or ATOM feed URL. InfoCapsule will enhance and filter the content for better readability.',
      example: 'https://feeds.feedburner.com/TechCrunch'
    }
  ];

  const handleTimePreferenceSubmit = async () => {
    if (!selectedTime) return;

    setIsSubmittingTime(true);
    try {
      await setPreferredTime({
        preferredTime: selectedTime as "06:00" | "12:00" | "18:00" | "24:00",
      });
      // Success - the user query will automatically update and show the dashboard
    } catch (error) {
      console.error("Failed to set preferred time:", error);
      // You could add error handling here
    } finally {
      setIsSubmittingTime(false);
    }
  };

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceUrl.trim() || !selectedSourceType) return;

    setIsAddingSource(true);
    setSourceError(null);
    setSourceSuccess(null);

    try {
      // Basic URL validation
      const url = new URL(sourceUrl.trim());
      if (!url.protocol.startsWith('http')) {
        throw new Error('Please enter a valid HTTP or HTTPS URL');
      }

      await createRssFeed({ url: sourceUrl.trim(), sourceType: selectedSourceType });
      setSourceUrl("");
      setSelectedSourceType(null);
      setSourceSuccess("Source added successfully!");
      setTimeout(() => setSourceSuccess(null), 3000);
    } catch (error) {
      console.error("Failed to add source:", error);
      setSourceError(error instanceof Error ? error.message : "Failed to add source. Please check the URL and try again.");
    } finally {
      setIsAddingSource(false);
    }
  };

  const handleDeleteFeed = async (feedId: string) => {
    setDeletingFeedId(feedId);
    try {
      await deleteRssFeed({ id: feedId as any });
    } catch (error) {
      console.error("Failed to delete RSS feed:", error);
      setSourceError("Failed to delete RSS feed. Please try again.");
    } finally {
      setDeletingFeedId(null);
    }
  };

  const handleSendTestDigest = async () => {
    setIsSendingTestDigest(true);
    setTestDigestError(null);
    setTestDigestSuccess(null);

    try {
      await sendTestDigest();
      setTestDigestSuccess("We are processing your test digest. It will take a few seconds. Please check your inbox.");
      setTimeout(() => setTestDigestSuccess(null), 8000);
    } catch (error) {
      console.error("Failed to send test digest:", error);
      setTestDigestError(error instanceof Error ? error.message : "Failed to send test digest. Please try again.");
    } finally {
      setIsSendingTestDigest(false);
    }
  };

  // Show onboarding if user hasn't set preferred time
  if (user && user.preferredTime === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              When would you like your daily digest?
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Choose the perfect time to receive your personalized information summary. Times are shown in your local timezone. You can always change this later in settings.
            </p>
          </div>

          {/* Time Selection Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <TimeSelection
              selectedTime={selectedTime}
              onTimeSelect={setSelectedTime}
              disabled={isSubmittingTime}
            />

            <button
              onClick={handleTimePreferenceSubmit}
              disabled={!selectedTime || isSubmittingTime}
              className="w-full mt-8 bg-gradient-to-r from-orange-400 to-amber-400 text-white py-4 px-6 rounded-xl hover:from-orange-500 hover:to-amber-500 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingTime ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Setting up your digest...
                </div>
              ) : (
                "Continue to Dashboard"
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Don't worry, you can change your preferred time anytime in your dashboard settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Welcome to InfoCapsule
        </h1>
        <p className="text-lg text-gray-600">
          Your personalized information digest dashboard
        </p>
      </div>

      {/* Source Management */}
      <div className="grid gap-6 lg:gap-8">
        {/* Add Information Source */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Add Information Source
            </h2>
            <p className="text-gray-600">
              Connect any platform to start receiving AI-powered summaries in your daily digest.
            </p>
          </div>

          {!selectedSourceType ? (
            /* Source Type Selection */
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Choose a source type:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sourceTypes.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => {
                      if (source.id === 'website') {
                        router.push('/dashboard/website-selector');
                      } else {
                        setSelectedSourceType(source.id);
                      }
                    }}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{source.icon}</span>
                      <h4 className="font-semibold text-gray-900 group-hover:text-orange-700">
                        {source.name}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 group-hover:text-gray-700">
                      {source.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Selected Source Form */
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {sourceTypes.find(s => s.id === selectedSourceType)?.icon}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Add {sourceTypes.find(s => s.id === selectedSourceType)?.name} Source
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedSourceType(null);
                    setSourceUrl("");
                    setSourceError(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>How it works:</strong> {sourceTypes.find(s => s.id === selectedSourceType)?.instructions}
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  <strong>Example:</strong> {sourceTypes.find(s => s.id === selectedSourceType)?.example}
                </p>
              </div>

              <form onSubmit={handleAddSource} className="space-y-4">
                <div>
                  <label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    {sourceTypes.find(s => s.id === selectedSourceType)?.name} URL
                  </label>
                  <div className="flex gap-3">
                    <input
                      id="sourceUrl"
                      type="url"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder={sourceTypes.find(s => s.id === selectedSourceType)?.placeholder}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                      disabled={isAddingSource}
                      required
                    />
                    <button
                      type="submit"
                      disabled={isAddingSource || !sourceUrl.trim()}
                      className="bg-gradient-to-r from-orange-400 to-amber-400 text-white px-6 py-3 rounded-xl hover:from-orange-500 hover:to-amber-500 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAddingSource ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Adding...
                        </div>
                      ) : (
                        "Add Source"
                      )}
                    </button>
                  </div>
                </div>

                {/* Success Message */}
                {sourceSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm text-green-600">{sourceSuccess}</p>
                  </div>
                )}

                {/* Error Message */}
                {sourceError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-600">{sourceError}</p>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Information Sources List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold text-gray-900">
                Your Information Sources
              </h2>
              <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                {rssFeeds?.length || 0} {(rssFeeds?.length || 0) === 1 ? 'source' : 'sources'}
              </span>
            </div>
            <p className="text-gray-600">
              Manage your active information sources and monitor their status.
            </p>
          </div>

          {/* Hackathon Demo Section */}
          {rssFeeds && rssFeeds.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-purple-900">Hackathon Demo</h3>
                    <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">
                      Live Demo
                    </span>
                  </div>
                  <p className="text-purple-800 text-sm mb-4">
                    Test our Convex + Resend integration! Generates a sample digest from your latest 5 feed items.
                  </p>
                  <button
                    onClick={handleSendTestDigest}
                    disabled={isSendingTestDigest}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm"
                  >
                    {isSendingTestDigest ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending Demo...
                      </div>
                    ) : (
                      "Send Test Digest"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Test Digest Success Message */}
          {testDigestSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-green-600">{testDigestSuccess}</p>
              </div>
            </div>
          )}

          {/* Test Digest Error Message */}
          {testDigestError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600">{testDigestError}</p>
              </div>
            </div>
          )}

          {rssFeeds === undefined ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-gray-600">Loading feeds...</span>
            </div>
          ) : rssFeeds.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No information sources yet
              </h3>
              <p className="text-gray-600 mb-6">
                Add your first source above to start receiving AI-powered summaries from websites, YouTube, Reddit, and more.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {rssFeeds.map((feed) => (
                <RssFeedCard
                  key={feed._id}
                  feed={feed}
                  onDelete={handleDeleteFeed}
                  isDeleting={deletingFeedId === feed._id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
