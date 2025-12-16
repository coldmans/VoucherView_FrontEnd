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

## 사용하는 개발환경

### **Frontend**

- **언어**: TypeScript
- **프레임워크**: React 18.3.1
- **빌드 도구**: Vite 6.3.5
- **스타일링**: Tailwind CSS 4.1.17

### **기타 주요 라이브러리**

- React Router 7.1.1 (라우팅)
- Radix UI (접근성 있는 UI 컴포넌트)
- Lucide React (아이콘)
- Axios (HTTP 클라이언트)
- Naver Maps API (지도 서비스)
- SWC (빠른 컴파일)
- PostCSS (CSS 처리)
- Docker (컨테이너화)


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





