import React, { useState, useEffect } from 'react';
import { MapPin, Trophy, DollarSign, Calendar, Clock, ParkingCircle, Shirt, Sparkles, X, ChevronDown, Search, ChevronUp, Locate } from 'lucide-react';
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

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

  const handleGetLocation = async () => {
    setLocationLoading(true);
    try {
      const position = await getCurrentPosition();
      setUserLocation(position);
      console.log('현재 위치:', position);
    } catch (error: any) {
      console.error('위치 가져오기 실패:', error);
      alert(error.message || '위치 정보를 가져올 수 없습니다.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedSport('');
    setSearchKeyword('');
    setUserLocation(null);
    setShowAdvancedFilters(false);
    onSearch?.({});
  };

  const handleSearch = () => {
    const filters: SearchFilters = {
      keyword: searchKeyword || undefined,
      ctNm: selectedCity || undefined,
      ctDetailNm: selectedDistrict || undefined,
      mainSport: selectedSport || undefined,
      lat: userLocation?.lat,
      lng: userLocation?.lng,
      radius: userLocation ? 5000 : undefined, // 위치가 있으면 5km 반경 검색
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
                onClick={handleGetLocation}
                disabled={locationLoading}
                className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 border-2 border-[#16E0B4] text-[#16E0B4] rounded-xl hover:bg-[#16E0B4] hover:text-white transition-colors text-sm md:text-base flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                title="현재 위치를 기준으로 주변 시설을 검색합니다"
              >
                <Locate className="w-4 h-4 md:w-5 md:h-5" />
                {locationLoading ? '위치 확인 중...' : userLocation ? '위치 재설정' : '내 위치'}
              </button>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 border-2 border-[#0D1B2A] text-[#0D1B2A] rounded-xl hover:bg-[#0D1B2A] hover:text-white transition-colors text-sm md:text-base"
              >
                {showAdvancedFilters ? '간단히 보기' : '상세 필터 +'}
              </button>

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

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-4 md:mt-6 p-4 md:p-6 bg-[#F5F7FA] rounded-2xl border-2 border-[#E1E8ED]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Price Range */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-[#16E0B4]" />
                  <label className="font-semibold text-sm md:text-base">가격대</label>
                </div>
                <div className="grid grid-cols-2 md:flex gap-2">
                  {['3만원 이하', '3-5만원', '5-10만원', '10만원 이상'].map(price => (
                    <button
                      key={price}
                      className="flex-1 px-2 md:px-4 py-2 bg-white border-2 border-[#E1E8ED] rounded-lg hover:border-[#16E0B4] hover:bg-[#16E0B4]/5 transition-colors text-xs md:text-sm"
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#16E0B4]" />
                  <label className="font-semibold text-sm md:text-base">시간대</label>
                </div>
                <div className="grid grid-cols-2 md:flex gap-2">
                  {['평일 오전', '평일 오후', '주말 오전', '주말 오후'].map(time => (
                    <button
                      key={time}
                      className="flex-1 px-2 md:px-4 py-2 bg-white border-2 border-[#E1E8ED] rounded-lg hover:border-[#16E0B4] hover:bg-[#16E0B4]/5 transition-colors text-xs md:text-sm"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#16E0B4]" />
                  <label className="font-semibold text-sm md:text-base">제공 서비스</label>
                </div>
                <div className="flex gap-2">
                  {[
                    { icon: ParkingCircle, label: '주차' },
                    { icon: Shirt, label: '락커룸' },
                    { icon: Sparkles, label: '샤워실' }
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      className="flex-1 px-2 md:px-4 py-2 bg-white border-2 border-[#E1E8ED] rounded-lg hover:border-[#16E0B4] hover:bg-[#16E0B4]/5 transition-colors flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm"
                    >
                      <Icon className="w-3 h-3 md:w-4 md:h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#16E0B4]" />
                  <label className="font-semibold text-sm md:text-base">난이도</label>
                </div>
                <div className="flex gap-2">
                  {['초급', '중급', '고급', '전체'].map(level => (
                    <button
                      key={level}
                      className="flex-1 px-2 md:px-4 py-2 bg-white border-2 border-[#E1E8ED] rounded-lg hover:border-[#16E0B4] hover:bg-[#16E0B4]/5 transition-colors text-xs md:text-sm"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};
