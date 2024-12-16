'use client'

import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import 'swiper/css/effect-fade'
import { Card, CardContent } from '../components/ui/card'
import Loading from '../components/Loading'

interface DailyTipData {
  _id: string
  title: string
  description: string
  icon: string
}

export function DailyTipsSlider() {
  const [tips, setTips] = useState<DailyTipData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  const fetchTips = async () => {
    try {
      const response = await fetch('/api/tips/latest')
      const data = await response.json()
      setTips(data)
    } catch (error) {
      console.error('Error fetching tips:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTips()
  }, [])

  const handleGenerateTip = async () => {
    try {
      setIsGenerating(true)
      
      // First generate the tip
      const generateResponse = await fetch('/api/tips/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: 1 }),
      })

      if (!generateResponse.ok) {
        throw new Error('Failed to generate tip')
      }

      const [generatedTip] = await generateResponse.json()

      // Then save it to the database
      const saveResponse = await fetch('/api/tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generatedTip),
      })

      if (!saveResponse.ok) {
        throw new Error('Failed to save tip')
      }

      // Refresh the tips list
      await fetchTips()
    } catch (error) {
      console.error('Error generating tip:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return <Loading height="h-48" />
  }

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Daily Tips</h2>
        <button
          onClick={handleGenerateTip}
          disabled={isGenerating}
          className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/80 
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <Loading height="h-5" />
              Generating...
            </span>
          ) : (
            'Generate New Tip'
          )}
        </button>
      </div>

      {tips.length === 0 ? (
        <div className="text-center py-12 bg-white/40 dark:bg-black/10 rounded-xl">
          <p className="text-gray-600 dark:text-gray-400">No tips available yet.</p>
        </div>
      ) : (
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          pagination={{ 
            clickable: true,
            dynamicBullets: true
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          effect="fade"
          fadeEffect={{
            crossFade: true
          }}
          speed={1200}
          spaceBetween={20}
          slidesPerView={1}
          className="w-full rounded-xl"
        >
          {tips.map((tip) => (
            <SwiperSlide key={tip._id}>
              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-2xl">{tip.icon}</span>
                    <h3 className="text-lg font-semibold text-center px-4">{tip.title}</h3>
                    <span className="text-2xl">{tip.icon}</span>
                  </div>
                  <p className="text-muted-foreground text-center">{tip.description}</p>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
} 