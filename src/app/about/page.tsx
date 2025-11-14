import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-memento-50 to-memento-100">
      <div className="max-w-4xl mx-auto px-6 pb-12 pt-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-memento-800 handwriting mb-4">
            About Memento
          </h1>
          <p className="text-xl text-memento-700 max-w-2xl mx-auto">
            Preserving precious moments and creating lasting connections between generations
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-memento-200 mb-8">
          <h2 className="text-3xl font-semibold text-memento-800 mb-6 handwriting">Our Story</h2>
          <div className="prose prose-lg text-memento-700 space-y-4">
            <p>
              Memento was born from a simple yet profound realization: the most precious gift parents can give their children isn't material—it's the wisdom, love, and memories that shape who they become.
            </p>
            <p>
              In our fast-paced digital world, meaningful moments often slip by unrecorded. Important conversations happen in fleeting instances. Life lessons get forgotten in the rush of daily life. Memento changes that.
            </p>
            <p>
              We believe every parent has stories worth telling, wisdom worth sharing, and love worth preserving. Our platform gives you the tools to capture these precious gifts and deliver them to your children exactly when they need them most.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-memento-200">
            <div className="text-4xl mb-4">🕰️</div>
            <h3 className="text-xl font-semibold text-memento-800 mb-3">Time-Release Magic</h3>
            <p className="text-memento-600">
              Schedule messages to be revealed at specific ages or milestones. Imagine your child discovering your words of encouragement right before their first job interview, or reading about their first steps on their own parenting journey.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-memento-200">
            <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-xl font-semibold text-memento-800 mb-3">Multi-Child Support</h3>
            <p className="text-memento-600">
              Create personalized memory collections for each of your children. Every child is unique, and their memory capsule should be too. Tailor messages, milestones, and moments for each individual personality.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-memento-200">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-memento-800 mb-3">Privacy & Security</h3>
            <p className="text-memento-600">
              Your family's memories are sacred. We use enterprise-grade security to ensure your messages remain private until their intended release date. Your stories are yours alone.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-memento-200">
            <div className="text-4xl mb-4">💝</div>
            <h3 className="text-xl font-semibold text-memento-800 mb-3">Rich Memories</h3>
            <p className="text-memento-600">
              Beyond text, capture photos, videos, voice recordings, and documents. Create a rich tapestry of memories that brings your stories to life for future discovery.
            </p>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-memento-200 mb-8">
          <h2 className="text-3xl font-semibold text-memento-800 mb-6 handwriting">Our Vision</h2>
          <div className="text-memento-700 space-y-4">
            <p className="text-lg">
              We envision a world where every child grows up knowing they are loved, where parental wisdom transcends generations, and where families stay connected across time and distance.
            </p>
            <p>
              Memento is more than an app—it's a bridge between generations, a repository of love, and a testament to the enduring bond between parents and children.
            </p>
          </div>
        </div>

        {/* Upcoming Features */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-memento-200 mb-8">
          <h2 className="text-3xl font-semibold text-memento-800 mb-6 handwriting">What's Coming</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-memento-500 rounded-full"></div>
              <span className="text-memento-700">Family collaboration features</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-memento-500 rounded-full"></div>
              <span className="text-memento-700">Mobile apps for iOS & Android</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-memento-500 rounded-full"></div>
              <span className="text-memento-700">AI-powered writing assistance</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-memento-500 rounded-full"></div>
              <span className="text-memento-700">Export to physical books</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-memento-500 rounded-full"></div>
              <span className="text-memento-700">Voice-to-text note creation</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-memento-500 rounded-full"></div>
              <span className="text-memento-700">Calendar milestone integration</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-memento-500 to-memento-600 rounded-lg p-8 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4 handwriting">Start Creating Memories Today</h2>
            <p className="text-lg mb-6 text-memento-50">
              Every day that passes is a day of memories you could be preserving for your children's future.
            </p>
            <Link
              href="/dashboard"
              className="bg-white text-memento-700 hover:bg-memento-50 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg inline-block"
            >
              Begin Your Family's Time Capsule
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
