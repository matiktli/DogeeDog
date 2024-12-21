import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Link from 'next/link'
import PricingCard from './components/PricingCard'
import DemoFlow from './components/demo/DemoFlow'
import VideoSection from './components/VideoSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen">
        {/* Hero Section - Enhanced with gradient and better spacing */}
        <section className="w-full bg-gradient-to-b from-[var(--secondary)]/5 to-transparent">
          <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="text-left space-y-6">
                <div className="inline-block px-4 py-2 bg-[var(--accent)]/10 rounded-full border border-[var(--accent)]/20 backdrop-blur-sm">
                  <span className="text-[var(--accent)] font-medium flex items-center gap-2">
                    <span className="text-xl">🐕</span> Dog Walking Reimagined
                  </span>
                </div>
                
                <div className="space-y-4">
                  <h1 className="space-y-2">
                    <div className="text-7xl font-normal bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 text-transparent bg-clip-text font-[var(--font-anchor-jack)] leading-tight">
                      Upgrade your walks
                    </div>
                    <div className="text-5xl font-normal text-[var(--foreground)]/90 font-[var(--font-anchor-jack)] leading-tight">
                      with your furry friend
                    </div>
                  </h1>
                  <p className="text-xl text-[var(--foreground)]/70 leading-relaxed max-w-xl">
                    Turn your daily dog walks into exciting quests to beat procrastination
                    and boost both yours and your dog&apos;s health!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4 pt-6">
                  <Link 
                    href="/signup"
                    className="group px-8 py-4 bg-[var(--accent)] text-white rounded-xl 
                    transition-all duration-300 hover:shadow-lg hover:shadow-[var(--accent)]/20 
                    hover:scale-102 text-lg font-medium flex items-center gap-2
                    border border-[var(--accent)]/20"
                  >
                    Get Started Free
                    <svg 
                      className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 8l4 4m0 0l-4 4m4-4H3" 
                      />
                    </svg>
                  </Link>
                  <Link 
                    href="/signin"
                    className="group px-8 py-4 text-[var(--foreground)]/80 
                    hover:text-[var(--accent)] transition-colors duration-300 
                    font-medium flex items-center gap-2 hover:bg-[var(--accent)]/5 rounded-xl"
                  >
                    Sign In
                    <span className="transition-transform group-hover:translate-x-1 text-sm">→</span>
                  </Link>
                </div>
              </div>
              <div className="relative p-6 bg-white/50 dark:bg-black/5 rounded-2xl shadow-xl backdrop-blur-sm border border-white/20">
                <DemoFlow />
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section - Reduced padding */}
        <section className="w-full px-6 py-12 bg-gradient-to-b from-[var(--secondary)]/5 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-block px-4 py-2 bg-[var(--accent)]/10 rounded-full mb-4">
                <span className="text-[var(--accent)] font-medium">Features</span>
              </div>
              <h2 className="text-5xl font-[var(--font-anchor-jack)] text-[var(--accent)] mb-4">
                Make Walking Fun and Rewarding
              </h2>
              <p className="text-xl text-[var(--foreground)]/80">
                Turn your daily walks into exciting adventures with rewards and achievements!
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/50 dark:bg-black/5 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl">���</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Track Challenges</h3>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  Keep track of your challenge streaks and watch your progress grow as you complete more activities with your dog.
                </p>
              </div>
              <div className="bg-white/50 dark:bg-black/5 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl">🎮</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Gamified Walking</h3>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  Transform daily dog activities into fun challenges. Complete quests and unlock achievements together.
                </p>
              </div>
              <div className="bg-white/50 dark:bg-black/5 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl">🐕</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Dog Lovers Community</h3>
                <p className="text-[var(--foreground)]/80 leading-relaxed">
                  Join a community of passionate dog owners, share experiences, and participate in group challenges.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="w-full px-6 py-12">
          <VideoSection 
            badge="🦮 Dog Challenges"
            title="Adventure together"
            description="Transform your daily dog activities into exciting quests! Complete challenges together, earn rewards. Make every moment with your furry friend count!"
            buttonText="START YOUR ADVENTURE"
            buttonLink="/signup"
            videoSrc="videos/demo_complete_dog_challenge.mp4"
            videoPosition="left"
          />
        </section>

        {/* Problems Section - Reduced padding */}
        <section className="w-full px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-block px-4 py-2 bg-[var(--accent)]/10 rounded-full mb-4">
                <span className="text-[var(--accent)] font-medium">Common Challenges</span>
              </div>
              <h2 className="text-5xl font-[var(--font-anchor-jack)] text-[var(--accent)] mb-4">
                Walking Your Dog Shouldn&apos;t Be a Chore
              </h2>
              <p className="text-xl text-[var(--foreground)]/80">
                Many dog owners want to provide better exercise for their furry friends...
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
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

        {/* New Video Section - Challenges and Missions */}
        <section className="w-full px-6 py-12">
          <VideoSection 
            badge="🎯 Challenges & Missions"
            title="Complete quests together"
            description="Turn ordinary walks into exciting missions! Each challenge completed brings rewards and strengthens your bond. From simple tasks to daily adventures, make every activity count!"
            buttonText="JOIN THE ADVENTURE"
            buttonLink="/signup"
            videoSrc="videos/demo_missions.mp4"
            videoPosition="right"
          />
        </section>

        {/* CTA Section - Reduced padding */}
        <section className="w-full py-12 bg-gradient-to-b from-transparent to-[var(--secondary)]/5">
          <PricingCard />
        </section>

        <Footer />
      </div>
    </>
  );
}
