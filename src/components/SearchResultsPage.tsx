import React, { useState, useEffect } from 'react';
import { FilterBar, SearchFilters } from './FilterBar';
import { FacilityCard } from './FacilityCard';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { getFacilityList, FacilityDto } from '../api';

interface SearchResultsPageProps {
  onNavigate?: (page: string) => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ onNavigate }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [facilities, setFacilities] = useState<FacilityDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});

  const fetchFacilities = async (filters: SearchFilters, page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      // SearchFilters에서 page, limit을 분리하고 나머지는 searchRequest로
      const { page: _, limit: __, ...searchRequest } = filters;

      const response = await getFacilityList({
        page,
        limit: 10,
        searchRequest,
      });
      setFacilities(response.facilityList);
      setTotalCount(response.pagination.totalCount);
      setCurrentPage(page);
      setCurrentFilters(filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : '시설 검색에 실패했습니다.');
      setFacilities([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities({});
  }, []);

  const handleSearch = (filters: SearchFilters) => {
    fetchFacilities(filters, 1);
  };

  const handlePageChange = (page: number) => {
    fetchFacilities(currentFilters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sportColors: Record<string, string> = {
    '축구': '#16E0B4',
    '헬스': '#FF6B9D',
    '배구': '#FFA726',
    '수영': '#42A5F5',
    '농구': '#AB47BC',
    '테니스': '#66BB6A',
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(totalCount / 10);
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 기준으로 앞뒤 2개씩 표시
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      // 시작이 1에 가까우면 끝을 늘림
      if (currentPage <= 3) {
        endPage = maxPagesToShow;
      }

      // 끝이 마지막에 가까우면 시작을 줄임
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxPagesToShow + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="bg-[#F5F7FA] min-h-screen">
      <FilterBar resultCount={totalCount} onSearch={handleSearch} loading={loading} />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 md:py-8">
        <div className="flex gap-4 md:gap-8">
          {/* Sidebar Filter (Optional Extended) */}
          {showSidebar && (
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-[380px]">
                <div className="flex items-center justify-between mb-6">
                  <h4>추가 필터 옵션</h4>
                  <button onClick={() => setShowSidebar(false)}>
                    <ChevronLeft className="w-5 h-5 text-[#8B9DA9]" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block font-semibold mb-3">거리</label>
                    <div className="space-y-2">
                      {['1km 이내', '3km 이내', '5km 이내', '10km 이내'].map(distance => (
                        <label key={distance} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="w-5 h-5 accent-[#16E0B4]" />
                          <span>{distance}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#E1E8ED]">
                    <label className="block font-semibold mb-3">평점</label>
                    <div className="space-y-2">
                      {['4.5점 이상', '4.0점 이상', '3.5점 이상'].map(rating => (
                        <label key={rating} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="w-5 h-5 accent-[#16E0B4]" />
                          <span>{rating}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#E1E8ED]">
                    <label className="block font-semibold mb-3">운영 시간</label>
                    <div className="space-y-2">
                      {['24시간', '새벽 운영', '심야 운영'].map(hour => (
                        <label key={hour} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="w-5 h-5 accent-[#16E0B4]" />
                          <span>{hour}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {!showSidebar && (
              <button 
                onClick={() => setShowSidebar(true)}
                className="hidden lg:flex mb-4 px-4 py-2 bg-white border-2 border-[#E1E8ED] rounded-lg hover:border-[#16E0B4] transition-colors items-center gap-2"
              >
                <SlidersHorizontal className="w-5 h-5" />
                추가 필터 보기
              </button>
            )}

            {/* Sort Options */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 gap-3">
              <p className="text-[#8B9DA9] text-sm md:text-base">검색된 시설 <strong className="text-[#0D1B2A]">{totalCount}개</strong></p>
              <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
                <span className="text-[#8B9DA9] text-sm md:text-base">정렬:</span>
                <select className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-white border-2 border-[#E1E8ED] rounded-lg hover:border-[#16E0B4] focus:border-[#16E0B4] focus:outline-none cursor-pointer text-sm md:text-base">
                  <option>추천순</option>
                  <option>평점 높은순</option>
                  <option>리뷰 많은순</option>
                  <option>가격 낮은순</option>
                  <option>거리 가까운순</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <p className="text-[#8B9DA9]">시설 검색 중...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && facilities.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#8B9DA9]">검색 결과가 없습니다.</p>
              </div>
            )}

            {/* Facility Grid */}
            {!loading && !error && facilities.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                {facilities.map((facility) => (
                  <FacilityCard
                    key={facility.facilityId}
                    name={facility.name}
                    address={facility.address}
                    sport={facility.mainSport}
                    rating={facility.averRating}
                    reviewCount={0}
                    price="문의"
                    time="운영 시간 문의"
                    color={sportColors[facility.mainSport] || '#8B9DA9'}
                    facilities={[]}
                    onClick={() => onNavigate?.('detail')}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 0 && (
              <div className="flex items-center justify-center gap-2">
                {/* 이전 페이지 */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center bg-white border-2 border-[#E1E8ED] rounded-lg hover:border-[#16E0B4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* 첫 페이지 */}
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

                {/* 페이지 번호들 */}
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

                {/* 마지막 페이지 */}
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

                {/* 다음 페이지 */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center bg-white border-2 border-[#E1E8ED] rounded-lg hover:border-[#16E0B4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
