# 농막(Farm Shelter) 관리 시스템

농사지역에 설치 가능한 농막과 쉼터를 관리하는 통합 시스템입니다.

## 📚 문서 가이드

- **[빠른 시작 가이드](./QUICK_START.md)** - 5-10분 안에 시스템 실행하기
- **[상세 테스트 가이드](./TESTING_GUIDE.md)** - 단계별 테스트 방법
- **[설치 및 설정 가이드](./SETUP.md)** - 상세한 설치 방법
- **[API 문서](./API_DOCUMENTATION.md)** - 전체 API 엔드포인트
- **[테스트 체크리스트](./CHECKLIST.md)** - QA 체크리스트

## 🚀 빠른 시작

### 1. MongoDB 실행
```bash
mongod
```

### 2. Backend 실행
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 3. 관리자 계정 및 샘플 데이터 생성
```bash
cd backend
node scripts/createAdmin.js
node scripts/seedData.js
```

### 4. Admin Web 실행
```bash
cd admin-web
npm install
cp .env.example .env
npm start
```

### 5. 로그인
- URL: http://localhost:3000
- 이메일: `admin@example.com`
- 비밀번호: `password123`

더 자세한 내용은 **[빠른 시작 가이드](./QUICK_START.md)**를 참고하세요.

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

## 기능 특징

✨ **관리자 기능**
- 농막/쉼터 등록, 수정, 삭제
- 다중 이미지 업로드 (최대 10개, 5MB 제한)
- 가격, 위치, YouTube URL 관리
- 편의시설 태그 관리
- Material-UI 기반 반응형 디자인

✨ **사용자 기능 (Mobile)**
- 농막 목록 조회 및 상세 보기
- 고급 검색 및 필터링
  - 키워드 검색
  - 가격 범위 필터
  - 위치 필터
  - 다양한 정렬 옵션
- Pull-to-Refresh
- YouTube 동영상 연동

✨ **Backend API**
- RESTful API 설계
- JWT 인증/인가
- MongoDB 데이터베이스
- 이미지 업로드 처리
- 검색 및 필터링 최적화

## 설치 및 실행

상세한 설치 가이드는 **[SETUP.md](./SETUP.md)**를 참고하세요.

### 요구사항
- Node.js v16 이상
- MongoDB v5 이상
- npm 또는 yarn
- React Native CLI (모바일 앱 개발 시)

### Backend
```bash
cd backend
npm install
cp .env.example .env  # 환경 변수 설정
npm run dev
```

### Admin Web
```bash
cd admin-web
npm install
cp .env.example .env
npm start
```

### Mobile App
```bash
cd mobile-app
npm install
# src/services/api.js에서 API URL 수정 필요
npx react-native run-android  # Android
npx react-native run-ios       # iOS
```

## 유틸리티 스크립트

Backend 디렉토리에 유용한 스크립트가 포함되어 있습니다:

```bash
# 관리자 계정 생성
node scripts/createAdmin.js

# 샘플 데이터 생성 (5개 농막)
node scripts/seedData.js

# API 자동 테스트 (bash 스크립트)
./scripts/testAPI.sh
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
