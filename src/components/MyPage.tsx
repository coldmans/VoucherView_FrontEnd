import React, { useState } from 'react';
import { User, Heart, MessageSquare, Star, Settings, LogOut, Trophy } from 'lucide-react';

export const MyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reviews');

  const myReviews = [
    { facility: '강남 스포츠센터', sport: '축구', rating: 5, date: '2024.11.20', content: '아이가 정말 좋아해요. 시설도 깨끗하고...', color: '#16E0B4' },
    { facility: '서초 피트니스클럽', sport: '헬스', rating: 4, date: '2024.11.15', content: '가격대비 만족스러운 시설입니다...', color: '#FF6B9D' }
  ];

  const favorites = [
    { name: '강남 스포츠센터', address: '서울시 강남구 역삼동', sport: '축구', rating: 4.8, color: '#16E0B4' },
    { name: '송파 배구클럽', address: '서울시 송파구 잠실동', sport: '배구', rating: 4.9, color: '#FFA726' },
    { name: '역삼 수영장', address: '서울시 강남구 역삼동', sport: '수영', rating: 4.7, color: '#42A5F5' }
  ];

  return (
    <div className="bg-[#F5F7FA] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm p-4 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
            <div className="flex-1">
              <h2 className="mb-2">김학부모님</h2>
              <p className="text-[#8B9DA9] mb-6">parent@example.com</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="p-4 bg-[#F5F7FA] rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-5 h-5 text-[#16E0B4]" />
                    <span className="text-[#8B9DA9]">작성한 리뷰</span>
                  </div>
                  <p className="font-bold">{myReviews.length}개</p>
                </div>
                
                <div className="p-4 bg-[#F5F7FA] rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="w-5 h-5 text-[#16E0B4]" />
                    <span className="text-[#8B9DA9]">찜한 시설</span>
                  </div>
                  <p className="font-bold">{favorites.length}개</p>
                </div>
                
                <div className="p-4 bg-[#F5F7FA] rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="w-5 h-5 text-[#16E0B4]" />
                    <span className="text-[#8B9DA9]">평균 별점</span>
                  </div>
                  <p className="font-bold">4.5점</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="p-3 bg-[#F5F7FA] rounded-xl hover:bg-[#e5e7ea] transition-colors">
                <Settings className="w-5 h-5 text-[#8B9DA9]" />
              </button>
              <button className="p-3 bg-[#F5F7FA] rounded-xl hover:bg-[#e5e7ea] transition-colors">
                <LogOut className="w-5 h-5 text-[#8B9DA9]" />
              </button>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-[#16E0B4]/10 to-[#16E0B4]/5 border-2 border-[#16E0B4] rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <Trophy className="w-8 h-8 text-[#16E0B4] flex-shrink-0" />
            <div>
              <h4 className="mb-1">💡 시설 검색은 로그인 없이도 가능합니다</h4>
              <p className="text-[#8B9DA9]">
                50,000개 이상의 시설 정보를 자유롭게 검색하고 확인하세요. 
                로그인은 리뷰 작성과 찜하기 기능에만 필요합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="border-b-2 border-[#E1E8ED]">
            <div className="flex">
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-4 px-6 font-semibold transition-colors relative ${
                  activeTab === 'reviews' ? 'text-[#16E0B4]' : 'text-[#8B9DA9] hover:text-[#0D1B2A]'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>내가 작성한 리뷰</span>
                </div>
                {activeTab === 'reviews' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#16E0B4]"></div>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 py-4 px-6 font-semibold transition-colors relative ${
                  activeTab === 'favorites' ? 'text-[#16E0B4]' : 'text-[#8B9DA9] hover:text-[#0D1B2A]'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  <span>찜한 시설</span>
                </div>
                {activeTab === 'favorites' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#16E0B4]"></div>
                )}
              </button>
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {myReviews.map((review, index) => (
                  <div key={index} className="p-6 bg-[#F5F7FA] rounded-2xl border-2 border-transparent hover:border-[#16E0B4] transition-colors">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: review.color + '20' }}
                      >
                        <span className="text-2xl" style={{ color: review.color }}>
                          {review.sport[0]}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4>{review.facility}</h4>
                          <span className="text-[#8B9DA9] text-sm">{review.date}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-[#FFA726] fill-[#FFA726]" />
                            ))}
                          </div>
                          <span className="text-sm px-2 py-1 rounded-full" style={{ backgroundColor: review.color + '20', color: review.color }}>
                            {review.sport}
                          </span>
                        </div>
                        
                        <p className="text-[#8B9DA9]">{review.content}</p>
                        
                        <div className="flex gap-3 mt-4">
                          <button className="px-4 py-2 bg-white border-2 border-[#E1E8ED] rounded-lg hover:border-[#0D1B2A] transition-colors text-sm">
                            수정
                          </button>
                          <button className="px-4 py-2 bg-white border-2 border-[#E1E8ED] rounded-lg hover:border-red-500 hover:text-red-500 transition-colors text-sm">
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="grid grid-cols-2 gap-6">
                {favorites.map((facility, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl border-2 border-[#E1E8ED] hover:border-[#16E0B4] transition-all cursor-pointer p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="inline-block px-3 py-1 rounded-full text-sm" style={{ backgroundColor: facility.color + '20', color: facility.color }}>
                        {facility.sport}
                      </div>
                      <button 
                        className="w-8 h-8 bg-[#F5F7FA] rounded-full flex items-center justify-center hover:bg-[#e5e7ea] transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      </button>
                    </div>
                    
                    <h4 className="mb-2">{facility.name}</h4>
                    <p className="text-[#8B9DA9] text-sm mb-4">{facility.address}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-[#FFA726]">★</span>
                      <span className="font-semibold">{facility.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
