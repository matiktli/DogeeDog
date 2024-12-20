'use client'

import { useState } from 'react'
import { X, Dog } from 'lucide-react'
import Portal from '../Portal'

interface DemoPetFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (dog: any) => void
}

export default function DemoPetFormModal({ 
  isOpen, 
  onClose,
  onSubmit 
}: DemoPetFormModalProps) {
  const [name, setName] = useState('')
  const [breed, setBreed] = useState('')
  const [breedSuggestions] = useState([
    'Labrador Retriever',
    'German Shepherd',
    'Golden Retriever',
    'French Bulldog',
    'Beagle'
  ])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      _id: 'demo-dog',
      name,
      breed,
      imageUrl: 'https://dogeedog.s3.eu-west-2.amazonaws.com/public/icon.png'
    })
    setName('')
    setBreed('')
  }

  if (!isOpen) return null

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Add New Pet</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B4513] dark:bg-gray-700 dark:border-gray-600"
                  placeholder="What's your pet's name?"
                />
              </div>

              {/* Breed Input */}
              <div className="relative">
                <label className="block text-sm font-medium mb-1">Breed</label>
                <div className="relative">
                  <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    required
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B4513] dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Search for a breed..."
                  />
                  <Dog className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                {showSuggestions && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-lg">
                    {breedSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => {
                          setBreed(suggestion)
                          setShowSuggestions(false)
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#FF8551] text-white rounded-xl hover:bg-[#FF8551]/90 transition-colors font-medium"
              >
                Add Pet
              </button>
            </form>
          </div>
        </div>
      </div>
    </Portal>
  )
} 