import { Dog } from '../types/dog';
import SmallDogCard from './SmallDogCard';

interface SmallCardListProps {
  dogs: Dog[];
  maxEntriesInRow: number;
  singleRow?: boolean;
  onDogClick?: (dogId: string) => void;
  selectedDogIds?: string[];
  completedDogIds?: string[];
  challengeIcon?: string;
}

const SmallCardList = ({
  dogs,
  maxEntriesInRow,
  singleRow = false,
  onDogClick,
  selectedDogIds = [],
  completedDogIds = [],
  challengeIcon = ''
}: SmallCardListProps) => {
  const visibleDogs = singleRow ? dogs.slice(0, maxEntriesInRow) : dogs;
  const remainingCount = singleRow ? dogs.length - maxEntriesInRow : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleDogs.map((dog) => (
        <SmallDogCard
          key={dog._id}
          imageUrl={dog.imageUrl}
          name={dog.name}
          onClick={() => onDogClick?.(dog._id)}
          isSelected={selectedDogIds.includes(dog._id)}
          isCompleted={completedDogIds.includes(dog._id)}
          challengeIcon={challengeIcon}
        />
      ))}
      
      {singleRow && remainingCount > 0 && (
        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg text-gray-600 text-sm font-medium">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default SmallCardList; 