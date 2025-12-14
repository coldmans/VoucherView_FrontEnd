export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  // Facility endpoints
  FACILITIES: '/api/facilities',
  FAVORITE_FACILITIES: '/api/facilities/favorite',
  FACILITY_BY_ID: (id: number) => `/api/facilities/${id}`,
  FACILITY_COURSES: (id: number) => `/api/facilities/${id}/courses`,

  // Course endpoints
  COURSES: '/api/courses',
  COURSE_BY_ID: (id: number) => `/api/courses/${id}`,

  // Metadata endpoints
  METADATA_FILTERS: '/api/metadata/filters',
  METADATA_SPORTS: '/api/metadata/sports',
  METADATA_REGIONS: '/api/metadata/regions',
  METADATA_CITIES: (province: string) => `/api/metadata/regions/${encodeURIComponent(province)}/cities`,

  // Review endpoints
  REVIEWS: '/api/reviews',
  REVIEW_BY_ID: (id: number) => `/api/reviews/${id}`,
  REVIEWS_BY_FACILITY: (facilityId: number) => `/api/reviews/facility/${facilityId}`,
  FACILITY_RATING: (facilityId: number) => `/api/reviews/facility/${facilityId}/rating`,
  REVIEWS_BY_USER: (userId: number) => `/api/reviews/user/${userId}`,
} as const;
