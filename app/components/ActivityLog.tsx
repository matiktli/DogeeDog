import { useEffect, useState } from 'react'
import ActivityLogCard from './ActivityLogCard'

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

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          size: '10',
          ...(type && { type }),
          ...(userId && { userId }),
          ...(challengeId && { challengeId })
        })

        const response = await fetch(`/api/activity?${params}`)
            const data = await response.json()
  
            if (page === 1) {
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

    fetchActivities()
  }, [type, userId, challengeId, page])

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <ActivityLogCard 
          key={`${activity.type}-${activity.createdAt}-${activity.actor._id}`} 
          activity={activity} 
        />
      ))}
      
      {loading && (
        <div className="text-center py-4">
          Loading...
        </div>
      )}

      {!loading && hasMore && (
        <button
          onClick={() => setPage(p => p + 1)}
          className="w-full py-2 text-blue-600 hover:text-blue-800"
        >
          Load more
        </button>
      )}

      {!loading && !hasMore && activities.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No activities found
        </div>
      )}
    </div>
  )
} 