import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

type ActivityLogCardProps = {
    activity: {
        type: 'NEW_DOG' | 'NEW_CHALLENGE' | 'CHALLENGE_ACCEPTED' | 'NEW_USER'
        actor: {
            _id: string
            name: string
            imageUrl: string
        }
        data: any
        createdAt: string
    }
}

export default function ActivityLogCard({ activity }: ActivityLogCardProps) {
    const renderContent = () => {
        const userLink = (
            <Link
                href={`/profile/${activity.actor._id}`}
                className="font-semibold hover:underline text-blue-600"
            >
                {activity.actor.name}
            </Link>
        )

        switch (activity.type) {
            case 'NEW_DOG':
                return (
                    <div className="flex items-center gap-1">
                        {userLink} added new puppy{' '}
                        <Link
                            href={`/dogs/${activity.data?._id}`}
                            className="font-semibold hover:underline text-blue-600"
                        >
                            {activity.data?.name}
                        </Link>
                    </div>
                )

            case 'NEW_CHALLENGE':
                return (
                    <div className="flex items-center gap-1">
                        {userLink} added new challenge{' '}
                        <Link
                            href={`/challenges/${activity.data?._id}`}
                            className="font-semibold hover:underline text-blue-600"
                        >
                            {activity.data?.title}
                        </Link>
                    </div>
                )

            case 'CHALLENGE_ACCEPTED':
                return (
                    <div className="flex items-center gap-1">
                        {userLink} accepted challenge{' '}
                        <Link
                            href={`/challenges/${activity.data.challenge._id}`}
                            className="font-semibold hover:underline text-blue-600"
                        >
                            {activity.data?.challenge.title}
                        </Link>
                        {' '}with dog:{' '}
                        <Link
                            href={`/dogs/${activity.data.dog._id}`}
                            className="font-semibold hover:underline text-blue-600"
                        >
                            {activity.data.dog.name}
                        </Link>
                    </div>
                )

            case 'NEW_USER':
                return (
                    <div className="flex items-center gap-1">
                        {userLink} joined the app{' '}
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