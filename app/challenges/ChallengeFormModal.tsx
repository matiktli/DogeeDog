'use client'

import { useState, useEffect } from 'react'
import { X, Bot, Loader2 } from 'lucide-react'
import GradientButton from '../components/GradientButton'
import { Challenge } from '@/app/types/challenge'
import EmojiPicker from '../components/EmojiPicker'

interface ChallengeFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: Challenge
  onSuccess?: () => void
}

export default function ChallengeFormModal({ 
  isOpen, 
  onClose,
  initialData,
  onSuccess
}: ChallengeFormModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [titleError, setTitleError] = useState<string | null>(null)
  const [descriptionError, setDescriptionError] = useState<string | null>(null)
  const [rewardError, setRewardError] = useState<string | null>(null)
  const [selectedEmoji, setSelectedEmoji] = useState<string>(initialData?.icon || '')
  const [selectedPeriod, setSelectedPeriod] = useState<'DAY' | 'WEEK'>(initialData?.period || 'DAY')
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    reward: initialData?.reward || 10,
  })

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.title || '',
        description: initialData?.description || '',
        reward: initialData?.reward || 10,
      })
      setSelectedEmoji(initialData?.icon || '')
      setSelectedPeriod(initialData?.period || 'DAY')
      setTitleError(null)
      setDescriptionError(null)
      setRewardError(null)
      setIsLoading(false)
      setIsGenerating(false)
    }
  }, [isOpen, initialData])

  const validateTitle = (value: string): boolean => {
    if (value.length < 2) {
      setTitleError("Title must be at least 2 characters long")
      return false
    }
    if (value.length > 50) {
      setTitleError("Title must be less than 50 characters")
      return false
    }
    setTitleError(null)
    return true
  }

  const validateDescription = (value: string): boolean => {
    if (value.length > 400) {
      setDescriptionError("Description must be less than 400 characters")
      return false
    }
    setDescriptionError(null)
    return true
  }

  const handleGenerateWithAI = async () => {
    try {
      setIsGenerating(true)
      const response = await fetch('/api/challenges/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          period: selectedPeriod,
          count: 1,
          type: 'USER'
        }),
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to generate challenge')
      }

      const [generatedChallenge] = await response.json()
      
      const updateFormWithGeneratedData = () => {
        setFormData({
          title: generatedChallenge.title,
          description: generatedChallenge.description,
          reward: generatedChallenge.reward,
        })
        setSelectedEmoji(generatedChallenge.icon)
      }

      setTimeout(updateFormWithGeneratedData, 0)

    } catch (error) {
      console.error('Error generating challenge:', error)
      alert('Failed to generate challenge. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedEmoji) {
      alert('Please select an emoji for your challenge')
      return
    }

    const isTitleValid = validateTitle(formData.title)
    const isDescriptionValid = validateDescription(formData.description)
    
    if (!isTitleValid || !isDescriptionValid) {
      return
    }

    try {
      setIsLoading(true)

      const data = {
        title: formData.title,
        description: formData.description,
        reward: formData.reward,
        icon: selectedEmoji,
        period: selectedPeriod,
        type: 'USER'
      }

      const url = initialData 
        ? `/api/challenges/${initialData._id}`
        : '/api/challenges'

      const res = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Failed to save challenge')

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error saving challenge:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRewardBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const reward = parseInt(e.target.value)
    if (isNaN(reward) || reward < 1) {
      setRewardError("Reward points must be a positive number")
    }
  }

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md relative"
        onClick={handleModalContentClick}
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-3 sm:p-6">
          <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6 pr-6">
            {initialData ? 'Edit Challenge' : 'Create New Challenge'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-6">
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <label className="block text-sm font-medium">Choose an emoji</label>
              <EmojiPicker
                onEmojiSelect={setSelectedEmoji}
                selectedEmoji={selectedEmoji}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 sm:mb-2">Challenge Period</label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPeriod('DAY')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border-2 transition-colors text-sm ${
                    selectedPeriod === 'DAY'
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                      : 'border-gray-200 dark:border-gray-700 hover:border-[var(--accent)]'
                  }`}
                >
                  Daily
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPeriod('WEEK')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border-2 transition-colors text-sm ${
                    selectedPeriod === 'WEEK'
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                      : 'border-gray-200 dark:border-gray-700 hover:border-[var(--accent)]'
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Title <span className="text-xs text-[var(--foreground)]/60">(2-50 chars)</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                maxLength={50}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] dark:bg-gray-700 dark:border-gray-600 text-sm ${
                  titleError ? 'border-red-500' : ''
                }`}
                placeholder="Enter challenge title"
                onBlur={(e) => validateTitle(e.target.value)}
                onFocus={() => setTitleError(null)}
              />
              {titleError && (
                <p className="mt-0.5 text-red-500 text-xs sm:text-sm">{titleError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description <span className="text-xs text-[var(--foreground)]/60">(max 400)</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                maxLength={400}
                rows={3}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] dark:bg-gray-700 dark:border-gray-600 text-sm ${
                  descriptionError ? 'border-red-500' : ''
                }`}
                placeholder="Describe your challenge"
                onBlur={(e) => validateDescription(e.target.value)}
                onFocus={() => setDescriptionError(null)}
              />
              {descriptionError && (
                <p className="mt-0.5 text-red-500 text-xs sm:text-sm">{descriptionError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Reward Points</label>
              <input
                type="number"
                name="reward"
                value={formData.reward}
                onChange={(e) => setFormData(prev => ({ ...prev, reward: parseInt(e.target.value) || 0 }))}
                required
                min="1"
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] dark:bg-gray-700 dark:border-gray-600 text-sm ${
                  rewardError ? 'border-red-500' : ''
                }`}
                placeholder="Enter reward points"
                onBlur={handleRewardBlur}
                onFocus={() => setRewardError(null)}
              />
              {rewardError && (
                <p className="mt-0.5 text-red-500 text-xs sm:text-sm">{rewardError}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleGenerateWithAI}
                disabled={isGenerating || isLoading}
                className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-2 
                  border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)]/10 
                  transition-colors disabled:opacity-50 font-medium text-sm"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
                Generate with AI
              </button>

              <GradientButton
                type="submit"
                disabled={isLoading || isGenerating}
                className="px-3 py-2 sm:px-6 sm:py-3 font-medium text-sm"
              >
                {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Challenge'}
              </GradientButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 