"use client";

interface RssFeedCardProps {
  feed: {
    _id: string;
    url: string;
    _creationTime: number;
    status: "active" | "error";
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
          {/* Status Badge */}
          <div className={`w-2 h-2 rounded-full ${
            feed.status === 'active' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className={`text-sm font-medium ${
            feed.status === 'active' ? 'text-green-600' : 'text-red-600'
          }`}>
            {feed.status === 'active' ? 'Active' : 'Error'}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1 break-all">
          {feed.url}
        </h3>
        <p className="text-sm text-gray-500">
          Added {new Date(feed._creationTime).toLocaleDateString()}
        </p>
        {/* Error Alert */}
        {feed.status === 'error' && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-red-700 font-medium">
                We couldn't fetch any news
              </p>
            </div>
          </div>
        )}
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
