# 농막 관리 시스템 - 빠른 시작 가이드

이 가이드는 5-10분 안에 시스템을 실행하고 테스트할 수 있도록 도와드립니다.

## 준비물

- Node.js (v16+)
- MongoDB (v5+)
- 터미널 3개

---

## 1단계: MongoDB 실행 (1분)

**터미널 1:**
```bash
# macOS/Linux (Homebrew)
brew services start mongodb-community

# 또는 직접 실행
mongod

# Windows
net start MongoDB
```

**확인:**
```bash
mongosh
# 연결되면 성공 → exit로 나가기
```

---

## 2단계: Backend 실행 (2분)

**터미널 1:**
```bash
cd backend
npm install
cp .env.example .env
```

**.env 파일 확인:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/farm-shelter
JWT_SECRET=my_secret_key_12345
NODE_ENV=development
```

**서버 실행:**
```bash
npm run dev
```

**성공 메시지:**
```
MongoDB Connected: localhost
서버가 포트 5000에서 실행 중입니다
```

---

## 3단계: 관리자 계정 및 샘플 데이터 생성 (1분)

**새 터미널 2:**
```bash
cd backend

# 관리자 계정 생성
node scripts/createAdmin.js

# 샘플 농막 데이터 생성
node scripts/seedData.js
```

**출력:**
```
✓ 관리자 계정이 생성되었습니다!

로그인 정보:
  이메일: admin@example.com
  비밀번호: password123

✓ 5개의 샘플 농막 데이터 생성 완료
```

---

## 4단계: Admin Web 실행 (2분)

**새 터미널 3:**
```bash
cd admin-web
npm install
cp .env.example .env
npm start
```

브라우저가 자동으로 http://localhost:3000 으로 열립니다.

---

## 5단계: 로그인 및 테스트 (2분)

### 로그인
1. **이메일**: `admin@example.com`
2. **비밀번호**: `password123`
3. **로그인 버튼 클릭**

### 대시보드 확인
- 5개의 농막 카드가 표시됩니다
- 각 카드에 이름, 가격, 위치가 표시됩니다

### 농막 상세보기
1. 아무 농막 카드의 **"상세"** 버튼 클릭
2. 이미지 업로드 팝업 열림

### 농막 등록 테스트
1. 우측 상단 **"농막 등록"** 버튼 클릭
2. 최소 정보만 입력:
   - 이름: `테스트 농막`
   - 가격: `1000000`
   - 설명: `테스트용`
   - 주소: `서울시 강남구`
   - 도시: `서울`
   - 도/광역시: `서울특별시`
3. **"등록"** 버튼 클릭
4. 성공 메시지 확인

### 농막 수정 테스트
1. 방금 만든 농막의 **"수정"** 버튼 클릭
2. 가격을 `1500000`으로 변경
3. **"수정"** 버튼 클릭

### 농막 삭제 테스트
1. 테스트 농막의 **"삭제"** 버튼 클릭
2. 확인 대화상자에서 **"확인"** 클릭

---

## (선택) Mobile App 실행

### Android 에뮬레이터가 있는 경우:

**새 터미널:**
```bash
cd mobile-app
npm install

# API URL 수정 (중요!)
# src/services/api.js 파일 열기
# API_URL을 'http://10.0.2.2:5000/api'로 변경

# Metro 시작
npm start
```

**새 터미널:**
```bash
cd mobile-app
npx react-native run-android
```

---

## API 테스트 (선택)

자동 테스트 스크립트 실행:

```bash
cd backend
./scripts/testAPI.sh
```

또는 수동 테스트:

```bash
# 농막 목록 조회
curl http://localhost:5000/api/shelters | jq

# 로그인
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' | jq
```

---

## 문제 해결

### MongoDB 연결 오류
```bash
# MongoDB 상태 확인
brew services list | grep mongodb  # macOS
sudo systemctl status mongod       # Linux

# 재시작
brew services restart mongodb-community
```

### 포트 충돌
```bash
# 포트 5000 사용 프로세스 확인
lsof -i :5000

# 프로세스 종료
kill -9 [PID]
```

### npm 설치 오류
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

---

## 성공 체크리스트

- [ ] MongoDB 실행 중
- [ ] Backend 서버 실행 (포트 5000)
- [ ] 관리자 계정 생성됨
- [ ] 샘플 데이터 5개 생성됨
- [ ] Admin Web 실행 (포트 3000)
- [ ] 로그인 성공
- [ ] 농막 목록 표시됨
- [ ] 농막 등록/수정/삭제 테스트 성공

---

## 다음 단계

✅ 모든 체크리스트가 완료되었나요?

상세한 기능 테스트는 [TESTING_GUIDE.md](./TESTING_GUIDE.md)를 참고하세요.

시스템 설정 및 배포는 [SETUP.md](./SETUP.md)를 참고하세요.

API 문서는 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)를 참고하세요.

---

## 요약 명령어

```bash
# 터미널 1: MongoDB
mongod

# 터미널 2: Backend
cd backend && npm install && cp .env.example .env
npm run dev

# 터미널 3: 데이터 생성
cd backend
node scripts/createAdmin.js
node scripts/seedData.js

# 터미널 4: Admin Web
cd admin-web && npm install && cp .env.example .env
npm start
```

**로그인**: admin@example.com / password123

즐거운 테스트 되세요! 🎉
