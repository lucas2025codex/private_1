# 농막(Farm Shelter) 관리 시스템

농사지역에 설치 가능한 농막과 쉼터를 관리하는 통합 시스템입니다.

## 시스템 구성

### 1. Backend API Server
- **기술 스택**: Node.js, Express, MongoDB
- **기능**:
  - 농막 데이터 CRUD API
  - 이미지 업로드 처리
  - 검색 및 필터링 API
  - 사용자 인증 (관리자)

### 2. Admin Web (관리자용 웹 페이지)
- **기술 스택**: React, Axios, Material-UI
- **기능**:
  - 농막/쉼터 등록, 수정, 삭제
  - 이미지 업로드
  - 가격 정보 관리
  - 위치 정보 입력
  - YouTube URL 연결

### 3. Mobile App (사용자용 모바일 앱)
- **기술 스택**: React Native
- **기능**:
  - 농막 목록 조회
  - 상세 정보 보기
  - 검색 기능
  - 필터링 (가격, 위치, 등)
  - 개인화 설정

## 프로젝트 구조

```
.
├── backend/                 # Backend API Server
│   ├── src/
│   │   ├── models/         # MongoDB 모델
│   │   ├── routes/         # API 라우트
│   │   ├── controllers/    # 비즈니스 로직
│   │   ├── middleware/     # 미들웨어
│   │   └── config/         # 설정 파일
│   ├── uploads/            # 업로드된 이미지
│   └── package.json
│
├── admin-web/              # 관리자 웹 페이지
│   ├── src/
│   │   ├── components/    # React 컴포넌트
│   │   ├── pages/         # 페이지
│   │   ├── services/      # API 서비스
│   │   └── utils/         # 유틸리티
│   ├── public/
│   └── package.json
│
└── mobile-app/            # 모바일 앱
    ├── src/
    │   ├── components/    # React Native 컴포넌트
    │   ├── screens/       # 화면
    │   ├── services/      # API 서비스
    │   └── utils/         # 유틸리티
    ├── assets/
    └── package.json
```

## 설치 및 실행

### Backend
```bash
cd backend
npm install
npm run dev
```

### Admin Web
```bash
cd admin-web
npm install
npm start
```

### Mobile App
```bash
cd mobile-app
npm install
npx react-native run-android  # Android
npx react-native run-ios       # iOS
```

## 환경 변수 설정

각 프로젝트 폴더에 `.env` 파일을 생성하여 환경 변수를 설정하세요.

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/farm-shelter
JWT_SECRET=your_jwt_secret_key
```

### Admin Web (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Mobile App (.env)
```
API_URL=http://localhost:5000/api
```

## API 엔드포인트

- `GET /api/shelters` - 농막 목록 조회
- `GET /api/shelters/:id` - 농막 상세 조회
- `POST /api/shelters` - 농막 등록 (관리자)
- `PUT /api/shelters/:id` - 농막 수정 (관리자)
- `DELETE /api/shelters/:id` - 농막 삭제 (관리자)
- `POST /api/shelters/search` - 농막 검색 및 필터링

## 데이터 모델

### Shelter (농막)
- `name`: 이름
- `description`: 설명
- `price`: 가격
- `location`: 위치 (주소, 좌표)
- `images`: 이미지 URL 배열
- `youtubeUrl`: YouTube URL
- `features`: 특징/편의시설
- `createdAt`: 생성일
- `updatedAt`: 수정일

## 라이선스

MIT
