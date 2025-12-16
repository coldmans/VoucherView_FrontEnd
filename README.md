# VoucherView Frontend

> 스포츠 시설 검색 및 커뮤니티 플랫폼의 프론트엔드 애플리케이션

학부모님들이 우리 아이를 위한 최적의 운동 시설을 쉽고 빠르게 찾을 수 있도록 돕는 웹 애플리케이션입니다.

## 주요 기능

### 🔍 스포츠 시설 검색
- **강력한 필터링**: 지역(시/도, 구/군), 종목, 거리, 평점 기반 검색
- **위치 기반 검색**: 현재 위치에서 가까운 시설 찾기 (1km ~ 10km)
- **정렬 옵션**: 평점순, 거리순, 이름순
- **인기 시설**: 찜이 많은 Top3 시설 추천

### 📍 시설 상세 정보
- 시설 기본 정보 (주소, 전화번호, 운영 종목)
- 네이버 지도 연동 (위치 표시, 길찾기)
- 실시간 평점 및 리뷰
- 찜하기 기능

### 📝 커뮤니티
- 게시글 작성/수정/삭제
- 댓글 및 대댓글 기능
- 좋아요 기능
- 게시글 검색

### 👤 사용자 기능
- 로그인/회원가입
- 마이페이지 (찜 목록, 내 리뷰, 내 게시글)
- 리뷰 작성 및 관리

## 기술 스택

### Core
- **React** 18.3.1 - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** 6.3.5 - 빌드 도구
- **React Router** 7.1.1 - 라우팅

### Styling
- **Tailwind CSS** 4.1.17 - 유틸리티 기반 CSS
- **Radix UI** - 접근성 있는 UI 컴포넌트
- **Lucide React** - 아이콘

### State Management & API
- **Axios** - HTTP 클라이언트
- **Custom API Client** - 타입 안전한 API 통신

### Maps
- **Naver Maps API** - 지도 및 길찾기

### Development
- **SWC** - 빠른 컴파일
- **PostCSS** - CSS 처리
- **Docker** - 컨테이너화

## 시작하기

### Prerequisites

- Node.js 20.x 이상
- npm 또는 yarn
- Naver Maps API 클라이언트 ID/Secret

### 설치

```bash
# 저장소 클론
git clone https://github.com/coldmans/VoucherView_FrontEnd.git
cd VoucherView_FrontEnd

# 의존성 설치
npm install
```

### 환경 변수 설정

`.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# Naver Maps API
VITE_NAVER_MAP_CLIENT_ID=your_client_id
VITE_NAVER_MAP_CLIENT_SECRET=your_client_secret

# Backend API URL
VITE_API_BASE_URL=http://localhost:8080
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `build/` 디렉토리에 생성됩니다.

## Docker 배포

### Docker 이미지 빌드

```bash
# 로컬 빌드
docker build --platform linux/amd64 -t voucherview-frontend:latest .

# Docker Hub에 푸시
docker tag voucherview-frontend:latest coldmans/webfront:latest
docker push coldmans/webfront:latest
```

### Docker 컨테이너 실행

```bash
# 컨테이너 실행
docker run -d -p 80:80 coldmans/webfront:latest

# 로그 확인
docker logs <container_id>
```

### Cloud Run 배포

```bash
# Cloud Run에 배포
gcloud run deploy voucherview-frontend \
  --image coldmans/webfront:latest \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated
```

## 프로젝트 구조

```
src/
├── api/                    # API 통신 관련
│   ├── facilities.ts       # 시설 API
│   ├── favorites.ts        # 찜 API
│   ├── reviews.ts          # 리뷰 API
│   ├── post.ts            # 커뮤니티 API
│   └── index.ts           # API 통합
├── components/            # React 컴포넌트
│   ├── HomePage.tsx       # 홈페이지
│   ├── SearchResultsPage.tsx  # 검색 결과
│   ├── FacilityDetailPage.tsx # 시설 상세
│   ├── CommunityPage.tsx      # 커뮤니티
│   ├── MyPage.tsx            # 마이페이지
│   └── ui/               # 재사용 가능한 UI 컴포넌트
├── types/                # TypeScript 타입 정의
│   ├── api.ts           # API 타입
│   └── post.ts          # 게시글 타입
├── utils/               # 유틸리티 함수
│   ├── apiClient.ts    # API 클라이언트
│   ├── geolocation.ts  # 위치 정보
│   └── directions.ts   # 길찾기
├── config/             # 설정 파일
│   └── api.ts         # API 엔드포인트
├── App.tsx            # 앱 메인
└── index.css          # 글로벌 스타일
```

## 주요 페이지

### 홈페이지 (`/`)
- 히어로 섹션
- 인기 시설 Top3
- 운동 종목 카테고리
- 필터 프리뷰

### 검색 결과 (`/search`)
- 필터바 (지역, 종목, 키워드)
- 추가 필터 (거리, 평점)
- 정렬 옵션
- 페이지네이션

### 시설 상세 (`/facility/:id`)
- 시설 기본 정보
- 네이버 지도
- 평점 및 리뷰
- 찜하기 버튼

### 커뮤니티 (`/community`)
- 게시글 목록
- 게시글 작성/수정
- 댓글 및 대댓글

### 마이페이지 (`/mypage`)
- 내 정보
- 찜한 시설
- 내 리뷰
- 내 게시글

## API 연동

백엔드 API와 통신하기 위한 설정:

```typescript
// src/config/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  FACILITIES: '/api/facilities',
  FAVORITE_FACILITIES: '/api/facilities/favorite',
  REVIEWS: '/api/reviews',
  POSTS: '/api/posts',
  // ...
};
```

## 주요 기능 상세

### 위치 기반 검색
- 브라우저 Geolocation API 사용
- 위치 권한 거부 시 거리 필터 비활성화
- Toast 메시지로 사용자 안내

### 찜하기
- 로그인 필요
- 실시간 찜 상태 업데이트
- 마이페이지에서 찜 목록 관리

### 리뷰 시스템
- 별점 (1-5점)
- 텍스트 리뷰
- 수정/삭제 기능
- 평균 평점 자동 계산

### 커뮤니티
- 마크다운 에디터
- 이미지 업로드
- 실시간 댓글
- 좋아요 기능

## 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

## 감사의 말

- [Naver Maps API](https://www.ncloud.com/product/applicationService/maps)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
