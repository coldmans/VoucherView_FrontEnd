import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import type {
  CourseDto,
  CourseListResponse,
  CourseListParams,
} from '../types/api';

/**
 * 전체 강좌 목록 조회
 * @param params 페이지네이션 파라미터
 * @returns 강좌 목록과 페이지네이션 정보
 */
export const getAllCourses = async (
  params?: CourseListParams
): Promise<CourseListResponse> => {
  return apiClient.get<CourseListResponse>(API_ENDPOINTS.COURSES, params);
};

/**
 * 특정 강좌 상세 정보 조회
 * @param courseId 강좌 ID
 * @returns 강좌 상세 정보
 */
export const getCourseById = async (courseId: number): Promise<CourseDto> => {
  return apiClient.get<CourseDto>(API_ENDPOINTS.COURSE_BY_ID(courseId));
};
