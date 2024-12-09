'use client'

import { PlusCircle } from 'lucide-react'
import DogCard from './DogCard'

interface Dog {
  _id: string
  name: string
  breed: string
  gender: string
  imageUrl: string
  userId: string
}

interface DogListProps {
  dogs: Dog[]
  showAddButton?: boolean
  onAddClick?: () => void
  onDogDelete?: () => void
}

export default function DogList({ 
  dogs, 
  showAddButton = false, 
  onAddClick, 
  onDogDelete 
}: DogListProps) {
  if (dogs.length === 0) {
    return (
      <div className="bg-white dark:bg-black/20 rounded-2xl p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={onAddClick}
            className="p-4 rounded-full bg-[var(--background)] hover:bg-[var(--background)]/80 transition-colors"
          >
            <PlusCircle className="w-12 h-12 text-[#8B4513]" />
          </button>
          <h3 className="text-lg font-medium">Add Your First Pup</h3>
          <p className="text-[var(--foreground)]/60 max-w-md">
            Start building your furry family by adding your first dog. 
            Click the plus icon to get started!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {dogs.map((dog) => (
        <DogCard
          key={dog._id}
          id={dog._id}
          name={dog.name}
          breed={dog.breed}
          gender={dog.gender}
          imageUrl={dog.imageUrl}
          userId={dog.userId}
          onDelete={onDogDelete}
        />
      ))}
      
      {showAddButton && (
        <button 
          onClick={onAddClick}
          className="group bg-white/50 dark:bg-black/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-white/80 dark:hover:bg-black/20 transition-all border-2 border-dashed border-gray-200 dark:border-gray-800 min-h-[300px]"
        >
          <div className="p-4 rounded-full bg-[var(--background)] group-hover:bg-[var(--background)]/80 transition-colors">
            <PlusCircle className="w-8 h-8 text-[#8B4513] opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-[var(--foreground)]/60 group-hover:text-[var(--foreground)]/80 transition-colors text-center">
            Add Another Pup
          </p>
        </button>
      )}
    </div>
  )
} 