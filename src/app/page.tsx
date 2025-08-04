export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Navigation */}
      <nav className="px-6 py-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-14 h-8 rounded-lg flex items-center justify-center">
              <img src="/logo.png" alt="InfoCapsule Logo" />
            </div>
            <span className="text-xl font-semibold text-gray-900">InfoCapsule</span>
          </div>
          <div className="hidden sm:flex items-center space-x-6">
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
              How it works
            </a>
            <a href="#sources" className="text-gray-600 hover:text-gray-900 transition-colors">
              Sources
            </a>
            <a href="/auth" className="bg-gradient-to-r from-orange-400 to-amber-400 text-white px-4 py-2 rounded-lg hover:from-orange-500 hover:to-amber-500 transition-all duration-200 font-medium">
              Get Started Free
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="px-6 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="py-12 sm:py-20">
            {/* Personal intro with handwritten feel */}
            <div className="mb-8 flex items-center justify-center">
              <div className="relative">
                <div className="bg-amber-100 px-6 py-3 rounded-2xl border-2 border-amber-200 transform -rotate-1 shadow-sm">
                  <p className="text-amber-800 font-medium text-sm tracking-wide">
                    ✨ A personal project made with love
                  </p>
                </div>
              </div>
            </div>

            {/* Main content in a more intimate, asymmetrical layout */}
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left side - Main content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Stop drowning in
                    <span className="relative inline-block ml-3">
                      <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                        information
                      </span>
                      <div className="absolute -bottom-2 left-0 w-full h-3 bg-orange-200 opacity-30 rounded-full transform -rotate-1"></div>
                    </span>
                  </h1>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-700 leading-relaxed">
                    Get your daily digest of curated insights, delivered with care.
                  </h2>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 shadow-sm">
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    I built this because I was tired of spending hours scrolling through feeds.
                    Now I get AI-powered summaries of everything I care about in one beautiful email.
                  </p>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">EC</span>
                    </div>
                    <span>— Emiliano, creator of InfoCapsule</span>
                  </div>
                </div>

                {/* Cozy CTA */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <a href="/auth" className="group bg-gradient-to-r from-orange-400 to-amber-400 text-white px-8 py-4 rounded-2xl hover:from-orange-500 hover:to-amber-500 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2">
                    <span>Try it free</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                  <a href="#how-it-works" className="border-2 border-orange-200 text-gray-700 px-8 py-4 rounded-2xl hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 font-medium text-lg flex items-center justify-center gap-2">
                    <span>See how it works</span>
                  </a>
                </div>

                {/* Warm trust indicators */}
                <div className="flex flex-wrap gap-6 pt-6 text-sm">
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full">
                    <span className="text-green-600">🌱</span>
                    <span className="text-green-700 font-medium">Always free</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full">
                    <span className="text-blue-600">⚡</span>
                    <span className="text-blue-700 font-medium">2-minute setup</span>
                  </div>
                  <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-full">
                    <span className="text-purple-600">❤️</span>
                    <span className="text-purple-700 font-medium">Made with care</span>
                  </div>
                </div>
              </div>

              {/* Right side - Visual element */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-200 rounded-full opacity-15 animate-pulse" style={{animationDelay: '1s'}}></div>

                  {/* Main visual - mockup of email digest */}
                  <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-400 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">📧</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Your Daily Digest</p>
                          <p className="text-xs text-gray-500">Today • 5 min read</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-gray-50 rounded-xl p-3">
                          <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                          <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                          <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                          <div className="w-4/5 h-2 bg-gray-200 rounded"></div>
                        </div>
                      </div>

                      <div className="pt-2 text-center">
                        <span className="text-xs text-gray-400">✨ Curated just for you</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How it works section */}
          <section id="how-it-works" className="py-16 sm:py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Three simple steps to stay informed
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                InfoCapsule transforms information overload into digestible insights, saving you hours every week — all for free.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose Your Sources</h3>
                <p className="text-gray-600 leading-relaxed">
                  Add your favorite websites, blogs, YouTube channels, podcasts, and social media feeds. We support 15+ source types.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Creates Summaries</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI reads through all new content and creates concise, intelligent summaries of the key points that matter to you.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Receive Daily Digest</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get a beautifully formatted email with all your summaries. Stay informed in just 5 minutes instead of hours.
                </p>
              </div>
            </div>
          </section>

          {/* Supported Sources */}
          <section id="sources" className="py-16 sm:py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Connect any source you love
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From any website to social feeds - we make it easy to stay informed from all your favorite sources.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {/* Website Source */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🌐</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Any Website</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Any website, you just need to select the news section, headline and description by using html viewer
                    </p>
                  </div>
                </div>
              </div>

              {/* Reddit Source */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📱</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Reddit</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Creates RSS feeds from Reddit page URLs with available metadata.
                    </p>
                  </div>
                </div>
              </div>

              {/* YouTube Source */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📺</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">YouTube</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Generates RSS feeds from YouTube channel, playlist, search, or community URLs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Google News Source */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📰</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Google News</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Generates RSS feeds from Google News page URLs with available metadata.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bluesky Source */}
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🦋</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Bluesky</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Converts Bluesky profile or feed URLs to RSS feeds with available metadata.
                    </p>
                  </div>
                </div>
              </div>

              {/* RSS/ATOM Source */}
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📡</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">RSS / ATOM</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Filters or modifies existing RSS/ATOM feeds for better compatibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="text-center mt-12">
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 max-w-2xl mx-auto">
                <p className="text-amber-800 mb-4 font-medium">
                  ✨ Need a source that's not listed?
                </p>
                <p className="text-gray-600 mb-4">
                  I'm always adding new integrations based on what people need most.
                </p>
                <button className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                  Request a new source →
                </button>
              </div>
            </div>
          </section>

          {/* Social Proof */}
          <section className="py-16 sm:py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Join thousands of busy professionals
              </h2>
              <p className="text-lg text-gray-600">
                Who save hours every week staying informed — completely free
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">SM</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sarah Martinez</h4>
                    <p className="text-sm text-gray-500">Product Manager</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "InfoCapsule saves me 2+ hours daily. I stay updated on tech trends, competitor news, and industry insights without the overwhelm. Can't believe it's free!"
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">DJ</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">David Johnson</h4>
                    <p className="text-sm text-gray-500">Marketing Director</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "The AI summaries are incredibly accurate. I get insights from 20+ sources in just 5 minutes every morning. Amazing that this quality service is free!"
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">EC</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Emily Chen</h4>
                    <p className="text-sm text-gray-500">Startup Founder</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "Perfect for busy entrepreneurs. I track my industry, competitors, and inspiration sources all in one beautiful daily email. Love that it's completely free!"
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 sm:py-24 text-center">
            <div className="bg-gradient-to-r from-orange-400 to-amber-400 rounded-3xl p-12 sm:p-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to reclaim your time?
              </h2>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who've transformed information overload into actionable insights — completely free, forever.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="/auth" className="bg-white text-orange-500 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Get Started Free
                </a>
                <a href="#how-it-works" className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200 font-semibold text-lg">
                  See How It Works
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-16 bg-gray-50 px-6 py-8 sm:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-4">
            © 2025 InfoCapsule. Made with ❤️ using
          </p>
          <div className="flex items-center justify-center space-x-6">
            <a href="https://convex.dev" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
              <img src="https://dashboard.convex.dev/convex-logo-only.svg" alt="Convex" className="h-6" />
            </a>
            <span className="text-gray-300">×</span>
            <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
              <img src="https://resend.com/static/brand/resend-wordmark-black.svg" alt="Resend" className="h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
