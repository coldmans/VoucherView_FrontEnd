// Facility API
export {
  getFacilityList,
  getFacilityById,
  getFacilityCourses,
} from './facilities';

// Course API
export { getAllCourses, getCourseById } from './courses';

// Metadata API
export {
  getFilterMetadata,
  getAvailableSports,
  getAvailableRegions,
  getCitiesByProvince,
} from './metadata';

// Re-export types
export type * from '../types/api';

// Re-export API client for advanced usage
export { apiClient, ApiError } from '../utils/apiClient';

// Re-export config for URL changes
export { API_BASE_URL, API_ENDPOINTS } from '../config/api';
