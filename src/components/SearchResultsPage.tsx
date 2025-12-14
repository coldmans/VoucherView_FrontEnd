import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterBar, SearchFilters } from './FilterBar';
import { FacilityCard } from './FacilityCard';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { getFacilityList, FacilityDto, addFavorite, removeFavorite } from '../api';
import { getCurrentPosition } from '../utils/geolocation';
import { Toast } from './Toast';

export const SearchResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);
  const [facilities, setFacilities] = useState<FacilityDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});
  const [selectedRadius, setSelectedRadius] = useState<number | undefined>(undefined);
  const [selectedMinRating, setSelectedMinRating] = useState<number | undefined>(undefined);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [locationAvailable, setLocationAvailable] = useState<boolean | null>(null);

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

    // 위치정보 권한 확인
    const checkLocationPermission = async () => {
      try {
        await getCurrentPosition();
        setLocationAvailable(true);
      } catch (error) {
        setLocationAvailable(false);
      }
    };
    checkLocationPermission();
  }, []);

  const handleSearch = (filters: SearchFilters) => {
    fetchFacilities(filters, 1);
  };

  const handlePageChange = (page: number) => {
    fetchFacilities(currentFilters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = async (sortBy: string) => {
    // 거리순 정렬일 때 위치 정보가 필요
    if (sortBy === 'distance') {
      if (locationAvailable === false) {
        setToastMessage('위치 정보를 사용할 수 없어 거리순 정렬을 사용할 수 없습니다.');
        setToastType('error');
        setShowToast(true);
        return;
      }

      try {
        setLoading(true);
        const position = await getCurrentPosition();
        setLocationAvailable(true);
        const updatedFilters = {
          ...currentFilters,
          sortBy,
          lat: position.lng, // 백엔드에서 반대로 받음
          lng: position.lat,
        };
        fetchFacilities(updatedFilters, 1);
      } catch (error: any) {
        setLoading(false);
        setLocationAvailable(false);
        setToastMessage(error.message || '위치 정보를 가져올 수 없어 거리순 정렬을 사용할 수 없습니다.');
        setToastType('error');
        setShowToast(true);
      }
    } else {
      const updatedFilters = { ...currentFilters, sortBy };
      fetchFacilities(updatedFilters, 1);
    }
  };

  const handleDistanceFilter = async (radius: number) => {
    // 이미 선택된 거리를 다시 클릭하면 해제
    if (selectedRadius === radius) {
      setSelectedRadius(undefined);
      const { radius: _, ...restFilters } = currentFilters;
      console.log('거리 필터 해제:', restFilters);
      fetchFacilities(restFilters, 1);
      return;
    }

    if (locationAvailable === false) {
      setToastMessage('위치 정보를 사용할 수 없어 거리 필터를 사용할 수 없습니다.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    try {
      setLoading(true);
      setSelectedRadius(radius);
      const position = await getCurrentPosition();
      setLocationAvailable(true);
      const updatedFilters = {
        ...currentFilters,
        lat: position.lng,
        lng: position.lat,
        radius,
      };
      fetchFacilities(updatedFilters, 1);
    } catch (error: any) {
      setLoading(false);
      setSelectedRadius(undefined);
      setLocationAvailable(false);
      setToastMessage(error.message || '위치 정보를 가져올 수 없어 거리 필터를 사용할 수 없습니다.');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleRatingFilter = (minRating: number) => {
    // 이미 선택된 평점을 다시 클릭하면 해제
    if (selectedMinRating === minRating) {
      setSelectedMinRating(undefined);
      const { minRating: _, ...restFilters } = currentFilters;
      fetchFacilities(restFilters, 1);
      return;
    }

    setSelectedMinRating(minRating);
    const updatedFilters = {
      ...currentFilters,
      minRating,
    };
    fetchFacilities(updatedFilters, 1);
  };

  const handleFavoriteToggle = async (facilityId: number, isFavorite: boolean) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setToastMessage('로그인이 필요한 기능입니다.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    try {
      if (isFavorite) {
        await addFavorite(facilityId);
        setToastMessage('찜 목록에 추가되었습니다.');
      } else {
        await removeFavorite(facilityId);
        setToastMessage('찜 목록에서 제거되었습니다.');
      }
      setToastType('success');
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(error.message || '찜 처리 중 오류가 발생했습니다.');
      setToastType('error');
      setShowToast(true);
    }
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

      <div className="max-w-[1440px] mx-auto px-3 md:px-8 py-4 md:py-8">
        <div className="flex gap-3 md:gap-8">
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
                    <label className="block font-semibold mb-3">
                      거리
                      {locationAvailable === false && (
                        <span className="ml-2 text-xs text-red-500">(위치정보 없음)</span>
                      )}
                    </label>
                    <div className="space-y-2">
                      {[
                        { label: '1km 이내', value: 1000 },
                        { label: '3km 이내', value: 3000 },
                        { label: '5km 이내', value: 5000 },
                        { label: '10km 이내', value: 10000 }
                      ].map(({ label, value }) => (
                        <button
                          key={value}
                          onClick={() => handleDistanceFilter(value)}
                          disabled={locationAvailable === false}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                            selectedRadius === value
                              ? 'bg-[#16E0B4] text-white'
                              : 'bg-gray-50 hover:bg-gray-100'
                          } ${locationAvailable === false ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#E1E8ED]">
                    <label className="block font-semibold mb-3">평점</label>
                    <div className="space-y-2">
                      {[
                        { label: '4.5점 이상', value: 4.5 },
                        { label: '4.0점 이상', value: 4.0 },
                        { label: '3.5점 이상', value: 3.5 }
                      ].map(({ label, value }) => (
                        <button
                          key={value}
                          onClick={() => handleRatingFilter(value)}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                            selectedMinRating === value
                              ? 'bg-[#16E0B4] text-white'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          {label}
                        </button>
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
                <select
                  value={currentFilters.sortBy || 'rating'}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-white border-2 border-[#E1E8ED] rounded-lg hover:border-[#16E0B4] focus:border-[#16E0B4] focus:outline-none cursor-pointer text-sm md:text-base"
                >
                  <option value="rating">평점 높은순</option>
                  <option value="distance" disabled={locationAvailable === false}>
                    거리 가까운순{locationAvailable === false ? ' (위치정보 없음)' : ''}
                  </option>
                  <option value="name">이름순</option>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-6 md:mb-8">
                {facilities.map((facility) => (
                  <FacilityCard
                    key={facility.facilityId}
                    facilityId={facility.facilityId}
                    name={facility.name}
                    address={facility.address}
                    sport={facility.mainSport}
                    rating={facility.averRating}
                    reviewCount={facility.reviewCount}
                    isFavorite={facility.isFavorite}
                    color={sportColors[facility.mainSport] || '#8B9DA9'}
                    facilities={[]}
                    onClick={() => navigate(`/facility/${facility.facilityId}`)}
                    onFavoriteToggle={handleFavoriteToggle}
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

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};
