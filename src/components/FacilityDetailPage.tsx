import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Star, Lock, AlertCircle, ChevronLeft, ChevronRight, Calendar, Users } from 'lucide-react';
import { getFacilityById, getFacilityCourses, FacilityDto, CourseDto } from '../api';

interface FacilityDetailPageProps {
  facilityId?: number;
  onNavigate?: (page: string, facilityId?: number) => void;
}

export const FacilityDetailPage: React.FC<FacilityDetailPageProps> = ({ facilityId = 1, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('courses');
  const [facility, setFacility] = useState<FacilityDto | null>(null);
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<CourseDto | null>(null);

  const sportColors: Record<string, string> = {
    '축구': '#16E0B4',
    '헬스': '#FF6B9D',
    '배구': '#FFA726',
    '수영': '#42A5F5',
    '농구': '#AB47BC',
    '테니스': '#66BB6A',
  };

  useEffect(() => {
    fetchFacilityData();
  }, [facilityId]);

  useEffect(() => {
    if (activeTab === 'courses') {
      fetchCourses(1);
    }
  }, [activeTab, facilityId]);

  const fetchFacilityData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFacilityById(facilityId);
      setFacility(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '시설 정보를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getFacilityCourses({
        facilityId,
        page,
        limit: 10,
      });
      setCourses(response.courses);
      setTotalCount(response.pagination.totalCount);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : '강좌 목록을 불러올 수 없습니다.');
      setCourses([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchCourses(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return dateString.replace(/-/g, '.');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(totalCount / 10);
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = maxPagesToShow;
      }

      if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxPagesToShow + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (loading && !facility) {
    return (
      <div className="bg-[#F5F7FA] min-h-screen flex items-center justify-center">
        <p className="text-[#8B9DA9]">시설 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error && !facility) {
    return (
      <div className="bg-[#F5F7FA] min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!facility) {
    return null;
  }

  return (
    <div className="bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-12">
        <div className="bg-white rounded-2xl md:rounded-3xl border-2 border-[#E1E8ED] p-4 md:p-8 mb-6 md:mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div
                className="inline-block px-4 py-2 rounded-full mb-3"
                style={{
                  backgroundColor: (sportColors[facility.mainSport] || '#8B9DA9') + '20',
                  color: sportColors[facility.mainSport] || '#8B9DA9'
                }}
              >
                {facility.mainSport}
              </div>
              <h2 className="mb-3">{facility.name}</h2>
              <div className="flex items-center gap-2 text-[#8B9DA9] mb-4">
                <MapPin className="w-5 h-5" />
                <span>{facility.address}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-6 h-6 text-[#FFA726] fill-[#FFA726]" />
                  <span className="text-xl font-bold">{facility.averRating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 text-[#8B9DA9] mb-2">
                <Phone className="w-5 h-5" />
                <span>{facility.phoneNumber}</span>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="p-6 bg-[#F5F7FA] rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#16E0B4]/20 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#16E0B4]" />
              </div>
              <div>
                <p className="text-[#8B9DA9] text-sm">위치 좌표</p>
                <p className="font-semibold">위도: {facility.latitude.toFixed(6)}, 경도: {facility.longitude.toFixed(6)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b-2 border-[#E1E8ED] mb-6 md:mb-8 overflow-x-auto">
          <div className="flex gap-4 md:gap-8 min-w-max md:min-w-0">
            {[
              { id: 'courses', label: '강좌 정보' },
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
            {activeTab === 'courses' && (
              <div>
                <h3 className="mb-6">등록된 강좌 ({totalCount}개)</h3>

                {/* Course Detail View */}
                {selectedCourse && (
                  <div className="mb-6 p-6 bg-[#F5F7FA] rounded-2xl border-2 border-[#16E0B4]">
                    <div className="flex items-center justify-between mb-4">
                      <h4>{selectedCourse.courseName}</h4>
                      <button
                        onClick={() => setSelectedCourse(null)}
                        className="text-[#8B9DA9] hover:text-[#0D1B2A]"
                      >
                        닫기
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[#8B9DA9] mb-1">강좌 번호</p>
                        <p className="font-semibold">{selectedCourse.courseNo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#8B9DA9] mb-1">종목</p>
                        <p className="font-semibold">{selectedCourse.sportName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#8B9DA9] mb-1">수강 기간</p>
                        <p className="font-semibold">{formatDate(selectedCourse.startDate)} ~ {formatDate(selectedCourse.endDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#8B9DA9] mb-1">가격</p>
                        <p className="font-semibold text-[#16E0B4]">{formatPrice(selectedCourse.price)}원</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#8B9DA9] mb-1">개설 정보</p>
                        <p className="font-semibold">{selectedCourse.establishmentYear}년 {selectedCourse.establishmentMonth}월</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#8B9DA9] mb-1">신청자 수</p>
                        <p className="font-semibold">{selectedCourse.requestCount}명</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="text-center py-12">
                    <p className="text-[#8B9DA9]">강좌 목록을 불러오는 중...</p>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="text-center py-12">
                    <p className="text-red-500">{error}</p>
                  </div>
                )}

                {/* Empty State */}
                {!loading && !error && courses.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-[#8B9DA9]">등록된 강좌가 없습니다.</p>
                  </div>
                )}

                {/* Course List */}
                {!loading && !error && courses.length > 0 && (
                  <>
                    <div className="space-y-4 mb-6">
                      {courses.map((course) => (
                        <div
                          key={course.courseId}
                          onClick={() => setSelectedCourse(course)}
                          className="p-6 border-2 border-[#E1E8ED] rounded-xl hover:border-[#16E0B4] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="mb-1">{course.courseName}</h4>
                              <p className="text-sm text-[#8B9DA9]">강좌 번호: {course.courseNo}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[#16E0B4] font-bold text-lg mb-1">{formatPrice(course.price)}원</p>
                              <p className="text-sm text-[#8B9DA9]">{course.sportName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-[#8B9DA9]">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(course.startDate)} ~ {formatDate(course.endDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>신청 {course.requestCount}명</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 0 && (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="w-10 h-10 flex items-center justify-center bg-white border-2 border-[#E1E8ED] rounded-lg hover:border-[#16E0B4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        {currentPage > 3 && totalPages > 5 && (
                          <>
                            <button
                              onClick={() => handlePageChange(1)}
                              className="w-10 h-10 rounded-lg transition-colors bg-white border-2 border-[#E1E8ED] hover:border-[#16E0B4]"
                            >
                              1
                            </button>
                            {currentPage > 4 && <span className="px-2">...</span>}
                          </>
                        )}

                        {getPageNumbers().map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-lg transition-colors ${
                              page === currentPage
                                ? 'bg-[#16E0B4] text-white'
                                : 'bg-white border-2 border-[#E1E8ED] hover:border-[#16E0B4]'
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        {currentPage < totalPages - 2 && totalPages > 5 && (
                          <>
                            {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                            <button
                              onClick={() => handlePageChange(totalPages)}
                              className="w-10 h-10 rounded-lg transition-colors bg-white border-2 border-[#E1E8ED] hover:border-[#16E0B4]"
                            >
                              {totalPages}
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="w-10 h-10 flex items-center justify-center bg-white border-2 border-[#E1E8ED] rounded-lg hover:border-[#16E0B4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3>리뷰</h3>
                </div>

                {/* Login Required Banner */}
                <div className="mb-6 p-6 bg-[#FFF3E0] border-2 border-[#FFA726] rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FFA726] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2">리뷰 기능은 개발 중입니다</h4>
                      <p className="text-[#8B9DA9] mb-4">
                        별점, 리뷰 작성 기능은 현재 백엔드 개발 중입니다.
                        곧 추가될 예정이니 조금만 기다려주세요!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Placeholder Review List */}
                <div className="text-center py-12 border-2 border-dashed border-[#E1E8ED] rounded-2xl">
                  <p className="text-[#8B9DA9]">리뷰 기능이 추가되면 여기에 리뷰 목록이 표시됩니다.</p>
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
                  <span>{facility.phoneNumber}</span>
                </div>
              </div>

              <button
                onClick={() => window.location.href = `tel:${facility.phoneNumber}`}
                className="w-full py-4 bg-[#16E0B4] text-[#0D1B2A] rounded-xl hover:bg-[#14c9a0] transition-colors font-bold mb-3"
              >
                전화 문의하기
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
