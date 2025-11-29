# API 사용 가이드

이 문서는 VoucherView API를 프론트엔드에서 사용하는 방법을 설명합니다.

## 목차
- [API 기본 URL 변경](#api-기본-url-변경)
- [API 사용 예제](#api-사용-예제)
- [에러 처리](#에러-처리)

## API 기본 URL 변경

API 서버 주소가 변경되면 다음 파일을 수정하세요:

**`src/config/api.ts`**
```typescript
export const API_BASE_URL = 'http://localhost:8080'; // 여기를 변경
```

또는 런타임에 동적으로 변경:
```typescript
import { apiClient } from '@/api';

apiClient.setBaseUrl('https://api.example.com');
```

## API 사용 예제

### 1. 시설 목록 조회

```typescript
import { getFacilityList } from '@/api';

// 기본 조회
const response = await getFacilityList();
console.log(response.facilityList);
console.log(response.pagination);

// 필터링 및 검색
const filtered = await getFacilityList({
  page: 1,
  limit: 20,
  keyword: '수영',
  ctNm: '서울특별시',
  ctDetailNm: '강남구',
  mainSport: '수영',
  minRating: 4.0,
  sortBy: 'rating'
});

// 위치 기반 검색 (반경 검색)
const nearby = await getFacilityList({
  lat: 37.5665,
  lng: 126.9780,
  radius: 5000 // 5km 반경
});
```

### 2. 시설 상세 정보 조회

```typescript
import { getFacilityById } from '@/api';

const facility = await getFacilityById(123);
console.log(facility.name);
console.log(facility.address);
console.log(facility.averRating);
```

### 3. 시설의 강좌 목록 조회

```typescript
import { getFacilityCourses } from '@/api';

const courses = await getFacilityCourses({
  facilityId: 123,
  page: 1,
  limit: 10
});

console.log(courses.courses);
console.log(courses.pagination);
```

### 4. 전체 강좌 목록 조회

```typescript
import { getAllCourses } from '@/api';

const allCourses = await getAllCourses({
  page: 1,
  limit: 20
});
```

### 5. 강좌 상세 정보 조회

```typescript
import { getCourseById } from '@/api';

const course = await getCourseById(456);
console.log(course.courseName);
console.log(course.price);
console.log(course.startDate);
```

## React 컴포넌트에서 사용

### 함수형 컴포넌트에서 useState/useEffect 사용

```typescript
import { useState, useEffect } from 'react';
import { getFacilityList, FacilityDto } from '@/api';

function FacilityList() {
  const [facilities, setFacilities] = useState<FacilityDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true);
        const response = await getFacilityList({ page: 1, limit: 10 });
        setFacilities(response.facilityList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      {facilities.map(facility => (
        <div key={facility.facilityId}>
          <h3>{facility.name}</h3>
          <p>{facility.address}</p>
          <p>평점: {facility.averRating}</p>
        </div>
      ))}
    </div>
  );
}
```

### 검색 기능 구현

```typescript
import { useState } from 'react';
import { getFacilityList, FacilityDto } from '@/api';

function SearchFacilities() {
  const [keyword, setKeyword] = useState('');
  const [facilities, setFacilities] = useState<FacilityDto[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await getFacilityList({ keyword, page: 1, limit: 20 });
      setFacilities(response.facilityList);
    } catch (error) {
      console.error('검색 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="시설 검색..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? '검색 중...' : '검색'}
      </button>

      <div>
        {facilities.map(facility => (
          <div key={facility.facilityId}>{facility.name}</div>
        ))}
      </div>
    </div>
  );
}
```

## 에러 처리

```typescript
import { getFacilityList, ApiError } from '@/api';

try {
  const response = await getFacilityList();
  console.log(response);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API 에러:', error.message);
    console.error('상태 코드:', error.status);
    console.error('상세 정보:', error.data);
  } else {
    console.error('알 수 없는 에러:', error);
  }
}
```

## TypeScript 타입

모든 API 응답과 요청 파라미터는 TypeScript 타입으로 정의되어 있습니다:

```typescript
import type {
  FacilityDto,
  FacilityListResponse,
  CourseDto,
  CourseListResponse,
  Pagination,
  FacilityListParams,
} from '@/api';
```

## 파일 구조

```
src/
├── api/
│   ├── index.ts           # API 통합 export
│   ├── facilities.ts      # 시설 관련 API
│   └── courses.ts         # 강좌 관련 API
├── config/
│   └── api.ts            # API URL 설정 (여기서 URL 변경)
├── types/
│   └── api.ts            # TypeScript 타입 정의
└── utils/
    └── apiClient.ts      # HTTP 클라이언트 유틸리티
```

## 주의사항

1. API 서버가 실행 중이어야 합니다 (기본: http://localhost:8080)
2. CORS 설정이 올바르게 되어 있어야 합니다
3. 모든 API 함수는 async/await를 사용합니다
4. 에러 처리를 항상 구현하세요
