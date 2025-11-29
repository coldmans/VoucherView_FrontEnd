import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import type { FilterMetadataResponse, RegionDto } from '../types/api';

/**
 * 모든 필터 메타데이터 조회 (지역, 종목, 평점 범위)
 * @returns 필터에 사용할 모든 메타데이터
 */
export const getFilterMetadata = async (): Promise<FilterMetadataResponse> => {
  return apiClient.get<FilterMetadataResponse>(API_ENDPOINTS.METADATA_FILTERS);
};

/**
 * 사용 가능한 운동 종목 목록 조회
 * @returns 운동 종목 문자열 배열
 */
export const getAvailableSports = async (): Promise<string[]> => {
  return apiClient.get<string[]>(API_ENDPOINTS.METADATA_SPORTS);
};

/**
 * 사용 가능한 지역 목록 조회
 * @returns 시/도와 구/군 정보가 포함된 지역 배열
 */
export const getAvailableRegions = async (): Promise<RegionDto[]> => {
  return apiClient.get<RegionDto[]>(API_ENDPOINTS.METADATA_REGIONS);
};

/**
 * 특정 시/도의 구/군 목록 조회
 * @param province 시/도 이름
 * @returns 구/군 문자열 배열
 */
export const getCitiesByProvince = async (
  province: string
): Promise<string[]> => {
  return apiClient.get<string[]>(API_ENDPOINTS.METADATA_CITIES(province));
};
