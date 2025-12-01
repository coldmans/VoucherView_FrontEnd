// Facility types
export interface FacilityDto {
  facilityId: number;
  name: string;
  address: string;
  phoneNumber: string;
  mainSport: string;
  averRating: number;
  reviewCount: number;
  isFavorite: boolean;
  latitude: number;
  longitude: number;
}

export interface FacilityListResponse {
  facilityList: FacilityDto[];
  pagination: Pagination;
}

// Course types
export interface CourseDto {
  courseId: number;
  facilityId: number;
  courseNo: string;
  courseName: string;
  sportCd: string;
  sportName: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  establishmentYear: string;
  establishmentMonth: string;
  requestCount: number;
  price: number;
}

export interface CourseListResponse {
  courses: CourseDto[];
  pagination: Pagination;
}

// Pagination type
export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  offset: number;
  displayPageCount: number;
  startPage: number;
  endPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Metadata types
export interface RegionDto {
  province: string;
  cities: string[];
}

export interface FilterMetadataResponse {
  regions: RegionDto[];
  sports: string[];
  minRating: number;
  maxRating: number;
}

// Request parameter types
export interface FacilitySearchRequest {
  keyword?: string;
  ctNm?: string; // 시/도
  ctDetailNm?: string; // 구/군
  mainSport?: string;
  minRating?: number;
  maxRating?: number;
  sortBy?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}

export interface FacilityListParams {
  page?: number;
  limit?: number;
  searchRequest?: FacilitySearchRequest;
}

export interface CourseListParams {
  page?: number;
  limit?: number;
}

export interface FacilityCoursesParams {
  facilityId: number;
  page?: number;
  limit?: number;
}

// Review types
export interface ReviewDto {
  reviewId: number;
  userId: number;
  facilityId: number;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListResponse {
  reviews: ReviewDto[];
  pagination: Pagination;
}

export interface CreateReviewRequest {
  facilityId: number;
  content: string;
  rating: number;
}

export interface UpdateReviewRequest {
  content: string;
  rating: number;
}

export interface FacilityRatingResponse {
  facilityId: number;
  averageRating: number;
  reviewCount: number;
}
