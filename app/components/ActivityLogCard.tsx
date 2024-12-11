import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

type ActivityLogCardProps = {
  activity: {
    type: 'NEW_DOG' | 'NEW_CHALLENGE' | 'CHALLENGE_ACCEPTED'
    user: {
      _id: string
      name: string
    }
    dog?: {
      _id: string
      name: string
    }
    challenge?: {
      _id: string
      title: string
    }
    dogChallenge?: {
      _id: string
      dogId: string
      challengeId: string
    }
    createdAt: string
  }
}

export default function ActivityLogCard({ activity }: ActivityLogCardProps) {
  const renderContent = () => {
    const userLink = (
      <Link 
        href={`/profile/${activity.user._id}`}
        className="font-semibold hover:underline text-blue-600"
      >
        {activity.user.name}
      </Link>
    )

    switch (activity.type) {
      case 'NEW_DOG':
        return (
          <div className="flex items-center gap-1">
            {userLink} added new puppy{' '}
            <Link 
              href={`/dogs/${activity.dog?._id}`}
              className="font-semibold hover:underline text-blue-600"
            >
              {activity.dog?.name}
            </Link>
          </div>
        )

      case 'NEW_CHALLENGE':
        return (
          <div className="flex items-center gap-1">
            {userLink} added new challenge{' '}
            <Link 
              href={`/challenges/${activity.challenge?._id}`}
              className="font-semibold hover:underline text-blue-600"
            >
              {activity.challenge?.title}
            </Link>
          </div>
        )

      case 'CHALLENGE_ACCEPTED':
        return (
          <div className="flex items-center gap-1">
            {userLink} accepted challenge{' '}
            <Link 
              href={`/challenges/${activity.dogChallenge?.challengeId}`}
              className="font-semibold hover:underline text-blue-600"
            >
              {activity.challenge?.title}
            </Link>
            {' '}with dog:{' '}
            <Link 
              href={`/dogs/${activity.dogChallenge?.dogId}`}
              className="font-semibold hover:underline text-blue-600"
            >
              {activity.dog?.name}
            </Link>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {renderContent()}
        </div>
        <span className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  )
} 