import React, { useState, useEffect } from 'react';
import { Star, Edit2, Trash2, Send } from 'lucide-react';
import { ReviewDto, FacilityRatingResponse } from '../types/api';
import {
  getReviewsByFacility,
  getFacilityRating,
  createReview,
  updateReview,
  deleteReview,
} from '../api/reviews';
import { Toast } from './Toast';

interface ReviewSectionProps {
  facilityId: number;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ facilityId }) => {
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [ratingInfo, setRatingInfo] = useState<FacilityRatingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 리뷰 작성/수정 폼 상태
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);

  // 인증 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Toast 상태
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    // 로그인 상태 확인
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!token);

    // userId를 숫자로 변환 (타입 일치를 위해)
    if (userId) {
      const parsedUserId = parseInt(userId, 10);
      setCurrentUserId(isNaN(parsedUserId) ? null : parsedUserId);
    } else {
      setCurrentUserId(null);
    }

    fetchReviews();
    fetchRating();
  }, [facilityId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReviewsByFacility(facilityId, 1, 50);
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '리뷰를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRating = async () => {
    try {
      const data = await getFacilityRating(facilityId);
      setRatingInfo(data);
    } catch (err) {
      console.error('평점 정보를 불러오는데 실패했습니다:', err);
    }
  };

  const handleSubmitReview = async () => {
    if (!content.trim()) {
      showToast('리뷰 내용을 입력해주세요.', 'error');
      return;
    }

    try {
      if (editingReviewId) {
        // 수정
        await updateReview(editingReviewId, { content, rating });
        showToast('리뷰가 수정되었습니다.');
        setEditingReviewId(null);
      } else {
        // 작성
        await createReview({ facilityId, content, rating });
        showToast('리뷰가 작성되었습니다.');
      }

      setContent('');
      setRating(5);
      fetchReviews();
      fetchRating();
    } catch (err: any) {
      // 중복 리뷰 에러 처리
      let errorMessage = '리뷰 작성/수정에 실패했습니다.';

      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      // "이미" 또는 "중복"이 포함된 경우 중복 리뷰로 간주
      if (errorMessage.includes('이미') || errorMessage.includes('중복')) {
        showToast('이미 작성한 리뷰가 있습니다.', 'error');
      } else {
        showToast(errorMessage, 'error');
      }
    }
  };

  const handleEditReview = (review: ReviewDto) => {
    setEditingReviewId(review.reviewId);
    setContent(review.content);
    setRating(review.rating);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('리뷰를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteReview(reviewId);
      showToast('리뷰가 삭제되었습니다.');
      fetchReviews();
      fetchRating();
    } catch (err) {
      showToast(err instanceof Error ? err.message : '리뷰 삭제에 실패했습니다.', 'error');
    }
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setContent('');
    setRating(5);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (count: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate && onRate(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} transition-transform`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= count ? 'text-[#FFA726] fill-[#FFA726]' : 'text-[#E1E8ED]'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div>
        <div className="flex items-center justify-between mb-6">
          <h3>리뷰 ({ratingInfo?.reviewCount || 0})</h3>
        {ratingInfo && (
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-[#FFA726] fill-[#FFA726]" />
            <span className="text-xl font-bold">{ratingInfo.averageRating.toFixed(1)}</span>
            <span className="text-[#8B9DA9]">/ 5.0</span>
          </div>
        )}
      </div>

      {/* 리뷰 작성 폼 */}
      {isLoggedIn ? (
        <div className="mb-6 p-6 bg-[#F5F7FA] rounded-2xl border-2 border-[#E1E8ED]">
          <h4 className="mb-4">{editingReviewId ? '리뷰 수정' : '리뷰 작성'}</h4>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">별점</label>
            {renderStars(rating, true, setRating)}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">리뷰 내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="이 시설에 대한 리뷰를 작성해주세요."
              className="w-full p-4 border-2 border-[#E1E8ED] rounded-xl focus:border-[#16E0B4] focus:outline-none resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmitReview}
              className="flex-1 py-3 bg-[#16E0B4] text-[#0D1B2A] rounded-xl hover:bg-[#14c9a0] transition-colors font-bold flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {editingReviewId ? '수정하기' : '작성하기'}
            </button>
            {editingReviewId && (
              <button
                onClick={handleCancelEdit}
                className="px-6 py-3 bg-[#E1E8ED] text-[#0D1B2A] rounded-xl hover:bg-[#d1d8dd] transition-colors font-bold"
              >
                취소
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-6 p-6 bg-[#FFF3E0] border-2 border-[#FFA726] rounded-2xl">
          <p className="text-[#0D1B2A] font-semibold">
            리뷰를 작성하려면 로그인이 필요합니다.
          </p>
        </div>
      )}

      {/* 로딩 상태 */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-[#8B9DA9]">리뷰를 불러오는 중...</p>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* 리뷰 목록 */}
      {!loading && !error && reviews.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-[#E1E8ED] rounded-2xl">
          <p className="text-[#8B9DA9]">아직 작성된 리뷰가 없습니다. 첫 리뷰를 작성해보세요!</p>
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => {
            const canEdit = isLoggedIn && currentUserId !== null && currentUserId === review.userId;

            return (
              <div
                key={review.reviewId}
                className="p-6 border-2 border-[#E1E8ED] rounded-xl hover:border-[#16E0B4]/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-[#8B9DA9]">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <p className="text-[#0D1B2A] leading-relaxed">{review.content}</p>
                  </div>

                  {/* 본인 리뷰인 경우 수정/삭제 버튼 */}
                  {canEdit && (
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="p-2 text-[#16E0B4] hover:bg-[#16E0B4]/10 rounded-lg transition-colors"
                        title="수정"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.reviewId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {review.updatedAt !== review.createdAt && (
                  <p className="text-xs text-[#8B9DA9] mt-2">
                    (수정됨: {formatDate(review.updatedAt)})
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
      </div>
    </>
  );
};
