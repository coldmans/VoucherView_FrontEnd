import React, { useState, useEffect } from 'react';
import { MapPin, X, ChevronDown, Search, ChevronUp } from 'lucide-react';
import { getFilterMetadata, getCitiesByProvince, FacilitySearchRequest } from '../api';
import { getCurrentPosition, GeolocationPosition } from '../utils/geolocation';

export interface SearchFilters extends FacilitySearchRequest {
  page?: number;
  limit?: number;
}

interface FilterBarProps {
  resultCount?: number;
  onSearch?: (filters: SearchFilters) => void;
  loading?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({ resultCount = 0, onSearch, loading = false }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null);

  // 메타데이터
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [sports, setSports] = useState<string[]>([]);

  // 메타데이터 로드
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const metadata = await getFilterMetadata();
        setProvinces(metadata.regions.map(r => r.province));
        setSports(metadata.sports);
      } catch (error) {
        console.error('메타데이터 로드 실패:', error);
      }
    };
    loadMetadata();
  }, []);

  // 시/도 변경 시 구/군 목록 로드
  useEffect(() => {
    if (selectedCity) {
      const loadCities = async () => {
        try {
          const cities = await getCitiesByProvince(selectedCity);
          setDistricts(cities);
          setSelectedDistrict(''); // 시/도 변경 시 구/군 초기화
        } catch (error) {
          console.error('구/군 목록 로드 실패:', error);
          setDistricts([]);
        }
      };
      loadCities();
    } else {
      setDistricts([]);
      setSelectedDistrict('');
    }
  }, [selectedCity]);

  const handleReset = () => {
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedSport('');
    setSearchKeyword('');
    setUserLocation(null);
    onSearch?.({});
  };

  const handleSearch = () => {
    const filters: SearchFilters = {
      keyword: searchKeyword || undefined,
      ctNm: selectedCity || undefined,
      ctDetailNm: selectedDistrict || undefined,
      mainSport: selectedSport || undefined,
      lat: userLocation?.lng,
      lng: userLocation?.lat,
    };
    console.log('검색 실행:', filters);
    onSearch?.(filters);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="sticky top-[72px] z-40 bg-white shadow-lg border-b border-[#E1E8ED]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 md:py-6">
        {/* Search Bar & Toggle */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9DA9]" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="시설명, 지역, 종목으로 검색..."
              className="w-full pl-12 pr-4 py-3 bg-[#F5F7FA] border-2 border-[#E1E8ED] rounded-xl hover:border-[#16E0B4] focus:border-[#16E0B4] focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 md:px-6 py-3 bg-[#0D1B2A] text-white rounded-xl hover:bg-[#1a2f42] transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            <span className="hidden md:inline">{showFilters ? '필터 숨기기' : '필터 보기'}</span>
          </button>
        </div>

        {showFilters && (
          <div>
          {/* Main Filter - Region & Sport */}
          <div className="mb-4">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-[#16E0B4] rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#0D1B2A]" />
              </div>
              <h4 className="text-base md:text-xl">지역 및 종목 선택</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div>
                <label className="block text-sm mb-2 text-[#8B9DA9]">시/도</label>
                <div className="relative">
                  <select 
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F5F7FA] border-2 border-[#E1E8ED] rounded-xl appearance-none cursor-pointer hover:border-[#16E0B4] focus:border-[#16E0B4] focus:outline-none transition-colors"
                  >
                    <option value="">시/도 선택</option>
                    {provinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9DA9] pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-[#8B9DA9]">시/구</label>
                <div className="relative">
                  <select 
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedCity}
                    className="w-full px-4 py-3 bg-[#F5F7FA] border-2 border-[#E1E8ED] rounded-xl appearance-none cursor-pointer hover:border-[#16E0B4] focus:border-[#16E0B4] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">시/구 선택</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9DA9] pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-[#8B9DA9]">운동 종목</label>
                <div className="relative">
                  <select 
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F5F7FA] border-2 border-[#E1E8ED] rounded-xl appearance-none cursor-pointer hover:border-[#16E0B4] focus:border-[#16E0B4] focus:outline-none transition-colors"
                  >
                    <option value="">종목 선택</option>
                    {sports.map(sport => (
                      <option key={sport} value={sport}>{sport}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9DA9] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Filters */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-3">
              <p className="text-[#8B9DA9] text-sm md:text-base">검색된 시설 <strong className="text-[#0D1B2A]">{resultCount}개</strong></p>
              {userLocation && (
                <span className="text-xs md:text-sm text-[#16E0B4] bg-[#16E0B4]/10 px-2 py-1 rounded-full">
                  📍 내 위치 기준
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
              <button
                onClick={handleReset}
                className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 bg-[#E1E8ED] text-[#8B9DA9] rounded-xl hover:bg-[#d1d8dd] transition-colors flex items-center gap-2 justify-center text-sm md:text-base"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
                초기화
              </button>

              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 bg-[#16E0B4] text-[#0D1B2A] rounded-xl hover:bg-[#14c9a0] transition-colors flex items-center gap-2 justify-center font-bold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5" />
                {loading ? '검색 중...' : '검색'}
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
