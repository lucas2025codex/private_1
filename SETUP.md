# 농막 관리 시스템 - 설치 및 설정 가이드

## 사전 요구사항

- Node.js (v16 이상)
- MongoDB (v5 이상)
- npm 또는 yarn
- React Native CLI (모바일 앱 개발시)

## 1. MongoDB 설치 및 실행

### macOS (Homebrew 사용)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Ubuntu/Debian
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Windows
MongoDB 공식 웹사이트에서 설치 프로그램 다운로드:
https://www.mongodb.com/try/download/community

## 2. Backend API 설정

```bash
cd backend
npm install
```

### 환경 변수 설정
```bash
cp .env.example .env
```

`.env` 파일을 열어 다음 값을 설정:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/farm-shelter
JWT_SECRET=your_secret_key_here_change_this
NODE_ENV=development
```

### Backend 실행
```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

서버가 http://localhost:5000 에서 실행됩니다.

### 관리자 계정 생성

서버 실행 후, 다음 curl 명령어로 관리자 계정을 생성:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "password123"
  }'
```

생성된 계정의 role을 admin으로 변경 (MongoDB에서):
```bash
mongosh
use farm-shelter
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## 3. Admin Web 설정

```bash
cd admin-web
npm install
```

### 환경 변수 설정
```bash
cp .env.example .env
```

`.env` 파일을 열어 다음 값을 설정:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Admin Web 실행
```bash
npm start
```

브라우저에서 http://localhost:3000 으로 접속

### 로그인
- 이메일: admin@example.com
- 비밀번호: password123

## 4. Mobile App 설정

```bash
cd mobile-app
npm install
```

### 환경 설정
`src/services/api.js` 파일에서 API_URL을 실제 개발 서버 IP로 변경:
```javascript
const API_URL = 'http://YOUR_COMPUTER_IP:5000/api';
```

### Android 실행
```bash
# Android 에뮬레이터 또는 실제 기기 연결 후
npx react-native run-android
```

### iOS 실행 (macOS만 가능)
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

## 5. 시스템 테스트

### 1. Admin Web에서 농막 등록
1. http://localhost:3000 접속
2. 관리자 계정으로 로그인
3. "농막 등록" 버튼 클릭
4. 농막 정보 입력:
   - 이름: 테스트 농막
   - 가격: 1000000
   - 설명: 테스트용 농막입니다
   - 주소: 서울시 강남구
   - 도시: 서울
   - 도/광역시: 서울특별시
   - YouTube URL (선택): https://www.youtube.com/watch?v=...
5. 특징 추가: 화장실, 주방, 에어컨 등
6. "등록" 버튼 클릭

### 2. 이미지 업로드
1. 등록된 농막 카드에서 "상세" 버튼 클릭
2. 이미지 파일 선택 (최대 10개)
3. "업로드" 버튼 클릭

### 3. Mobile App에서 조회
1. 모바일 앱 실행
2. 홈 화면에서 등록된 농막 목록 확인
3. 농막 카드 탭하여 상세 정보 확인
4. "검색" 탭에서 필터링 테스트:
   - 키워드 검색
   - 가격 범위 설정
   - 도시/지역 필터링
   - 정렬 옵션 변경

## 트러블슈팅

### MongoDB 연결 오류
- MongoDB가 실행 중인지 확인: `mongosh` 또는 `mongo` 명령어로 연결 테스트
- 포트 충돌 확인: MongoDB 기본 포트는 27017

### CORS 오류
- Backend의 CORS 설정이 올바른지 확인
- Admin Web과 Mobile App의 API URL이 정확한지 확인

### React Native 빌드 오류
- `npx react-native doctor` 명령어로 환경 확인
- Android SDK, Xcode 설치 확인
- `node_modules` 삭제 후 재설치: `rm -rf node_modules && npm install`

### 이미지 업로드 실패
- `backend/uploads` 폴더 권한 확인
- 파일 크기 제한 확인 (기본 5MB)
- 지원되는 이미지 형식: jpeg, jpg, png, gif, webp

## 프로덕션 배포

### Backend
1. MongoDB Atlas 또는 클라우드 MongoDB 서비스 사용
2. 환경 변수 설정 (NODE_ENV=production)
3. PM2 또는 Docker를 사용한 프로세스 관리
4. NGINX를 리버스 프록시로 설정
5. SSL 인증서 설정 (Let's Encrypt)

### Admin Web
```bash
cd admin-web
npm run build
```
생성된 `build` 폴더를 정적 파일 호스팅 서비스에 배포

### Mobile App
- Android: Google Play Console에 APK/AAB 업로드
- iOS: App Store Connect에 앱 제출

## 추가 자원

- [Node.js 공식 문서](https://nodejs.org/)
- [MongoDB 공식 문서](https://docs.mongodb.com/)
- [React 공식 문서](https://react.dev/)
- [React Native 공식 문서](https://reactnative.dev/)
