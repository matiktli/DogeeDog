import Image from 'next/image';
import { useState } from 'react';

interface SmallDogCardProps {
  imageUrl: string;
  name: string;
  onClick?: () => void;
  isSelected?: boolean;
  isCompleted?: boolean;
  challengeIcon?: string;
}

const SmallDogCard = ({ 
  imageUrl, 
  name, 
  onClick,
  isSelected = false,
  isCompleted = false,
  challengeIcon = ''
}: SmallDogCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        relative w-16 h-16 cursor-pointer group
        ${isSelected ? 'ring-2 ring-[var(--accent)]' : ''}
        ${isCompleted ? 'ring-2 ring-green-500 ring-opacity-50 cursor-default' : ''}
        ${isCompleted ? 'shadow-[0_0_15px_rgba(34,197,94,0.3)]' : ''}
      `}
      onMouseEnter={() => !isCompleted && setIsHovered(true)}
      onMouseLeave={() => !isCompleted && setIsHovered(false)}
      onClick={!isCompleted ? onClick : undefined}
    >
      <div className={`
        absolute inset-0 rounded-lg overflow-hidden border-2 
        ${isCompleted 
          ? 'border-green-500/30' 
          : 'border-[var(--secondary)]/20 transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:border-[var(--secondary)]/50'
        }
      `}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          className={`
            object-cover transition-transform
            ${isSelected ? 'scale-95' : ''}
            ${isCompleted ? 'blur-[1px] brightness-95' : ''}
          `}
        />
        
        {isSelected && !isCompleted && (
          <div className="absolute inset-0 bg-[var(--accent)]/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xs">
              ✓
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500/10">
            <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-lg shadow-md">
              {challengeIcon}
            </div>
          </div>
        )}
      </div>
      
      {isHovered && !isCompleted && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[var(--background)] px-2 py-1 rounded-full text-xs shadow-sm whitespace-nowrap border border-[var(--secondary)]/30 text-[var(--foreground)]">
          {name}
        </div>
      )}

      {isCompleted && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 px-2 py-1 rounded-full text-xs shadow-sm whitespace-nowrap text-white">
          Completed
        </div>
      )}
    </div>
  );
};

export default SmallDogCard; 