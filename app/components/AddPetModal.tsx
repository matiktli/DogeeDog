'use client'

import { useState, useEffect } from 'react'
import { X, Dog, Camera, Upload } from 'lucide-react'
import Image from 'next/image'
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useSession } from 'next-auth/react'

interface Breed {
  key: string
  avatar: string
}

interface AddPetModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddPetModal({ isOpen, onClose }: AddPetModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [breeds, setBreeds] = useState<Breed[]>([])
  const [breedInput, setBreedInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>([])
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  })
  const [showCropper, setShowCropper] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [breedError, setBreedError] = useState<string | null>(null)

  const { data: session } = useSession()

  useEffect(() => {
    fetch('/data/dog-breeds.json')
      .then(res => res.json())
      .then(data => setBreeds(data.breeds))
  }, [])

  useEffect(() => {
    if (breedInput) {
      const filtered = breeds.filter(breed =>
        breed.key.toLowerCase().includes(breedInput.toLowerCase())
      )
      setFilteredBreeds(filtered)
    } else {
      setFilteredBreeds([])
    }
  }, [breedInput, breeds])

  const handleBreedSelect = (breed: string) => {
    setBreedInput(breed)
    setShowSuggestions(false)
    setBreedError(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setShowCropper(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = (croppedImage: string) => {
    setImagePreview(croppedImage)
    setShowCropper(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!imagePreview) return

    try {
      setIsLoading(true)

      // Convert base64 to blob
      const response = await fetch(imagePreview)
      const blob = await response.blob()
      const file = new File([blob], 'pet-image.jpg', { type: 'image/jpeg' })

      const form = e.target as HTMLFormElement
      const formData = new FormData()
      const nameInput = form.querySelector<HTMLInputElement>('input[name="name"]')
      const genderInput = form.querySelector<HTMLInputElement>('input[name="gender"]:checked')
      
      if (!nameInput?.value || !breedInput || !genderInput?.value) {
        throw new Error('Please fill in all required fields')
      }
      
      formData.append('name', nameInput.value)
      formData.append('breed', breedInput)
      formData.append('gender', genderInput.value)
      formData.append('image', file)

      const res = await fetch('/api/dogs', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Failed to create pet')
      }

      onClose()
    } catch (error) {
      console.error('Error creating pet:', error)
      // TODO: Add error notification here
    } finally {
      setIsLoading(false)
    }
  }

  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setNameError(e.target.value.trim() === '')
  }

  const handleBreedBlur = () => {
    if (breedInput.trim() === '') {
      setBreedError('We\'d love to know your pup\'s breed!')
    } else if (!breeds.some(breed => breed.key.toLowerCase() === breedInput.toLowerCase())) {
      setBreedError('Sorry, we haven\'t heard about this breed')
    } else {
      setBreedError(null)
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
          <h2 className="text-2xl font-bold mb-6">Add New Pet</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="flex justify-center">
              <div className="relative group">
                {imagePreview ? (
                  <div className="relative w-32 h-32">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="rounded-full object-cover"
                    />
                    <label 
                      htmlFor="image-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="w-8 h-8 text-white" />
                    </label>
                  </div>
                ) : (
                  <label 
                    htmlFor="image-upload"
                    className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-[#8B4513] transition-colors relative"
                  >
                    <Dog className="w-24 h-24 text-gray-200 dark:text-gray-700 absolute" />
                    <Upload className="w-8 h-8 text-gray-400 relative z-10" />
                    <span className="text-sm text-gray-400 mt-1 relative z-10">Upload photo</span>
                  </label>
                )}
                <input
                  id="image-upload"
                  type="file"
                  name="image"
                  accept="image/*"
                  required
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B4513] dark:bg-gray-700 dark:border-gray-600"
                placeholder="What's your pet's name?"
                onBlur={handleNameBlur}
              />
              {nameError && <span className="mt-1 text-sm text-red-500">
                Every pup deserves a name! What's your furry friend called?
              </span>}
            </div>

            {/* Breed Input */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Breed</label>
              <div className="relative">
                <input
                  type="text"
                  name="breed"
                  value={breedInput}
                  onChange={(e) => {
                    setBreedInput(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => {
                    setShowSuggestions(true)
                    setBreedError(null)
                  }}
                  onBlur={handleBreedBlur}
                  required
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B4513] dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Search for a breed..."
                />
                <Dog className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {breedError && <span className="mt-1 text-sm text-red-500">
                {breedError}
              </span>}
              {showSuggestions && filteredBreeds.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-auto">
                  {filteredBreeds.map((breed) => (
                    <button
                      key={breed.key}
                      type="button"
                      className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => handleBreedSelect(breed.key)}
                    >
                      {breed.avatar ? (
                        <Image
                          src={breed.avatar}
                          alt={breed.key}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <Dog className="w-8 h-8 text-gray-400" />
                      )}
                      <span className="font-medium">{breed.key}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Gender Select */}
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative flex items-center justify-center gap-2 px-4 py-3 border rounded-xl cursor-pointer transition-all duration-200 group">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="male" 
                    required 
                    className="peer hidden" 
                  />
                  <span className="relative z-10">♂️ Male</span>
                  <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 peer-checked:opacity-20 rounded-xl transition-opacity duration-200"></div>
                </label>
                <label className="relative flex items-center justify-center gap-2 px-4 py-3 border rounded-xl cursor-pointer transition-all duration-200 group">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="female" 
                    required 
                    className="peer hidden" 
                  />
                  <span className="relative z-10">♀️ Female</span>
                  <div className="absolute inset-0 bg-pink-500 opacity-0 group-hover:opacity-10 peer-checked:opacity-20 rounded-xl transition-opacity duration-200"></div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#8B4513] text-white py-3 rounded-xl hover:bg-[#6B3410] transition-colors disabled:opacity-50 font-medium mt-8"
            >
              {isLoading ? 'Adding...' : 'Add Pet'}
            </button>
          </form>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && imagePreview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl max-w-xl w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-[#8B4513]">Crop Image</h3>
            <div className="max-h-[60vh] overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg">
              <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                aspect={1}
                circularCrop
                className="max-h-full"
              >
                <img 
                  src={imagePreview} 
                  alt="Crop preview" 
                  className="max-h-[50vh] object-contain"
                />
              </ReactCrop>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setImagePreview(null)
                  setShowCropper(false)
                }}
                className="px-6 py-2 rounded-lg text-[#8B4513] hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCropComplete(imagePreview)}
                className="px-6 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#6B3410]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 