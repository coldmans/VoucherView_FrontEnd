import React, { useState } from 'react';
import { MapPin, ParkingCircle, Shirt, Sparkles, Heart } from 'lucide-react';

interface FacilityCardProps {
  facilityId: number;
  name: string;
  address: string;
  sport: string;
  rating: number;
  reviewCount: number;
  isFavorite: boolean;
  price?: string;
  time?: string;
  color: string;
  facilities: string[];
  onClick?: () => void;
  onFavoriteToggle?: (facilityId: number, isFavorite: boolean) => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  facilityId,
  name,
  address,
  sport,
  rating,
  reviewCount,
  isFavorite,
  color,
  facilities,
  onClick,
  onFavoriteToggle
}) => {
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteState = !localFavorite;
    setLocalFavorite(newFavoriteState);
    onFavoriteToggle?.(facilityId, newFavoriteState);
  };
  const facilityIcons: { [key: string]: any } = {
    '주차': ParkingCircle,
    '락커룸': Shirt,
    '샤워실': Sparkles
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer border-2 border-[#E1E8ED] hover:border-[#16E0B4]"
      onClick={onClick}
    >
      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="inline-block px-3 py-1 rounded-full text-sm" style={{ backgroundColor: color + '20', color }}>
            {sport}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-[#FFA726] text-lg">★</span>
              <span className="font-semibold">{rating}</span>
              <span className="text-[#8B9DA9]">({reviewCount})</span>
            </div>
            <button
              className="w-8 h-8 bg-[#F5F7FA] rounded-full flex items-center justify-center hover:bg-[#e5e7ea] transition-colors"
              onClick={handleFavoriteClick}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  localFavorite ? 'text-red-500 fill-red-500' : 'text-[#8B9DA9]'
                }`}
              />
            </button>
          </div>
        </div>

        <h4 className="mb-2">{name}</h4>
        
        <div className="flex items-start gap-2 text-[#8B9DA9] mb-4">
          <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
          <span className="text-sm">{address}</span>
        </div>

        {/* Facilities Icons */}
        {facilities.length > 0 && (
          <div className="flex items-center gap-2 pt-4 border-t border-[#E1E8ED]">
            {facilities.map((facility) => {
              const Icon = facilityIcons[facility];
              return Icon ? (
                <div
                  key={facility}
                  className="flex items-center gap-1 px-3 py-1 bg-[#F5F7FA] rounded-lg"
                  title={facility}
                >
                  <Icon className="w-4 h-4 text-[#8B9DA9]" />
                  <span className="text-xs text-[#8B9DA9]">{facility}</span>
                </div>
              ) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};
