import { useEffect, useState, useRef, useCallback } from 'react'
import ActivityLogCard from './ActivityLogCard'
import Loading from './Loading'

type Activity = {
  type: 'NEW_DOG' | 'NEW_CHALLENGE' | 'CHALLENGE_ACCEPTED' | 'NEW_USER'
  actor: {
    _id: string
    name: string
    imageUrl: string
  }
  data: object
  createdAt: string
}

type ActivityLogProps = {
  type?: 'NEW_DOG' | 'NEW_CHALLENGE' | 'CHALLENGE_ACCEPTED'
  userId?: string
  challengeId?: string
}

export default function ActivityLog({ type, userId, challengeId }: ActivityLogProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)

  const fetchActivities = async (pageNum: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        size: '10',
        ...(type && { type }),
        ...(userId && { userId }),
        ...(challengeId && { challengeId })
      })

      const response = await fetch(`/api/activity?${params}`)
      const data = await response.json()

      if (pageNum === 1) {
        setActivities(data.activities)
      } else {
        setActivities(prev => [...prev, ...data.activities])
      }

      setHasMore(data.pagination.currentPage < data.pagination.totalPages)
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }

  // Reset everything when filters change
  useEffect(() => {
    setActivities([])
    setPage(1)
    setHasMore(true)
    setLoading(true)
    fetchActivities(1)
  }, [type, userId, challengeId])

  // Intersection Observer setup
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries
    if (target.isIntersecting && hasMore && !loading) {
      setPage(prev => prev + 1)
      setLoading(true)
    }
  }, [hasMore, loading])

  useEffect(() => {
    if (page > 1) {
      fetchActivities(page)
    }
  }, [page])

  useEffect(() => {
    const element = observerTarget.current
    if (!element) return

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1.0,
    })

    observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [handleObserver])

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <ActivityLogCard 
          key={`${activity.type}-${activity.createdAt}-${activity.actor._id}`} 
          activity={activity} 
        />
      ))}
      
      {/* Loading indicator for both initial and subsequent loads */}
      {loading && (
        <Loading height={activities.length === 0 ? "h-[50vh]" : "h-32"} />
      )}

      {/* Observer target */}
      <div ref={observerTarget} className="h-4" />

      {!loading && !hasMore && activities.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No activities found
        </div>
      )}
    </div>
  )
}