import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen">
        {/* Hero Section */}
        <section className="w-full max-w-6xl px-6 pt-32 pb-32 text-center">
          <h1 className="mb-6">
            <div className="text-7xl font-normal text-[var(--accent)] font-[var(--font-anchor-jack)]">
              Upgrade your walks
            </div>
            <div className="text-6xl font-normal text-[var(--foreground)] font-[var(--font-anchor-jack)] mt-2">
              with your furry friend
            </div>
          </h1>
          <p className="text-xl text-[var(--foreground)]/80 max-w-2xl mx-auto mb-12">
            Turn your daily dog walks into exciting quests to beat procrastination
            and boost both yours and your dog&apos;s health!
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link 
              href="/signup"
              className="px-8 py-4 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent)]/90 transition-colors text-xl"
            >
              START WALKING TOGETHER
            </Link>
            <Link 
              href="/signin"
              className="text-[var(--foreground)]/80 hover:text-[var(--accent)] transition-colors"
            >
              I HAVE AN ACCOUNT
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full bg-[var(--secondary)]/10 py-20">
          <div className="max-w-6xl mx-auto flex justify-center gap-24 flex-wrap">
            <div className="text-center">
              <div className="text-5xl font-bold text-[var(--accent)]">4.8/5</div>
              <div className="text-[var(--foreground)] mt-2">from 2,000+ walkers</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[var(--accent)]">10,000+</div>
              <div className="text-[var(--foreground)] mt-2">walks completed</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[var(--accent)]">5,000+</div>
              <div className="text-[var(--foreground)] mt-2">happy dogs</div>
            </div>
          </div>
        </section>

        {/* Problems Section */}
        <section className="w-full px-6 py-32">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-[var(--font-anchor-jack)] text-center text-[var(--accent)] mb-4">
              Walking Your Dog Shouldn&apos;t Be a Chore
            </h2>
            <p className="text-xl text-center text-[var(--foreground)]/80 mb-20 max-w-2xl mx-auto">
              Many dog owners want to provide better exercise for their furry friends...
            </p>
            <div className="grid md:grid-cols-3 gap-16">
              <div className="bg-white/50 dark:bg-black/5 rounded-2xl p-10 text-center">
                <div className="text-6xl mb-6">🎯</div>
                <h3 className="text-2xl font-bold mb-3">Set Walking Goals</h3>
                <p className="text-[var(--foreground)]/80">&quot;We should walk more together&quot;</p>
              </div>
              <div className="bg-white/50 dark:bg-black/5 rounded-2xl p-10 text-center">
                <div className="text-6xl mb-6">🌧️</div>
                <h3 className="text-2xl font-bold mb-3">Face Challenges</h3>
                <p className="text-[var(--foreground)]/80">&quot;Weather&apos;s bad, maybe tomorrow...&quot;</p>
              </div>
              <div className="bg-white/50 dark:bg-black/5 rounded-2xl p-10 text-center">
                <div className="text-6xl mb-6">😔</div>
                <h3 className="text-2xl font-bold mb-3">Miss Opportunities</h3>
                <p className="text-[var(--foreground)]/80">&quot;Another day without exercise&quot;</p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="w-full px-6 py-32 bg-[var(--secondary)]/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-[var(--font-anchor-jack)] text-center text-[var(--accent)] mb-4">
              Make Walking Fun and Rewarding
            </h2>
            <p className="text-xl text-center text-[var(--foreground)]/80 mb-20 max-w-2xl mx-auto">
              Turn your daily walks into exciting adventures with rewards and achievements!
            </p>
            <div className="grid md:grid-cols-3 gap-16">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Track Progress</h3>
                <p className="text-[var(--foreground)]/80">
                  Monitor your walking streaks, distance covered, and time spent with your furry friend.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Earn Rewards</h3>
                <p className="text-[var(--foreground)]/80">
                  Get points and badges for consistent walking. Unlock achievements for you and your dog.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Join Community</h3>
                <p className="text-[var(--foreground)]/80">
                  Connect with other dog owners, share routes, and participate in challenges.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-32">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-5xl font-[var(--font-anchor-jack)] text-[var(--accent)] mb-6">
              Start Your Walking Journey Today
            </h2>
            <p className="text-xl text-[var(--foreground)]/80 mb-12 max-w-2xl mx-auto">
              Join thousands of happy dogs and their owners on their daily adventures.
            </p>
            <Link 
              href="/signup"
              className="px-8 py-4 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent)]/90 transition-colors text-xl inline-block"
            >
              Get Started - It&apos;s Free
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
