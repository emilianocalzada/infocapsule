"use client";

interface RssFeedCardProps {
  feed: {
    _id: string;
    url: string;
    _creationTime: number;
  };
  onDelete: (feedId: string) => void;
  isDeleting: boolean;
}

export default function RssFeedCard({ feed, onDelete, isDeleting }: RssFeedCardProps) {
  // Determine source type based on URL
  const getSourceInfo = (url: string) => {
    if (url.includes('reddit.com')) return { icon: '🔴', type: 'Reddit' };
    if (url.includes('youtube.com') || url.includes('youtu.be')) return { icon: '📺', type: 'YouTube' };
    if (url.includes('news.google.com')) return { icon: '📰', type: 'Google News' };
    if (url.includes('bsky.app')) return { icon: '🦋', type: 'Bluesky' };
    if (url.includes('feed') || url.includes('rss') || url.includes('atom')) return { icon: '📡', type: 'RSS Feed' };
    return { icon: '🌐', type: 'Website' };
  };

  const sourceInfo = getSourceInfo(feed.url);

  return (
    <div className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-lg">{sourceInfo.icon}</span>
          <span className="text-sm font-medium text-orange-600">{sourceInfo.type}</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-600">Active</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1 break-all">
          {feed.url}
        </h3>
        <p className="text-sm text-gray-500">
          Added {new Date(feed._creationTime).toLocaleDateString()}
        </p>
      </div>
      <button
        onClick={() => onDelete(feed._id)}
        disabled={isDeleting}
        className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Delete feed"
      >
        {isDeleting ? (
          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )}
      </button>
    </div>
  );
}
