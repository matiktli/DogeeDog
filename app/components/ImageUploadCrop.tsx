'use client'

import { useState, useRef } from 'react'
import { Camera, Upload } from 'lucide-react'
import Image from 'next/image'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageUploadCropProps {
  initialImage?: string | null
  onImageChange: (imageDataUrl: string | null) => void
  icon?: React.ReactNode
  required?: boolean
}

export default function ImageUploadCrop({
  initialImage,
  onImageChange,
  icon,
  required = false
}: ImageUploadCropProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null)
  const [showCropper, setShowCropper] = useState(false)
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  })
  const imgRef = useRef<HTMLImageElement>(null)

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

  const handleApplyCrop = () => {
    if (!imagePreview || !imgRef.current) return

    const image = imgRef.current
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Convert percentage crop to pixel values
    const pixelCrop: PixelCrop = {
      x: (crop.x * image.naturalWidth) / 100,
      y: (crop.y * image.naturalHeight) / 100,
      width: (crop.width * image.naturalWidth) / 100,
      height: (crop.height * image.naturalHeight) / 100,
      unit: 'px'
    }

    // Set canvas size to desired output size
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // Draw the cropped image
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )

    // Convert to base64
    const croppedImageUrl = canvas.toDataURL('image/jpeg')
    setImagePreview(croppedImageUrl)
    onImageChange(croppedImageUrl)
    setShowCropper(false)
  }

  const handleCancel = () => {
    setImagePreview(initialImage || null)
    setShowCropper(false)
    onImageChange(initialImage || null)
  }

  return (
    <>
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
            {icon}
            <Upload className="w-8 h-8 text-gray-400 relative z-10" />
            <span className="text-sm text-gray-400 mt-1 relative z-10">Upload photo</span>
          </label>
        )}
        <input
          id="image-upload"
          type="file"
          name="image"
          accept="image/*"
          required={required}
          onChange={handleImageChange}
          className="hidden"
        />
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
                <Image 
                  ref={imgRef}
                  src={imagePreview} 
                  alt="Crop preview" 
                  className="max-h-[50vh] object-contain"
                  width={300}
                  height={300}
                  style={{ objectFit: 'cover' }}
                />
              </ReactCrop>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleCancel}
                className="px-6 py-2 rounded-lg text-[#8B4513] hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCrop}
                className="px-6 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#6B3410]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}