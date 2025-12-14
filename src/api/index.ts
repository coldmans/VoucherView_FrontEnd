// Facility API
export {
  getFacilityList,
  getFavoriteFacilities,
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

// Review API
export {
  createReview,
  getReviewsByFacility,
  getFacilityRating,
  updateReview,
  deleteReview,
  getReviewsByUser,
} from './reviews';

// Favorite API
export {
  addFavorite,
  removeFavorite,
  checkFavoriteStatus,
  getMyFavorites,
  getFavoriteCount,
} from './favorites';

// Re-export types
export type * from '../types/api';

// Re-export API client for advanced usage
export { apiClient, ApiError } from '../utils/apiClient';

// Re-export config for URL changes
export { API_BASE_URL, API_ENDPOINTS } from '../config/api';
