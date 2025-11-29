import React from 'react';
import { MapPin, DollarSign, Clock, ParkingCircle, Shirt, Sparkles, Heart } from 'lucide-react';

interface FacilityCardProps {
  name: string;
  address: string;
  sport: string;
  rating: number;
  reviewCount: number;
  price: string;
  time: string;
  color: string;
  facilities: string[];
  onClick?: () => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  name,
  address,
  sport,
  rating,
  reviewCount,
  price,
  time,
  color,
  facilities,
  onClick
}) => {
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
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Heart className="w-4 h-4 text-[#8B9DA9]" />
            </button>
          </div>
        </div>

        <h4 className="mb-2">{name}</h4>
        
        <div className="flex items-start gap-2 text-[#8B9DA9] mb-4">
          <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
          <span className="text-sm">{address}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-[#E1E8ED]">
          <div className="flex items-center gap-2 text-[#8B9DA9]">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">{price}</span>
          </div>
          <div className="flex items-center gap-2 text-[#8B9DA9]">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{time}</span>
          </div>
        </div>

        {/* Facilities Icons */}
        <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
};
