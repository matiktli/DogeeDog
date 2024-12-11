import { formatDistanceToNow } from 'date-fns'
import UserPill from './UserPill'
import DogPill from './DogPill'
import LoadingScreen from './LoadingScreen'

const trimText = (text: string, maxLength: number = 30) => {
    const isMobile = window.innerWidth < 640
    const limit = isMobile ? 20 : maxLength
    return text.length > limit ? `${text.substring(0, limit)}...` : text
}

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
    isLoading?: boolean
}

export default function ActivityLogCard({ activity, isLoading }: ActivityLogCardProps) {
    if (isLoading) {
        return <LoadingScreen />
    }

    const renderContent = () => {
        const userPill = (
            <UserPill 
                userId={activity.actor._id} 
                className="text-[var(--accent)] hover:text-[var(--secondary)] sm:text-base text-sm"
            />
        )

        switch (activity.type) {
            case 'NEW_DOG':
                return (
                    <div className="flex flex-wrap items-center gap-1 sm:text-base text-sm">
                        {userPill} 
                        <span className="whitespace-nowrap">added new puppy</span>{' '}
                        <DogPill
                            dogId={activity.data._id}
                            className="text-[var(--accent)] hover:text-[var(--secondary)] sm:text-base text-sm"
                        />
                    </div>
                )

            case 'NEW_CHALLENGE':
                return (
                    <div className="flex flex-wrap items-center gap-1 sm:text-base text-sm">
                        {userPill} 
                        <span className="whitespace-nowrap">added new challenge</span>{' '}
                        <span 
                            className="font-semibold text-[var(--accent)] hover:text-[var(--secondary)] sm:text-base text-sm" 
                            title={activity.data?.title}
                        >
                            {trimText(activity.data?.title)}
                        </span>
                    </div>
                )

            case 'CHALLENGE_ACCEPTED':
                return (
                    <div className="flex flex-wrap items-center gap-1 sm:text-base text-sm">
                        {userPill} 
                        <span className="whitespace-nowrap">accepted challenge</span>{' '}
                        <span 
                            className="font-semibold text-[var(--accent)] hover:text-[var(--secondary)] sm:text-base text-sm" 
                            title={activity.data?.challenge.title}
                        >
                            {trimText(activity.data?.challenge.title)}
                        </span>
                        <span className="whitespace-nowrap">with dog:</span>{' '}
                        <DogPill
                            dogId={activity.data.dog._id}
                            className="text-[var(--accent)] hover:text-[var(--secondary)] sm:text-base text-sm"
                        />
                    </div>
                )

            case 'NEW_USER':
                return (
                    <div className="flex flex-wrap items-center gap-1 sm:text-base text-sm">
                        {userPill} 
                        <span className="whitespace-nowrap">joined the app</span>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="bg-[var(--background)] rounded-lg shadow p-3 sm:p-4 mb-3 sm:mb-4 border border-[var(--foreground)]/10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                <div className="flex-1">
                    {renderContent()}
                </div>
                <span className="text-xs sm:text-sm text-[var(--foreground)]/60 whitespace-nowrap">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </span>
            </div>
        </div>
    )
} 