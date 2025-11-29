import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, Phone, ParkingCircle, Shirt, Sparkles, Star, Lock, AlertCircle } from 'lucide-react';

interface FacilityDetailPageProps {
  onNavigate?: (page: string) => void;
}

export const FacilityDetailPage: React.FC<FacilityDetailPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('info');

  const reviews = [
    { author: '김*진', rating: 5, date: '2024.11.20', content: '아이가 정말 좋아해요. 시설도 깨끗하고 코치님들도 친절하십니다. 주차도 편해서 자주 이용하고 있어요.' },
    { author: '이*수', rating: 4, date: '2024.11.15', content: '가격대비 만족스러운 시설입니다. 다만 주말에는 사람이 많아서 예약이 필수에요.' },
    { author: '박*영', rating: 5, date: '2024.11.10', content: '초등학생 자녀와 함께 다니기 좋습니다. 락커룸도 넓고 샤워 시설도 깨끗해요.' }
  ];

  return (
    <div className="bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-12">
        <div className="bg-white rounded-2xl md:rounded-3xl border-2 border-[#E1E8ED] p-4 md:p-8 mb-6 md:mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="inline-block px-4 py-2 bg-[#16E0B4]/10 text-[#16E0B4] rounded-full mb-3">
                축구
              </div>
              <h2 className="mb-3">강남 스포츠센터</h2>
              <div className="flex items-center gap-2 text-[#8B9DA9] mb-4">
                <MapPin className="w-5 h-5" />
                <span>서울시 강남구 역삼동 123-45</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-6 h-6 text-[#FFA726] fill-[#FFA726]" />
                  <span className="text-xl font-bold">4.8</span>
                </div>
                <span className="text-[#8B9DA9]">리뷰 234개</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 text-[#8B9DA9] mb-2">
                <Phone className="w-5 h-5" />
                <span>02-1234-5678</span>
              </div>
              <div className="flex items-center gap-2 text-[#8B9DA9]">
                <Clock className="w-5 h-5" />
                <span>평일 06:00 - 22:00</span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-4 p-6 bg-[#F5F7FA] rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#16E0B4]/20 rounded-xl flex items-center justify-center">
                <ParkingCircle className="w-6 h-6 text-[#16E0B4]" />
              </div>
              <div>
                <p className="text-[#8B9DA9] text-sm">주차</p>
                <p className="font-semibold">가능 (50대)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#16E0B4]/20 rounded-xl flex items-center justify-center">
                <Shirt className="w-6 h-6 text-[#16E0B4]" />
              </div>
              <div>
                <p className="text-[#8B9DA9] text-sm">락커룸</p>
                <p className="font-semibold">남/녀 분리</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#16E0B4]/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#16E0B4]" />
              </div>
              <div>
                <p className="text-[#8B9DA9] text-sm">샤워실</p>
                <p className="font-semibold">온수 제공</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b-2 border-[#E1E8ED] mb-6 md:mb-8 overflow-x-auto">
          <div className="flex gap-4 md:gap-8 min-w-max md:min-w-0">
            {[
              { id: 'info', label: '시설 정보' },
              { id: 'price', label: '가격 안내' },
              { id: 'location', label: '위치' },
              { id: 'reviews', label: '리뷰' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 font-semibold transition-colors relative ${
                  activeTab === tab.id ? 'text-[#16E0B4]' : 'text-[#8B9DA9] hover:text-[#0D1B2A]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#16E0B4]"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-16">
          <div className="lg:col-span-2">
            {activeTab === 'info' && (
              <div className="bg-white">
                <h3 className="mb-6">시설 소개</h3>
                <div className="space-y-4 text-[#8B9DA9] leading-relaxed mb-8">
                  <p>
                    강남 스포츠센터는 2015년에 개관한 현대식 축구 전문 시설입니다. 
                    실내/실외 구장을 모두 갖추고 있어 날씨와 관계없이 운동이 가능합니다.
                  </p>
                  <p>
                    특히 초등학생부터 중고등학생까지 연령별 맞춤 프로그램을 운영하고 있으며, 
                    경험 많은 지도자들이 체계적인 커리큘럼으로 지도합니다.
                  </p>
                  <p>
                    학부모 대기 공간, 카페테리아, 넓은 주차장 등 편의시설도 잘 갖추어져 있어 
                    학부모님들께서 편안하게 이용하실 수 있습니다.
                  </p>
                </div>

                <h4 className="mb-4">운영 시간</h4>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between p-4 bg-[#F5F7FA] rounded-xl">
                    <span className="font-semibold">평일</span>
                    <span className="text-[#8B9DA9]">오전 06:00 - 오후 10:00</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#F5F7FA] rounded-xl">
                    <span className="font-semibold">주말</span>
                    <span className="text-[#8B9DA9]">오전 07:00 - 오후 09:00</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#F5F7FA] rounded-xl">
                    <span className="font-semibold">공휴일</span>
                    <span className="text-[#8B9DA9]">오전 08:00 - 오후 06:00</span>
                  </div>
                </div>

                <h4 className="mb-4">제공 프로그램</h4>
                <div className="grid grid-cols-2 gap-4">
                  {['초등부 기초반', '초등부 심화반', '중등부', '성인 취미반'].map(program => (
                    <div key={program} className="p-4 border-2 border-[#E1E8ED] rounded-xl">
                      <p className="font-semibold mb-1">{program}</p>
                      <p className="text-sm text-[#8B9DA9]">주 2회 / 1회 60분</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'price' && (
              <div>
                <h3 className="mb-6">가격 안내</h3>
                <div className="space-y-4">
                  {[
                    { title: '초등부 기초반', price: '월 50,000원', description: '주 2회 (화/목) 오후 4시' },
                    { title: '초등부 심화반', price: '월 60,000원', description: '주 2회 (월/수) 오후 5시' },
                    { title: '중등부', price: '월 70,000원', description: '주 2회 (화/목) 오후 7시' },
                    { title: '성인 취미반', price: '월 80,000원', description: '주 2회 (월/금) 오후 8시' }
                  ].map(item => (
                    <div key={item.title} className="p-6 border-2 border-[#E1E8ED] rounded-xl hover:border-[#16E0B4] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4>{item.title}</h4>
                        <span className="text-[#16E0B4] font-bold">{item.price}</span>
                      </div>
                      <p className="text-[#8B9DA9]">{item.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-6 bg-[#F5F7FA] rounded-2xl">
                  <h4 className="mb-3">💳 결제 안내</h4>
                  <ul className="space-y-2 text-[#8B9DA9]">
                    <li>• 3개월 이상 등록 시 10% 할인</li>
                    <li>• 형제/자매 등록 시 각 5% 할인</li>
                    <li>• 카드/현금 결제 가능</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'location' && (
              <div>
                <h3 className="mb-6">위치 안내</h3>
                <div className="h-96 bg-[#F5F7FA] rounded-2xl flex items-center justify-center border-2 border-[#E1E8ED] mb-6">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-[#16E0B4] mx-auto mb-4" />
                    <p className="text-[#8B9DA9]">지도 영역</p>
                    <p className="text-sm text-[#8B9DA9]">서울시 강남구 역삼동 123-45</p>
                  </div>
                </div>
                
                <h4 className="mb-4">교통 안내</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-[#F5F7FA] rounded-xl">
                    <p className="font-semibold mb-1">🚇 지하철</p>
                    <p className="text-[#8B9DA9]">2호선 역삼역 3번 출구 도보 5분</p>
                  </div>
                  <div className="p-4 bg-[#F5F7FA] rounded-xl">
                    <p className="font-semibold mb-1">🚌 버스</p>
                    <p className="text-[#8B9DA9]">146, 341, 360, 740 (역삼역 정류장 하차)</p>
                  </div>
                  <div className="p-4 bg-[#F5F7FA] rounded-xl">
                    <p className="font-semibold mb-1">🚗 주차</p>
                    <p className="text-[#8B9DA9]">50대 주차 가능 (2시간 무료)</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3>리뷰 ({reviews.length})</h3>
                </div>

                {/* Login Required Banner */}
                <div className="mb-6 p-6 bg-[#FFF3E0] border-2 border-[#FFA726] rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FFA726] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2">리뷰 작성은 로그인 후 이용 가능합니다</h4>
                      <p className="text-[#8B9DA9] mb-4">
                        별점, 리뷰, 댓글 작성 기능은 회원 전용 서비스입니다. 
                        간편하게 로그인하시고 다른 학부모님들과 의견을 나눠보세요!
                      </p>
                      <button 
                        onClick={() => onNavigate?.('login')}
                        className="px-6 py-3 bg-[#0D1B2A] text-white rounded-xl hover:bg-[#1a2f42] transition-colors"
                      >
                        로그인하러 가기
                      </button>
                    </div>
                  </div>
                </div>

                {/* Review List (Read-only for non-members) */}
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div key={index} className="p-6 bg-[#F5F7FA] rounded-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#0D1B2A] rounded-full flex items-center justify-center text-white font-bold">
                            {review.author[0]}
                          </div>
                          <div>
                            <p className="font-semibold">{review.author}</p>
                            <p className="text-sm text-[#8B9DA9]">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-[#FFA726] fill-[#FFA726]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#8B9DA9] leading-relaxed">{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-[#F5F7FA] rounded-2xl p-6 sticky top-32">
              <h4 className="mb-4">문의하기</h4>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-[#8B9DA9]">
                  <Phone className="w-5 h-5" />
                  <span>02-1234-5678</span>
                </div>
                <div className="flex items-center gap-3 text-[#8B9DA9]">
                  <Clock className="w-5 h-5" />
                  <span>상담 가능 시간: 09:00-18:00</span>
                </div>
              </div>
              
              <button className="w-full py-4 bg-[#16E0B4] text-[#0D1B2A] rounded-xl hover:bg-[#14c9a0] transition-colors font-bold mb-3">
                전화 문의하기
              </button>
              <button className="w-full py-4 bg-white border-2 border-[#E1E8ED] rounded-xl hover:border-[#16E0B4] transition-colors font-bold">
                찜하기
              </button>

              <div className="mt-6 pt-6 border-t border-[#E1E8ED]">
                <div className="flex items-start gap-2 text-sm text-[#8B9DA9]">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>
                    등록 및 가격 문의는 시설에 직접 연락하시기 바랍니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
