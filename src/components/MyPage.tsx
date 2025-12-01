import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Star, Trophy } from 'lucide-react';
import { getReviewsByUser, ReviewDto, getMyFavorites, getFacilityById, FacilityDto, removeFavorite, updateReview, deleteReview } from '../api';
import { getUserIdFromToken } from '../utils/jwt';
import { Toast } from './Toast';

interface ReviewWithFacility extends ReviewDto {
  facilityName?: string;
}

export const MyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reviews');
  const [myReviews, setMyReviews] = useState<ReviewWithFacility[]>([]);
  const [myFavorites, setMyFavorites] = useState<FacilityDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favoritesError, setFavoritesError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState(0);

  // localStorage에서 닉네임 가져오기
  const nickname = localStorage.getItem('nickname') || '사용자';

  useEffect(() => {
    fetchMyReviews();
    fetchMyFavorites();
  }, []);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('로그인이 필요합니다.');
        return;
      }

      const userId = getUserIdFromToken(token);
      if (!userId) {
        setError('사용자 정보를 찾을 수 없습니다.');
        return;
      }

      const reviews = await getReviewsByUser(userId, 1, 100);

      // 각 리뷰의 시설 정보 가져오기
      const reviewsWithFacility = await Promise.all(
        reviews.map(async (review) => {
          try {
            const facility = await getFacilityById(review.facilityId);
            return {
              ...review,
              facilityName: facility.name,
            };
          } catch (err) {
            // 시설 정보를 가져오지 못한 경우 기본값 사용
            return {
              ...review,
              facilityName: `시설 ID: ${review.facilityId}`,
            };
          }
        })
      );

      setMyReviews(reviewsWithFacility);
    } catch (err) {
      setError(err instanceof Error ? err.message : '리뷰를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\. /g, '.').replace(/\.$/, '');
  };

  const fetchMyFavorites = async () => {
    try {
      setFavoritesLoading(true);
      setFavoritesError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setFavoritesError('로그인이 필요합니다.');
        return;
      }

      const favoritesData = await getMyFavorites();

      // facilityId로 시설 상세 정보 가져오기
      const facilitiesPromises = favoritesData.map(fav => getFacilityById(fav.facilityId));
      const facilities = await Promise.all(facilitiesPromises);

      setMyFavorites(facilities);
    } catch (err) {
      setFavoritesError(err instanceof Error ? err.message : '찜 목록을 불러올 수 없습니다.');
    } finally {
      setFavoritesLoading(false);
    }
  };

  const handleRemoveFavorite = async (facilityId: number) => {
    try {
      await removeFavorite(facilityId);
      setMyFavorites(prev => prev.filter(fav => fav.facilityId !== facilityId));
      setToastMessage('찜 목록에서 제거되었습니다.');
      setToastType('success');
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(error.message || '찜 제거 중 오류가 발생했습니다.');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleEditReview = (review: ReviewWithFacility) => {
    setEditingReviewId(review.reviewId);
    setEditContent(review.content);
    setEditRating(review.rating);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditContent('');
    setEditRating(0);
  };

  const handleSaveEdit = async (reviewId: number) => {
    try {
      if (!editContent.trim()) {
        setToastMessage('리뷰 내용을 입력해주세요.');
        setToastType('error');
        setShowToast(true);
        return;
      }

      if (editRating === 0) {
        setToastMessage('별점을 선택해주세요.');
        setToastType('error');
        setShowToast(true);
        return;
      }

      await updateReview(reviewId, {
        content: editContent,
        rating: editRating,
      });

      // 리뷰 목록 새로고침
      await fetchMyReviews();

      setEditingReviewId(null);
      setEditContent('');
      setEditRating(0);
      setToastMessage('리뷰가 수정되었습니다.');
      setToastType('success');
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(error.message || '리뷰 수정 중 오류가 발생했습니다.');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteReview(reviewId);

      // 로컬 상태에서 삭제
      setMyReviews(prev => prev.filter(review => review.reviewId !== reviewId));

      setToastMessage('리뷰가 삭제되었습니다.');
      setToastType('success');
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(error.message || '리뷰 삭제 중 오류가 발생했습니다.');
      setToastType('error');
      setShowToast(true);
    }
  };

  const calculateAverageRating = () => {
    if (myReviews.length === 0) return 0;
    const sum = myReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / myReviews.length).toFixed(1);
  };

  const sportColors: Record<string, string> = {
    '축구': '#16E0B4',
    '헬스': '#FF6B9D',
    '배구': '#FFA726',
    '수영': '#42A5F5',
    '농구': '#AB47BC',
    '테니스': '#66BB6A',
  };

  return (
    <div className="bg-[#F5F7FA] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm p-4 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
            <div className="flex-1">
              <h2 className="mb-2">{nickname}님</h2>
              <p className="text-[#8B9DA9] mb-6">카카오 로그인</p>
              
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
                  <p className="font-bold">{myFavorites.length}개</p>
                </div>
                
                <div className="p-4 bg-[#F5F7FA] rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="w-5 h-5 text-[#16E0B4]" />
                    <span className="text-[#8B9DA9]">평균 별점</span>
                  </div>
                  <p className="font-bold">{calculateAverageRating()}점</p>
                </div>
              </div>
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
              <>
                {loading && (
                  <div className="text-center py-12">
                    <p className="text-[#8B9DA9]">리뷰를 불러오는 중...</p>
                  </div>
                )}

                {error && (
                  <div className="text-center py-12">
                    <p className="text-red-500">{error}</p>
                  </div>
                )}

                {!loading && !error && myReviews.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-[#8B9DA9]">작성한 리뷰가 없습니다.</p>
                  </div>
                )}

                {!loading && !error && myReviews.length > 0 && (
                  <div className="space-y-6">
                    {myReviews.map((review) => (
                      <div key={review.reviewId} className="p-6 bg-[#F5F7FA] rounded-2xl border-2 border-transparent hover:border-[#16E0B4] transition-colors">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[#16E0B4]/20"
                          >
                            <Star className="w-8 h-8 text-[#16E0B4]" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4>{review.facilityName}</h4>
                              <span className="text-[#8B9DA9] text-sm">{formatDate(review.createdAt)}</span>
                            </div>

                            {editingReviewId === review.reviewId ? (
                              // 편집 모드
                              <>
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-sm text-[#8B9DA9]">별점:</span>
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`w-5 h-5 cursor-pointer transition-colors ${
                                          star <= editRating
                                            ? 'text-[#FFA726] fill-[#FFA726]'
                                            : 'text-[#E1E8ED]'
                                        }`}
                                        onClick={() => setEditRating(star)}
                                      />
                                    ))}
                                  </div>
                                </div>

                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="w-full p-3 border-2 border-[#E1E8ED] rounded-lg focus:border-[#16E0B4] focus:outline-none mb-4 resize-none"
                                  rows={4}
                                  placeholder="리뷰 내용을 입력하세요"
                                />

                                <div className="flex gap-3">
                                  <button
                                    onClick={() => handleSaveEdit(review.reviewId)}
                                    className="px-4 py-2 bg-[#16E0B4] text-white rounded-lg hover:bg-[#12c9a0] transition-colors text-sm"
                                  >
                                    저장
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 bg-white border-2 border-[#E1E8ED] rounded-lg hover:border-[#0D1B2A] transition-colors text-sm"
                                  >
                                    취소
                                  </button>
                                </div>
                              </>
                            ) : (
                              // 일반 모드
                              <>
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="flex items-center gap-1">
                                    {[...Array(review.rating)].map((_, i) => (
                                      <Star key={i} className="w-4 h-4 text-[#FFA726] fill-[#FFA726]" />
                                    ))}
                                  </div>
                                </div>

                                <p className="text-[#0D1B2A] mb-4">{review.content}</p>

                                <div className="flex gap-3">
                                  <button
                                    onClick={() => handleEditReview(review)}
                                    className="px-4 py-2 bg-white border-2 border-[#E1E8ED] rounded-lg hover:border-[#0D1B2A] transition-colors text-sm"
                                  >
                                    수정
                                  </button>
                                  <button
                                    onClick={() => handleDeleteReview(review.reviewId)}
                                    className="px-4 py-2 bg-white border-2 border-[#E1E8ED] rounded-lg hover:border-red-500 hover:text-red-500 transition-colors text-sm"
                                  >
                                    삭제
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'favorites' && (
              <>
                {favoritesLoading && (
                  <div className="text-center py-12">
                    <p className="text-[#8B9DA9]">찜 목록을 불러오는 중...</p>
                  </div>
                )}

                {favoritesError && (
                  <div className="text-center py-12">
                    <p className="text-red-500">{favoritesError}</p>
                  </div>
                )}

                {!favoritesLoading && !favoritesError && myFavorites.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-[#8B9DA9]">찜한 시설이 없습니다.</p>
                  </div>
                )}

                {!favoritesLoading && !favoritesError && myFavorites.length > 0 && (
                  <div className="grid grid-cols-2 gap-6">
                    {myFavorites.map((facility) => (
                      <div
                        key={facility.facilityId}
                        className="bg-white rounded-2xl border-2 border-[#E1E8ED] hover:border-[#16E0B4] transition-all cursor-pointer p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="inline-block px-3 py-1 rounded-full text-sm"
                            style={{
                              backgroundColor: sportColors[facility.mainSport] + '20',
                              color: sportColors[facility.mainSport] || '#8B9DA9',
                            }}
                          >
                            {facility.mainSport}
                          </div>
                          <button
                            className="w-8 h-8 bg-[#F5F7FA] rounded-full flex items-center justify-center hover:bg-[#e5e7ea] transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFavorite(facility.facilityId);
                            }}
                          >
                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                          </button>
                        </div>

                        <h4 className="mb-2">{facility.name}</h4>
                        <p className="text-[#8B9DA9] text-sm mb-4">{facility.address}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-[#FFA726]">★</span>
                          <span className="font-semibold">{facility.averRating}</span>
                          <span className="text-[#8B9DA9]">({facility.reviewCount})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
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
    </div>
  );
};
