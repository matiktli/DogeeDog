interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function GradientButton({ 
  children, 
  onClick, 
  size = 'medium',
  disabled = false,
  type = 'button'
}: GradientButtonProps) {
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-2'
  }

  return (
    <button
      onClick={onClick}
      className={`
        bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)]
        hover:brightness-110
        text-white rounded-lg transition-all duration-200 
        shadow-md hover:shadow-lg
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
} 