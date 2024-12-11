import Image from 'next/image';
import { useState } from 'react';

interface SmallDogCardProps {
  imageUrl: string;
  name: string;
  onClick?: () => void;
}

const SmallDogCard = ({ imageUrl, name, onClick }: SmallDogCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-16 h-16 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="absolute inset-0 rounded-lg overflow-hidden border-2 border-[var(--secondary)]/20 transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:border-[var(--secondary)]/50">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      
      {isHovered && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[var(--background)] px-2 py-1 rounded-full text-xs shadow-sm whitespace-nowrap border border-[var(--secondary)]/30 text-[var(--foreground)]">
          {name}
        </div>
      )}
    </div>
  );
};

export default SmallDogCard; 