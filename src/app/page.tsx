import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold mono uppercase mb-6">
            VV GAMES
          </h1>
          <p className="text-2xl md:text-3xl font-bold mb-8">
            Simple. Clean. Fun.
          </p>
          <p className="text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Hyper-minimal mini games designed for quick fun and focus. 
            No distractions, just pure gameplay.
          </p>
          
          <Link 
            href="/typing" 
            className="brutalist-button inline-block text-lg"
          >
            Play Typing Game
          </Link>
        </div>
      </section>

      {/* Games */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mono uppercase text-center mb-12">
            Available Games
          </h2>
          
          <div className="grid gap-8">
            <Link 
              href="/typing"
              className="border-3 border-black p-8 bg-white hover:bg-gray-50 transition-colors block"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">⌨️</div>
                <h3 className="text-2xl font-bold mono uppercase mb-4">Typing Game</h3>
                <p className="text-gray-700 mb-4">
                  Copy text word by word in a hyper-minimal interface. 
                  Improve your typing speed and accuracy.
                </p>
                <div className="brutalist-button inline-block">
                  Play Now
                </div>
              </div>
            </Link>
            
            <div className="border-3 border-black p-8 bg-gray-100">
              <div className="text-center">
                <div className="text-6xl mb-4 opacity-50">🎮</div>
                <h3 className="text-2xl font-bold mono uppercase mb-4 opacity-50">More Games</h3>
                <p className="text-gray-500 mb-4">
                  Additional mini games coming soon...
                </p>
                <div className="border-3 border-gray-400 bg-gray-200 text-gray-500 px-6 py-3 font-bold uppercase tracking-wide inline-block">
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
