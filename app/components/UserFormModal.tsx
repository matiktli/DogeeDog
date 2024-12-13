'use client'

import { useState } from 'react'
import { X, User as UserIcon } from 'lucide-react'
import ImageUploadCrop from './ImageUploadCrop'
import GradientButton from './GradientButton'

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: {
    id: string
    name: string
    email: string
    imageUrl?: string
    description?: string
  }
  onUpdate: () => void
}

export default function UserFormModal({ 
  isOpen, 
  onClose,
  initialData,
  onUpdate
}: UserFormModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null)
  const [isLoading, setIsLoading] = useState(false)
  const [description, setDescription] = useState(initialData?.description || '')
  const maxChars = 400

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const form = e.target as HTMLFormElement
      const nameInput = form.querySelector<HTMLInputElement>('input[name="name"]')
      
      if (!nameInput?.value) {
        throw new Error('Please fill in all required fields')
      }

      const formData = new FormData()
      formData.append('name', nameInput.value)
      formData.append('description', description)

      // Only include image if it's changed
      if (imagePreview && imagePreview !== initialData?.imageUrl) {
        // Convert base64 to blob
        const base64Response = await fetch(imagePreview)
        const blob = await base64Response.blob()
        
        // Create a File object with proper name and type
        const file = new File([blob], 'profile-image.jpg', { 
          type: 'image/jpeg',
          lastModified: new Date().getTime()
        })
        
        formData.append('image', file)
      }

      const res = await fetch(`/api/users/${initialData.id}`, {
        method: 'PUT',
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to update profile')
      }

      onUpdate()
      onClose()
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="flex justify-center">
              <ImageUploadCrop
                initialImage={initialData?.imageUrl}
                onImageChange={setImagePreview}
                icon={<UserIcon className="w-24 h-24 text-gray-200 dark:text-gray-700 absolute" />}
              />
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                defaultValue={initialData?.name}
                required
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B4513] dark:bg-gray-700 dark:border-gray-600"
                placeholder="Your name"
              />
            </div>

            {/* Description Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">About</label>
                <span className={`text-xs ${description.length > maxChars ? 'text-red-500' : 'text-gray-500'}`}>
                  {description.length}/{maxChars}
                </span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={maxChars}
                rows={4}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B4513] dark:bg-gray-700 dark:border-gray-600 resize-none"
                placeholder="Tell others about yourself and your pets..."
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={initialData?.email}
                readOnly
                className="w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-600 cursor-not-allowed"
              />
            </div>

            <GradientButton
              type="submit"
              disabled={isLoading || description.length > maxChars}
              className="w-full py-3 font-medium mt-8"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </GradientButton>
          </form>
        </div>
      </div>
    </div>
  )
} 