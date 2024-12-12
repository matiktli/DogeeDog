import { ButtonHTMLAttributes, useState } from 'react'

export interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline'
  className?: string
  completitionLoadOnClick?: boolean
}

export default function GradientButton({
  children,
  variant = 'solid',
  className = '',
  completitionLoadOnClick = false,
  onClick,
  disabled,
  ...props
}: GradientButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const baseStyles = 'rounded-xl transition-all duration-200 disabled:opacity-50 relative overflow-hidden'
  const variantStyles = variant === 'outline'
    ? 'border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white'
    : 'bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white hover:opacity-90'

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (completitionLoadOnClick && !isAnimating && !disabled) {
      setIsAnimating(true)
      
      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsAnimating(false)
      onClick?.(e)
    } else {
      onClick?.(e)
    }
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      onClick={handleClick}
      disabled={disabled || isAnimating}
      {...props}
    >
      {children}
      {completitionLoadOnClick && (
        <div
          className={`absolute inset-0 bg-gradient-to-r from-green-500/40 to-green-400/40 
            transform transition-transform duration-1000 ease-out
            ${isAnimating ? 'translate-x-0' : '-translate-x-full'}`}
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 50%, transparent)'
          }}
        />
      )}
    </button>
  )
} 