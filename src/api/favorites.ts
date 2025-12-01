import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface FavoriteFacility {
  favoriteId: number;
  userId: number;
  facilityId: number;
  createdAt: string;
}

export interface FavoriteStatusResponse {
  isFavorite: boolean;
}

export interface FavoriteCountResponse {
  facilityId: number;
  favoriteCount: number;
}

/**
 * 찜 추가
 * POST /api/favorites/{facilityId}
 */
export const addFavorite = async (facilityId: number): Promise<{ message: string }> => {
  return apiClient.post<{ message: string }>(
    `/api/favorites/${facilityId}`,
    undefined,
    true
  );
};

/**
 * 찜 삭제
 * DELETE /api/favorites/{facilityId}
 */
export const removeFavorite = async (facilityId: number): Promise<void> => {
  return apiClient.delete<void>(`/api/favorites/${facilityId}`, true);
};

/**
 * 찜 여부 확인
 * GET /api/favorites/{facilityId}/status
 */
export const checkFavoriteStatus = async (
  facilityId: number
): Promise<FavoriteStatusResponse> => {
  return apiClient.get<FavoriteStatusResponse>(
    `/api/favorites/${facilityId}/status`,
    undefined,
    true
  );
};

/**
 * 내 찜 목록 조회
 * GET /api/favorites
 */
export const getMyFavorites = async (): Promise<FavoriteFacility[]> => {
  return apiClient.get<FavoriteFacility[]>('/api/favorites', undefined, true);
};

/**
 * 시설의 찜 개수 조회
 * GET /api/favorites/facility/{facilityId}/count
 */
export const getFavoriteCount = async (
  facilityId: number
): Promise<FavoriteCountResponse> => {
  return apiClient.get<FavoriteCountResponse>(
    `/api/favorites/facility/${facilityId}/count`
  );
};
