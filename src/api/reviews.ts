import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import type {
  ReviewDto,
  CreateReviewRequest,
  UpdateReviewRequest,
  FacilityRatingResponse,
} from '../types/api';

/**
 * 리뷰 작성 (인증 필요)
 * @param request 리뷰 작성 요청 데이터
 * @returns 생성된 리뷰 정보
 */
export const createReview = async (
  request: CreateReviewRequest
): Promise<ReviewDto> => {
  return apiClient.post<ReviewDto>(API_ENDPOINTS.REVIEWS, request, true);
};

/**
 * 특정 시설의 리뷰 목록 조회
 * @param facilityId 시설 ID
 * @param page 페이지 번호
 * @param limit 페이지당 항목 수
 * @returns 리뷰 목록
 */
export const getReviewsByFacility = async (
  facilityId: number,
  page: number = 1,
  limit: number = 10
): Promise<ReviewDto[]> => {
  return apiClient.get<ReviewDto[]>(
    API_ENDPOINTS.REVIEWS_BY_FACILITY(facilityId),
    { page, limit }
  );
};

/**
 * 시설의 평균 별점 및 리뷰 개수 조회
 * @param facilityId 시설 ID
 * @returns 평균 별점 및 리뷰 개수
 */
export const getFacilityRating = async (
  facilityId: number
): Promise<FacilityRatingResponse> => {
  return apiClient.get<FacilityRatingResponse>(
    API_ENDPOINTS.FACILITY_RATING(facilityId)
  );
};

/**
 * 리뷰 수정 (인증 필요)
 * @param reviewId 리뷰 ID
 * @param request 수정할 리뷰 데이터
 */
export const updateReview = async (
  reviewId: number,
  request: UpdateReviewRequest
): Promise<void> => {
  return apiClient.put<void>(API_ENDPOINTS.REVIEW_BY_ID(reviewId), request, true);
};

/**
 * 리뷰 삭제 (인증 필요)
 * @param reviewId 리뷰 ID
 */
export const deleteReview = async (reviewId: number): Promise<void> => {
  return apiClient.delete<void>(API_ENDPOINTS.REVIEW_BY_ID(reviewId), true);
};

/**
 * 특정 유저의 리뷰 목록 조회
 * @param userId 유저 ID
 * @param page 페이지 번호
 * @param limit 페이지당 항목 수
 * @returns 리뷰 목록
 */
export const getReviewsByUser = async (
  userId: number,
  page: number = 1,
  limit: number = 10
): Promise<ReviewDto[]> => {
  return apiClient.get<ReviewDto[]>(
    API_ENDPOINTS.REVIEWS_BY_USER(userId),
    { page, limit }
  );
};
