export const API_BASE_URL = 'http://localhost:8080';

export const API_ENDPOINTS = {
  // Facility endpoints
  FACILITIES: '/api/facilities',
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
} as const;
