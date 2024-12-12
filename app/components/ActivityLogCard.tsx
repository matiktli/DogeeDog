import { formatDistanceToNow } from 'date-fns'
import UserPill from './UserPill'
import DogPill from './DogPill'
import LoadingScreen from './LoadingScreen'
import { 
    UserPlus, 
    Dog, 
    Trophy, 
    CheckCircle2, 
    Target 
} from 'lucide-react'
import { useRouter } from 'next/navigation'

const trimText = (text: string, maxLength: number = 30) => {
    const isMobile = window.innerWidth < 640
    const limit = isMobile ? 20 : maxLength
    return text.length > limit ? `${text.substring(0, limit)}...` : text
}

type ActivityLogCardProps = {
    activity: {
        type: 'NEW_DOG' | 'NEW_CHALLENGE' | 'CHALLENGE_ACCEPTED' | 'NEW_USER' | 'CHALLENGE_COMPLETED'
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

const getActivityIcon = (type: string) => {
    const iconClass = "w-5 h-5 text-[var(--accent)]"
    
    switch (type) {
        case 'NEW_USER':
            return <UserPlus className={iconClass} />
        case 'NEW_DOG':
            return <Dog className={iconClass} />
        case 'NEW_CHALLENGE':
            return <Trophy className={iconClass} />
        case 'CHALLENGE_ACCEPTED':
            return <Target className={iconClass} />
        case 'CHALLENGE_COMPLETED':
            return <CheckCircle2 className={iconClass} />
        default:
            return null
    }
}

export default function ActivityLogCard({ activity, isLoading }: ActivityLogCardProps) {
    const router = useRouter()

    const handleChallengeClick = async (challengeId: string) => {
        try {
            const response = await fetch(`/api/challenges/${challengeId}`)
            if (!response.ok) throw new Error('Failed to fetch challenge')
            const challenge = await response.json()
            router.push(`/challenges?challengeId=${challengeId}&challenge=${JSON.stringify(challenge)}`)
        } catch (error) {
            console.error('Error fetching challenge:', error)
        }
    }

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
                        <button 
                            onClick={() => handleChallengeClick(activity.data?.challenge._id)}
                            className="font-semibold text-[var(--accent)] hover:text-[var(--secondary)] sm:text-base text-sm cursor-pointer" 
                            title={activity.data?.challenge.title}
                        >
                            {trimText(activity.data?.challenge.title)}
                        </button>
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

            case 'CHALLENGE_COMPLETED':
                return (
                    <div className="flex flex-wrap items-center gap-1 sm:text-base text-sm">
                        {userPill} 
                        <span className="whitespace-nowrap">completed challenge</span>{' '}
                        <button 
                            onClick={() => handleChallengeClick(activity.data?.challenge._id)}
                            className="font-semibold text-[var(--accent)] hover:text-[var(--secondary)] sm:text-base text-sm cursor-pointer" 
                            title={activity.data?.challenge.title}
                        >
                            {trimText(activity.data?.challenge.title)}
                        </button>
                        <span className="whitespace-nowrap">with dog:</span>{' '}
                        <DogPill
                            dogId={activity.data.dog._id}
                            className="text-[var(--accent)] hover:text-[var(--secondary)] sm:text-base text-sm"
                        />
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="bg-[var(--background)] rounded-lg shadow p-3 sm:p-4 mb-3 sm:mb-4 border border-[var(--foreground)]/10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                <div className="flex-1 flex items-center gap-3">
                    <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                    </div>
                    <div>
                        {renderContent()}
                    </div>
                </div>
                <span className="text-xs sm:text-sm text-[var(--foreground)]/60 whitespace-nowrap">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </span>
            </div>
        </div>
    )
} 