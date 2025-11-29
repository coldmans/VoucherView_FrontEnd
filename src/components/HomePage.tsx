import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, DollarSign, Trophy, Dumbbell, Volleyball, SwatchBook, Users, Bike, Activity } from 'lucide-react';
import { getFacilityList, FacilityDto } from '../api';

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [featuredFacilities, setFeaturedFacilities] = useState<FacilityDto[]>([]);

  useEffect(() => {
    const fetchFeaturedFacilities = async () => {
      try {
        const response = await getFacilityList({ page: 1, limit: 3, sortBy: 'rating' });
        setFeaturedFacilities(response.facilityList);
      } catch (error) {
        console.error('인기 시설 불러오기 실패:', error);
      }
    };
    fetchFeaturedFacilities();
  }, []);
  const sports = [
    { icon: Trophy, name: '축구', color: '#16E0B4' },
    { icon: Dumbbell, name: '헬스/피트니스', color: '#FF6B9D' },
    { icon: Volleyball, name: '배구', color: '#FFA726' },
    { icon: SwatchBook, name: '수영', color: '#42A5F5' },
    { icon: Users, name: '농구', color: '#AB47BC' },
    { icon: Bike, name: '사이클', color: '#26C6DA' },
    { icon: Activity, name: '테니스', color: '#66BB6A' },
    { icon: Trophy, name: '기타', color: '#8B9DA9' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0D1B2A] text-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="z-10">
              <div className="inline-block px-3 md:px-4 py-2 bg-[#16E0B4]/20 border border-[#16E0B4] rounded-full mb-4 md:mb-6">
                <span className="text-[#16E0B4] text-sm md:text-base">50,000개 이상의 운동 시설 데이터</span>
              </div>
              <h1 className="mb-4 md:mb-6">
                우리 아이를 위한<br />
                최적의 운동 시설 찾기
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8">
                지역, 종목, 시간대, 가격대까지<br />
                강력한 필터로 원하는 시설을 빠르게 검색하세요
              </p>
              <button 
                onClick={() => onNavigate?.('search')}
                className="flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-[#16E0B4] text-[#0D1B2A] rounded-xl hover:bg-[#14c9a0] transition-all shadow-lg hover:shadow-xl w-full md:w-auto justify-center"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6" />
                <span className="font-bold">운동 시설 검색하기</span>
              </button>
            </div>
            
            <div className="relative h-[200px] md:h-[400px] hidden lg:block">
              {/* Abstract Pattern with Colored Blocks */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#16E0B4]/20 rounded-3xl rotate-12"></div>
              <div className="absolute bottom-0 left-12 w-56 h-56 bg-[#16E0B4]/30 rounded-3xl -rotate-6"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-4 border-[#16E0B4]/40 rounded-3xl rotate-6"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Region Guide Section */}
      <section className="py-8 md:py-16 bg-[#F5F7FA]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="bg-gradient-to-r from-[#16E0B4]/10 to-[#16E0B4]/5 border-2 border-[#16E0B4] rounded-2xl p-4 md:p-8">
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-[#16E0B4] rounded-2xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 md:w-8 md:h-8 text-[#0D1B2A]" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 md:mb-3">💡 학부모님을 위한 팁: 지역부터 선택하세요!</h3>
                <p className="text-[#8B9DA9] mb-4 text-sm md:text-base">
                  집이나 학교 근처의 시설을 찾으시나요? 검색 페이지에서 <strong>시 → 구</strong> 순서로 지역을 먼저 선택하시면, 
                  우리 아이가 다닐 수 있는 가까운 시설만 빠르게 확인할 수 있습니다.
                </p>
                <button 
                  onClick={() => onNavigate?.('search')}
                  className="px-4 md:px-6 py-2 md:py-3 bg-[#0D1B2A] text-white rounded-lg hover:bg-[#1a2f42] transition-colors w-full md:w-auto text-sm md:text-base"
                >
                  지역별 검색 시작하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Categories */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="mb-2 md:mb-4">운동 종목별로 찾아보기</h2>
            <p className="text-[#8B9DA9] text-sm md:text-base">아이가 관심있는 운동 종목을 선택해보세요</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {sports.map((sport, index) => (
              <button
                key={index}
                onClick={() => onNavigate?.('search')}
                className="group p-4 md:p-8 bg-[#F5F7FA] rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div 
                  className="w-12 h-12 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: sport.color + '20' }}
                >
                  <sport.icon className="w-6 h-6 md:w-10 md:h-10" style={{ color: sport.color }} />
                </div>
                <h4 className="text-center text-sm md:text-base">{sport.name}</h4>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Facilities */}
      <section className="py-8 md:py-16 bg-[#F5F7FA]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-12 gap-4">
            <div>
              <h2 className="mb-1 md:mb-2">인기 시설</h2>
              <p className="text-[#8B9DA9] text-sm md:text-base">많은 학부모님들이 선택한 시설입니다</p>
            </div>
            <button 
              onClick={() => onNavigate?.('search')}
              className="px-4 md:px-6 py-2 md:py-3 border-2 border-[#0D1B2A] text-[#0D1B2A] rounded-lg hover:bg-[#0D1B2A] hover:text-white transition-colors text-sm md:text-base w-full md:w-auto"
            >
              전체 보기
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {featuredFacilities.length > 0 ? (
              featuredFacilities.map((facility) => (
                <div
                  key={facility.facilityId}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow cursor-pointer border-2 border-[#E1E8ED] hover:border-[#16E0B4] p-6"
                  onClick={() => onNavigate?.('detail')}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-block px-3 py-1 bg-[#16E0B4]/10 text-[#16E0B4] rounded-full">
                      {facility.mainSport}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#FFA726]">★</span>
                      <span>{facility.averRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <h4 className="mb-2">{facility.name}</h4>
                  <p className="text-[#8B9DA9] mb-4">{facility.address}</p>
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#E1E8ED]">
                    <span className="text-[#8B9DA9]">전화: {facility.phoneNumber}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-[#8B9DA9]">
                인기 시설을 불러오는 중...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filter Preview Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="mb-2 md:mb-4">강력한 필터로 정확하게 검색</h2>
            <p className="text-[#8B9DA9] text-sm md:text-base">원하는 조건을 모두 설정하고 딱 맞는 시설을 찾으세요</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            <div className="p-4 md:p-6 bg-[#F5F7FA] rounded-2xl">
              <MapPin className="w-6 h-6 md:w-8 md:h-8 text-[#16E0B4] mb-2 md:mb-4" />
              <h4 className="mb-1 md:mb-2 text-sm md:text-base">지역 필터</h4>
              <p className="text-[#8B9DA9] text-xs md:text-base">시 → 구<br />단계별 선택</p>
            </div>
            <div className="p-4 md:p-6 bg-[#F5F7FA] rounded-2xl">
              <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-[#16E0B4] mb-2 md:mb-4" />
              <h4 className="mb-1 md:mb-2 text-sm md:text-base">가격대</h4>
              <p className="text-[#8B9DA9] text-xs md:text-base">예산에 맞는<br />시설 찾기</p>
            </div>
            <div className="p-4 md:p-6 bg-[#F5F7FA] rounded-2xl">
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-[#16E0B4] mb-2 md:mb-4" />
              <h4 className="mb-1 md:mb-2 text-sm md:text-base">시간대</h4>
              <p className="text-[#8B9DA9] text-xs md:text-base">평일/주말<br />오전/오후/저녁</p>
            </div>
            <div className="p-4 md:p-6 bg-[#F5F7FA] rounded-2xl">
              <Activity className="w-6 h-6 md:w-8 md:h-8 text-[#16E0B4] mb-2 md:mb-4" />
              <h4 className="mb-1 md:mb-2 text-sm md:text-base">난이도</h4>
              <p className="text-[#8B9DA9] text-xs md:text-base">초급/중급/고급<br />수준별 선택</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
