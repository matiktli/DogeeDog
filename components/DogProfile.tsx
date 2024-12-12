import React from 'react'
import { DogData } from '@/types/dog'

interface DogProfileProps {
  dog: DogData;
}

const DogProfile: React.FC<DogProfileProps> = ({ dog }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">About</h3>
      {dog.description ? (
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{dog.description}</p>
      ) : (
        <p className="text-gray-500 italic">No description provided</p>
      )}
    </div>
  )
}

export default DogProfile