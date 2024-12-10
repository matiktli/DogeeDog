'use client'

import { PlusCircle, Trophy } from 'lucide-react'
import { DogChallenge } from '@/app/types/dogchallenge'
import GradientButton from '@/app/components/GradientButton'
import ScrollableList from './ScrollableList'
import DogChallengeCard from './DogChallengeCard'

interface DogChallengeListProps {
    dogChallenges: DogChallenge[]
    onAddClick?: () => void
    singleRow?: boolean
}

export default function DogChallengeList({
    dogChallenges,
    onAddClick,
    singleRow = false
}: DogChallengeListProps) {
    if (dogChallenges.length === 0) {

        return (
            <div className="text-center py-12 bg-white/40 dark:bg-black/10 rounded-3xl backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-2">No Dog Challenges Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create your first dog challenge!
                </p>
                <GradientButton
                    onClick={onAddClick}
                    className="px-6 py-3 font-medium"
                >
                    Create Your First Challenge
                </GradientButton>
            </div>
        )

        return (
            <div className="bg-white/40 dark:bg-black/10 rounded-3xl backdrop-blur-sm p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-[var(--background)]">
                        <Trophy className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium">No Dog Challenges Available</h3>
                    <p className="text-[var(--foreground)]/60 max-w-md">
                        Check back later for new challenges!
                    </p>
                </div>
            </div>
        )
    }

    const renderAddButton = () => (
        <button
            onClick={onAddClick}
            className="group relative bg-white/50 dark:bg-black/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all h-full"
        >
            <div className="p-6 flex flex-col items-center justify-center h-full min-h-[160px]">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--accent)]/10 mb-3 group-hover:scale-110 transition-transform">
                    <PlusCircle className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <p className="text-[var(--foreground)]/60 font-medium group-hover:text-[var(--foreground)] transition-colors">
                    Create New Dog Challenge
                </p>
            </div>
        </button>
    )

    return (
        <ScrollableList
            items={dogChallenges}
            renderItem={(dogChallenge: DogChallenge) => (
                <DogChallengeCard
                    dogChallenge={dogChallenge}
                />
            )}
            renderAddButton={renderAddButton}
            showAddButton={false}
            singleRow={singleRow}
        />
    )
}