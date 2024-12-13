'use client'

import { Trophy, Sparkles } from 'lucide-react'
import { DogChallenge } from '@/app/types/dogchallenge'
import GradientButton from '@/app/components/GradientButton'
import ScrollableList from './ScrollableList'
import DogChallengeCard from './DogChallengeCard'
import Link from 'next/link'

interface DogChallengeListProps {
    dogChallenges: DogChallenge[]
    onAddClick?: () => void
    singleRow?: boolean
}

export default function DogChallengeList({
    dogChallenges,
    singleRow = false
}: DogChallengeListProps) {

    if (dogChallenges.length === 0) {
        return (
            <div className="dark:bg-black/10 rounded-3xl backdrop-blur-sm p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-[var(--background)]">
                        <Trophy className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium">No Active Challenges</h3>
                    <p className="text-[var(--foreground)]/60 max-w-md mb-6">
                        Your furry friend is ready for new adventures! Visit the challenges page to find exciting tasks to tackle together.
                    </p>
                    <Link href="/challenges">
                        <GradientButton className="px-6 py-3 font-medium">
                            Explore Challenges
                        </GradientButton>
                    </Link>
                </div>
            </div>
        )
    }

    const renderExploreMoreCard = () => (
        <Link 
            href="/challenges"
            className="block w-full sm:w-[300px] flex-shrink-0"
        >
            <div className="group relative bg-gradient-to-br from-[var(--accent)]/5 to-[var(--accent)]/10 hover:from-[var(--accent)]/10 hover:to-[var(--accent)]/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all h-[220px]">
                <div className="absolute inset-0 bg-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative p-6 flex flex-col items-center justify-center h-full text-center">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--accent)]/10 mb-4 group-hover:scale-110 transition-transform duration-500">
                        <Sparkles className="w-6 h-6 text-[var(--accent)]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Ready for More?</h3>
                    <p className="text-[var(--foreground)]/60 text-sm mb-4">
                        Discover new exciting challenges to boost your pup&apos;s growth journey!
                    </p>
                    <span className="text-[var(--accent)] text-sm font-medium group-hover:underline">
                        Explore Challenges →
                    </span>
                </div>
            </div>
        </Link>
    )

    return (
        <ScrollableList
            items={dogChallenges}
            renderItem={(dogChallenge: DogChallenge) => (
                <DogChallengeCard
                dogChallenge={dogChallenge}
            />
            )}
            renderAddButton={renderExploreMoreCard}
            showAddButton={true}
            singleRow={singleRow}
        />
    )
}