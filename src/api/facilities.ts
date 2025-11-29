import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import type {
  FacilityDto,
  FacilityListResponse,
  FacilityListParams,
  FacilitySearchRequest,
  CourseListResponse,
  FacilityCoursesParams,
} from '../types/api';

/**
 * 시설 목록 조회
 * @param params 검색 및 필터 파라미터
 * @returns 시설 목록과 페이지네이션 정보
 */
export const getFacilityList = async (
  params?: FacilityListParams
): Promise<FacilityListResponse> => {
  // searchRequest가 있으면 쿼리 파라미터로 펼쳐서 전달
  const queryParams = {
    page: params?.page,
    limit: params?.limit,
    ...params?.searchRequest,
  };

  return apiClient.get<FacilityListResponse>(API_ENDPOINTS.FACILITIES, queryParams);
};

/**
 * 특정 시설 상세 정보 조회
 * @param facilityId 시설 ID
 * @returns 시설 상세 정보
 */
export const getFacilityById = async (
  facilityId: number
): Promise<FacilityDto> => {
  return apiClient.get<FacilityDto>(API_ENDPOINTS.FACILITY_BY_ID(facilityId));
};

/**
 * 특정 시설의 강좌 목록 조회
 * @param params 시설 ID와 페이지네이션 파라미터
 * @returns 강좌 목록과 페이지네이션 정보
 */
export const getFacilityCourses = async (
  params: FacilityCoursesParams
): Promise<CourseListResponse> => {
  const { facilityId, ...queryParams } = params;
  return apiClient.get<CourseListResponse>(
    API_ENDPOINTS.FACILITY_COURSES(facilityId),
    queryParams
  );
};
