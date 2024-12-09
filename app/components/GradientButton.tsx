import { ButtonHTMLAttributes } from 'react'

export interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline'
  className?: string
}

export default function GradientButton({
  children,
  variant = 'solid',
  className = '',
  ...props
}: GradientButtonProps) {
  const baseStyles = 'rounded-xl transition-all duration-200 disabled:opacity-50'
  const variantStyles = variant === 'outline'
    ? 'border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white'
    : 'bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white hover:opacity-90'

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
} 