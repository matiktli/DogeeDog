import Link from 'next/link'

interface VideoSectionProps {
  badge: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
  videoSrc?: string
  videoPosition?: 'left' | 'right'
}

export default function VideoSection({
  badge,
  title,
  description,
  buttonText,
  buttonLink,
  videoSrc = "/demo-video.mp4",
  videoPosition = 'left'
}: VideoSectionProps) {
  const videoElement = (
    <div className="relative p-4 bg-white/50 dark:bg-black/5 rounded-2xl shadow-xl">
      <video 
        className="w-full h-auto rounded-xl"
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )

  const contentElement = (
    <div className="text-left space-y-8">
      <div className="inline-block px-4 py-2 bg-[var(--accent)]/10 rounded-full">
        <span className="text-[var(--accent)] font-medium">{badge}</span>
      </div>
      <h2>
        <div className="text-5xl font-normal text-[var(--accent)] font-[var(--font-anchor-jack)] leading-tight">
          {title}
        </div>
      </h2>
      <p className="text-xl text-[var(--foreground)]/80 leading-relaxed">
        {description}
      </p>
      <Link 
        href={buttonLink}
        className="inline-block px-8 py-4 bg-[var(--accent)] text-white rounded-xl hover:bg-[var(--accent)]/90 transition-all hover:shadow-lg hover:scale-105 text-xl font-medium"
      >
        {buttonText}
      </Link>
    </div>
  )

  return (
    <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
      {videoPosition === 'left' ? (
        <>
          {videoElement}
          {contentElement}
        </>
      ) : (
        <>
          {contentElement}
          {videoElement}
        </>
      )}
    </div>
  )
} 