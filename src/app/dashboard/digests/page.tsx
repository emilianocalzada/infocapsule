"use client";

import { useQuery } from "convex/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { api } from "../../../../convex/_generated/api";

export default function DigestsPage() {
  const user = useQuery(api.functions.users.getAuthUser);
  const logs = useQuery(api.functions.logs.listLogs, {});

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading digest analytics...</p>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceIcon = (url: string) => {
    if (url?.includes('reddit.com')) return '🔴';
    if (url?.includes('youtube.com') || url?.includes('youtu.be')) return '📺';
    if (url?.includes('news.google.com')) return '📰';
    if (url?.includes('bsky.app')) return '🦋';
    if (url?.includes('feed') || url?.includes('rss') || url?.includes('atom')) return '📡';
    return '🌐';
  };

  // Prepare chart data
  const chartData = [
    {
      name: 'Delivered',
      value: user.deliveredCount || 0,
      color: '#10b981', // green-500
    },
    {
      name: 'Bounced',
      value: user.bouncedCount || 0,
      color: '#ef4444', // red-500
    },
    {
      name: 'Complaints',
      value: user.complainedCount || 0,
      color: '#f59e0b', // yellow-500
    },
  ].filter(item => item.value > 0); // Only show segments with data

  const totalEmails = (user.deliveredCount || 0) + (user.bouncedCount || 0) + (user.complainedCount || 0);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = totalEmails > 0 ? Math.round((data.value / totalEmails) * 100) : 0;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value} emails ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <a href="/dashboard" className="hover:text-gray-700 transition-colors">
            Dashboard
          </a>
          <span>/</span>
          <span className="text-gray-900 font-medium">Digests</span>
        </div>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Digest Analytics</h1>
        <p className="text-lg text-gray-600 mb-3">
          Monitor your email delivery performance and system activity
        </p>

        {/* Real-time Info Banner */}
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-live-pulse"></div>
          <span className="text-sm font-medium text-green-700">
            Live Dashboard
          </span>
          <span className="text-sm text-green-600">
            • Data refreshes automatically
          </span>
        </div>
      </div>

      {/* Summary Overview */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold text-gray-900">
                Email Delivery Overview
              </h2>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-live-pulse"></div>
                <span className="text-xs font-medium text-green-600">Live</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Total email activity across all your digest deliveries • Data updates automatically in real-time
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {(user.deliveredCount || 0) + (user.bouncedCount || 0) + (user.complainedCount || 0)}
            </div>
            <div className="text-sm text-gray-600">Total Emails</div>
          </div>
        </div>

        {/* Success Rate */}
        {((user.deliveredCount || 0) + (user.bouncedCount || 0) + (user.complainedCount || 0)) > 0 && (
          <div className="mt-4 pt-4 border-t border-orange-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-semibold text-green-600">
                {Math.round(((user.deliveredCount || 0) / ((user.deliveredCount || 0) + (user.bouncedCount || 0) + (user.complainedCount || 0))) * 100)}%
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.round(((user.deliveredCount || 0) / ((user.deliveredCount || 0) + (user.bouncedCount || 0) + (user.complainedCount || 0))) * 100)}%`
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Email Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Delivered Emails */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Success
            </span>
          </div>
          <div className="mb-2">
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {user.deliveredCount || 0}
            </h3>
            <p className="text-sm font-medium text-gray-600">Delivered Emails</p>
          </div>
          <p className="text-xs text-gray-500">
            Successfully delivered digest emails
          </p>
        </div>

        {/* Bounced Emails */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
              Bounced
            </span>
          </div>
          <div className="mb-2">
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {user.bouncedCount || 0}
            </h3>
            <p className="text-sm font-medium text-gray-600">Bounced Emails</p>
          </div>
          <p className="text-xs text-gray-500">
            Emails that failed to deliver
          </p>
        </div>

        {/* Complaint Emails */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
              Complaints
            </span>
          </div>
          <div className="mb-2">
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {user.complainedCount || 0}
            </h3>
            <p className="text-sm font-medium text-gray-600">Complaint Emails</p>
          </div>
          <p className="text-xs text-gray-500">
            Emails marked as spam or unwanted
          </p>
        </div>
      </div>

      {/* Email Delivery Chart */}
      {totalEmails > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Email Delivery Breakdown
              </h2>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-live-pulse"></div>
                <span className="text-xs font-medium text-green-600">Live</span>
              </div>
            </div>
            <p className="text-gray-600">
              Visual breakdown of your email delivery performance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend and Stats */}
            <div className="space-y-4">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {totalEmails}
                </div>
                <div className="text-sm text-gray-600">Total Emails Sent</div>
              </div>

              <div className="space-y-3">
                {chartData.map((item, index) => {
                  const percentage = Math.round((item.value / totalEmails) * 100);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{item.value}</div>
                        <div className="text-xs text-gray-500">{percentage}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Email Data Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Email delivery analytics will appear here once you start receiving digests.
            </p>
          </div>
        </div>
      )}

      {/* System Activity Logs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-semibold text-gray-900">
              System Activity Logs
            </h2>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-live-pulse"></div>
              <span className="text-xs font-medium text-green-600">Real-time</span>
            </div>
          </div>
          <p className="text-gray-600">
            Recent activity and processing logs for your information sources • Updates automatically as events occur
          </p>
        </div>

        {!logs ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-gray-600">Loading activity logs...</p>
            </div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No activity logs yet
            </h3>
            <p className="text-gray-600 mb-4">
              System activity will appear here once your sources start processing content.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-400 text-white rounded-lg hover:from-orange-500 hover:to-amber-500 transition-all duration-200 font-medium"
            >
              Add Information Sources
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log._id}
                className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">
                    {log.feed ? getSourceIcon(log.feed.url) : '📝'}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {log.feed ? log.feed.url : 'System'}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {log.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
