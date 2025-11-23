# 농막 관리 시스템 - 상세 테스트 가이드

이 문서는 농막 관리 시스템의 전체 기능을 테스트하는 방법을 단계별로 설명합니다.

## 사전 준비

### 1. 필수 소프트웨어 확인

```bash
# Node.js 버전 확인 (v16 이상 필요)
node --version

# npm 버전 확인
npm --version

# MongoDB 버전 확인
mongod --version
```

### 2. MongoDB 실행

**macOS/Linux:**
```bash
# Homebrew로 설치한 경우
brew services start mongodb-community

# 또는 직접 실행
mongod --dbpath ~/data/db
```

**Windows:**
```bash
# MongoDB 서비스 시작
net start MongoDB

# 또는 직접 실행
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="C:\data\db"
```

**확인:**
```bash
# 새 터미널에서
mongosh
# 성공하면 MongoDB가 실행 중입니다
```

---

## STEP 1: Backend API 서버 실행

### 1.1 Backend 디렉토리로 이동 및 패키지 설치

```bash
cd backend
npm install
```

예상 출력:
```
added 150 packages, and audited 151 packages in 15s
```

### 1.2 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env
```

`.env` 파일을 열어 다음과 같이 수정:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/farm-shelter
JWT_SECRET=my_super_secret_key_12345_change_in_production
NODE_ENV=development
```

### 1.3 서버 실행

```bash
npm run dev
```

**성공 시 출력:**
```
> farm-shelter-backend@1.0.0 dev
> nodemon src/server.js

[nodemon] 3.0.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node src/server.js`
MongoDB Connected: localhost
서버가 포트 5000에서 실행 중입니다
환경: development
```

### 1.4 API 테스트

새 터미널을 열어 다음 명령어 실행:
```bash
curl http://localhost:5000
```

**예상 응답:**
```json
{
  "message": "농막 관리 시스템 API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "shelters": "/api/shelters"
  }
}
```

✅ **Backend 서버가 정상적으로 실행되었습니다!**

---

## STEP 2: 관리자 계정 생성

### 2.1 회원가입 API 호출

새 터미널에서:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**예상 응답:**
```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "username": "admin",
    "email": "admin@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2.2 관리자 권한 부여

MongoDB에 접속하여 role을 변경:

```bash
# MongoDB Shell 실행
mongosh

# 명령어 입력
use farm-shelter
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

**예상 출력:**
```
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```

확인:
```bash
db.users.findOne({ email: "admin@example.com" })
```

**role이 "admin"으로 변경되었는지 확인:**
```json
{
  "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0k1"),
  "username": "admin",
  "email": "admin@example.com",
  "role": "admin",
  ...
}
```

MongoDB Shell 종료:
```bash
exit
```

✅ **관리자 계정이 생성되었습니다!**

---

## STEP 3: Admin Web 실행

### 3.1 Admin Web 디렉토리로 이동

새 터미널을 열어:
```bash
cd admin-web
npm install
```

### 3.2 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일 내용 확인:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3.3 Admin Web 실행

```bash
npm start
```

**성공 시 출력:**
```
Compiled successfully!

You can now view farm-shelter-admin in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

브라우저가 자동으로 열리거나 http://localhost:3000 으로 접속

✅ **Admin Web이 실행되었습니다!**

---

## STEP 4: Admin Web 로그인 테스트

### 4.1 로그인 페이지 확인

브라우저에서 http://localhost:3000 접속 시 로그인 페이지가 표시됩니다.

**화면 구성:**
- 제목: "농막 관리 시스템"
- 부제목: "관리자 로그인"
- 이메일 입력 필드
- 비밀번호 입력 필드
- 로그인 버튼

### 4.2 로그인 실행

다음 정보를 입력:
- **이메일**: `admin@example.com`
- **비밀번호**: `password123`

**"로그인" 버튼 클릭**

### 4.3 로그인 성공 확인

**성공 시:**
- URL이 `/dashboard`로 변경됩니다
- 대시보드 페이지가 표시됩니다
- 상단에 "농막 관리 시스템" 헤더와 "로그아웃" 버튼이 보입니다
- "농막 등록" 버튼이 표시됩니다

**실패 시:**
- 빨간색 경고 메시지가 표시됩니다
- 이메일과 비밀번호를 다시 확인하세요

✅ **로그인 성공!**

---

## STEP 5: 농막 등록 테스트

### 5.1 농막 등록 버튼 클릭

대시보드에서 우측 상단의 **"농막 등록"** 버튼 클릭

팝업 창이 열립니다.

### 5.2 농막 정보 입력

**기본 정보:**
- **농막 이름**: `편안한 농막`
- **가격 (원)**: `1500000`
- **설명**:
  ```
  경기도 양평에 위치한 넓고 편안한 농막입니다.
  가족 단위 방문객에게 적합하며, 주변에 계곡과 산책로가 있습니다.
  ```

**위치 정보:**
- **주소**: `경기도 양평군 양평읍 양평대교길 123`
- **도시**: `양평`
- **도/광역시**: `경기도`
- **위도 (선택)**: `37.4913`
- **경도 (선택)**: `127.4872`

**YouTube URL (선택):**
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**크기 (선택)**: `20평`

**수용 인원 (선택)**: `4`

**편의시설/특징:**
- 텍스트 필드에 `화장실` 입력 후 **"추가"** 버튼 클릭
- 텍스트 필드에 `주방시설` 입력 후 **"추가"** 버튼 클릭
- 텍스트 필드에 `에어컨` 입력 후 **"추가"** 버튼 클릭
- 텍스트 필드에 `냉장고` 입력 후 **"추가"** 버튼 클릭
- 텍스트 필드에 `TV` 입력 후 **"추가"** 버튼 클릭

### 5.3 등록 완료

하단의 **"등록"** 버튼 클릭

**성공 시:**
- 팝업이 닫힙니다
- 우측 하단에 "농막이 등록되었습니다" 토스트 메시지가 표시됩니다
- 대시보드에 방금 등록한 농막 카드가 표시됩니다

### 5.4 등록된 농막 확인

농막 카드에서 다음 정보를 확인:
- 이미지 영역 (회색, "이미지 없음" 표시)
- 농막 이름: "편안한 농막"
- 가격: "1,500,000원"
- 위치: "양평, 경기도"
- 상태: 녹색 "이용 가능" 뱃지
- YouTube 빨간색 뱃지

✅ **농막이 성공적으로 등록되었습니다!**

---

## STEP 6: 추가 농막 등록 (테스트 데이터)

다음 농막들을 추가로 등록하여 테스트 데이터를 만듭니다:

### 6.1 농막 2: 산속 쉼터

- **이름**: `산속 쉼터`
- **가격**: `2000000`
- **설명**: `강원도 홍천의 깊은 산속에 위치한 조용한 쉼터입니다. 완벽한 휴식과 힐링을 제공합니다.`
- **주소**: `강원도 홍천군 내면 광원리 산 123`
- **도시**: `홍천`
- **도/광역시**: `강원도`
- **특징**: `화장실`, `주방시설`, `난방`, `바베큐시설`

### 6.2 농막 3: 바다 전망 농막

- **이름**: `바다 전망 농막`
- **가격**: `3000000`
- **설명**: `남해 바다가 한눈에 보이는 멋진 전망의 농막입니다.`
- **주소**: `경상남도 남해군 남해읍 해안로 456`
- **도시**: `남해`
- **도/광역시**: `경상남도`
- **크기**: `30평`
- **수용 인원**: `6`
- **특징**: `화장실`, `주방시설`, `에어컨`, `전망대`, `주차장`

### 6.3 농막 4: 작은 농막

- **이름**: `작은 농막`
- **가격**: `800000`
- **설명**: `소규모 가족이나 커플에게 적합한 아담한 농막입니다.`
- **주소**: `충청남도 공주시 반포면 온천로 78`
- **도시**: `공주`
- **도/광역시**: `충청남도`
- **크기**: `10평`
- **수용 인원**: `2`
- **특징**: `화장실`, `간이주방`

✅ **테스트 데이터가 준비되었습니다!**

---

## STEP 7: 이미지 업로드 테스트

### 7.1 테스트 이미지 준비

테스트용 이미지를 다운로드하거나 본인의 이미지를 준비합니다.

**온라인 무료 이미지 사이트:**
- https://unsplash.com (검색: "cabin", "shelter", "small house")
- https://pexels.com (검색: "wooden cabin")

또는 임시 이미지:
```bash
# 터미널에서 테스트 이미지 생성 (ImageMagick 필요)
convert -size 800x600 xc:green test-image-1.jpg
convert -size 800x600 xc:blue test-image-2.jpg
```

### 7.2 이미지 업로드

1. 대시보드에서 "편안한 농막" 카드의 **"상세"** 버튼 클릭
2. 이미지 업로드 팝업이 열립니다
3. **"파일 선택"** 버튼 클릭
4. 준비한 이미지 파일 1-3개 선택
5. "선택된 파일: 3개" 확인
6. **"업로드"** 버튼 클릭

**성공 시:**
- "이미지가 업로드되었습니다" 메시지 표시
- 팝업이 닫힙니다
- 농막 카드가 새로고침되어 업로드된 이미지가 표시됩니다

### 7.3 업로드된 이미지 확인

- 농막 카드에 첫 번째 이미지가 표시됩니다
- 회색 "이미지 없음" 대신 실제 이미지가 보입니다

✅ **이미지 업로드 성공!**

---

## STEP 8: 농막 수정 테스트

### 8.1 수정 버튼 클릭

"편안한 농막" 카드에서 **"수정"** 버튼 클릭

### 8.2 정보 수정

- **가격** 변경: `1500000` → `1800000`
- **특징** 추가: `WiFi` 추가

### 8.3 저장

**"수정"** 버튼 클릭

**성공 시:**
- "농막이 수정되었습니다" 메시지
- 카드의 가격이 "1,800,000원"으로 변경됨

✅ **수정 성공!**

---

## STEP 9: Mobile App 실행

### 9.1 사전 준비 (Android)

**Android Studio 설치 확인:**
```bash
# Android SDK 경로 확인
echo $ANDROID_HOME
# 출력: /Users/username/Library/Android/sdk (macOS)
```

**에뮬레이터 또는 실제 디바이스 준비**

### 9.2 Mobile App 디렉토리로 이동

새 터미널:
```bash
cd mobile-app
npm install
```

### 9.3 API URL 수정

**중요!** `src/services/api.js` 파일을 열어 API_URL을 수정:

```javascript
// localhost는 에뮬레이터에서 작동하지 않습니다
// 실제 컴퓨터의 IP 주소를 사용하세요

// Android 에뮬레이터용:
const API_URL = 'http://10.0.2.2:5000/api';

// 또는 실제 IP 주소 사용 (같은 네트워크):
// const API_URL = 'http://192.168.x.x:5000/api';
```

IP 주소 확인:
```bash
# macOS/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

### 9.4 Metro 실행

```bash
npm start
```

### 9.5 Android 앱 실행

새 터미널에서:
```bash
cd mobile-app
npx react-native run-android
```

**에뮬레이터 또는 실제 디바이스에서 앱이 실행됩니다**

---

## STEP 10: Mobile App 테스트

### 10.1 홈 화면 확인

앱 실행 시 "홈" 탭이 표시됩니다.

**확인 사항:**
- 등록한 4개의 농막 카드가 표시됨
- 각 카드에 이미지, 이름, 가격, 위치가 표시됨
- "이용 가능" 녹색 뱃지 표시

### 10.2 상세 화면 테스트

1. "편안한 농막" 카드 탭
2. 상세 화면이 열립니다

**확인 사항:**
- 이미지 슬라이드 (좌우 스와이프)
- 이름: "편안한 농막"
- 가격: "1,800,000원"
- 위치 정보 표시
- 설명 표시
- 크기: "20평"
- 수용 인원: "4명"
- 편의시설 목록 (화장실, 주방시설, 에어컨, 냉장고, TV, WiFi)
- "YouTube에서 보기" 버튼 (빨간색)

### 10.3 YouTube 버튼 테스트

**"YouTube에서 보기"** 버튼 탭

- YouTube 앱 또는 브라우저가 열립니다
- 등록한 YouTube URL로 이동합니다

### 10.4 검색 기능 테스트

하단 탭에서 **"검색"** 탭 선택

#### 테스트 1: 키워드 검색
- **키워드**: `바다` 입력
- **"검색"** 버튼 탭
- 결과: "바다 전망 농막" 1개 표시

#### 테스트 2: 가격 필터
- **최소 가격**: `1000000`
- **최대 가격**: `2500000`
- **"검색"** 버튼 탭
- 결과: "편안한 농막", "산속 쉼터" 표시

#### 테스트 3: 위치 필터
- **도시**: `양평`
- **도/광역시**: `경기도`
- **"검색"** 버튼 탭
- 결과: "편안한 농막" 1개 표시

#### 테스트 4: 정렬
- 필터 초기화 (모든 필드 비우기)
- **정렬**: "가격 낮은순" 선택 (초록색으로 변경됨)
- **"검색"** 버튼 탭
- 결과: 가격순으로 정렬됨 (작은 농막 → 편안한 농막 → 산속 쉼터 → 바다 전망 농막)

#### 테스트 5: 복합 검색
- **키워드**: `농막`
- **최소 가격**: `1000000`
- **도/광역시**: `경기도`
- **정렬**: "가격 높은순"
- **"검색"** 버튼 탭

### 10.5 Pull-to-Refresh 테스트

홈 탭으로 돌아가서:
1. 화면을 아래로 당기기 (Pull down)
2. 로딩 인디케이터 표시
3. 데이터 새로고침

✅ **Mobile App 테스트 완료!**

---

## STEP 11: 삭제 기능 테스트

### 11.1 Admin Web으로 돌아가기

브라우저에서 http://localhost:3000/dashboard

### 11.2 농막 삭제

1. "작은 농막" 카드의 **"삭제"** 버튼 클릭
2. 확인 대화상자: "정말 삭제하시겠습니까?"
3. **"확인"** 클릭

**성공 시:**
- "농막이 삭제되었습니다" 메시지
- "작은 농막" 카드가 목록에서 사라집니다

### 11.3 Mobile App에서 확인

모바일 앱으로 돌아가서:
1. Pull-to-Refresh 실행
2. "작은 농막"이 목록에서 제거된 것 확인

✅ **삭제 기능 작동 확인!**

---

## STEP 12: 로그아웃 테스트

### 12.1 Admin Web 로그아웃

우측 상단의 **"로그아웃"** 버튼 클릭

**확인 사항:**
- 로그인 페이지로 리다이렉트됩니다
- localStorage에서 토큰이 제거됩니다

### 12.2 보안 확인

로그아웃 후 URL에 직접 `/dashboard` 입력:
```
http://localhost:3000/dashboard
```

- 자동으로 `/login`으로 리다이렉트되어야 합니다 ✅

---

## 문제 해결 (Troubleshooting)

### Backend 서버가 시작되지 않는 경우

**증상**: MongoDB 연결 오류
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**해결책**:
```bash
# MongoDB 실행 확인
mongosh

# MongoDB 재시작
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod  # Linux
```

### Admin Web 로그인 실패

**증상**: "이메일 또는 비밀번호가 올바르지 않습니다"

**해결책**:
```bash
# 사용자 확인
mongosh
use farm-shelter
db.users.find({ email: "admin@example.com" })

# role 확인 및 수정
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### 이미지가 표시되지 않는 경우

**증상**: Mobile App에서 이미지가 깨짐

**해결책**:
1. Backend의 `uploads` 폴더 권한 확인
2. API URL이 올바른지 확인 (localhost가 아닌 실제 IP)
3. 이미지 URL 확인:
   ```javascript
   // HomeScreen.js
   source={{ uri: `http://YOUR_IP:5000${item.images[0].url}` }}
   ```

### Mobile App 빌드 오류

**증상**: "SDK location not found"

**해결책**:
```bash
# Android SDK 경로 설정
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 환경 확인
npx react-native doctor
```

---

## 성공 체크리스트

테스트가 성공적으로 완료되었는지 확인:

- [ ] MongoDB가 실행 중
- [ ] Backend API 서버가 http://localhost:5000에서 실행 중
- [ ] 관리자 계정 생성 및 role이 "admin"으로 설정됨
- [ ] Admin Web이 http://localhost:3000에서 실행 중
- [ ] Admin Web 로그인 성공
- [ ] 농막 등록 성공 (최소 3개)
- [ ] 이미지 업로드 성공
- [ ] 농막 수정 성공
- [ ] 농막 삭제 성공
- [ ] Mobile App 실행 성공
- [ ] Mobile App에서 농막 목록 조회 성공
- [ ] Mobile App에서 상세 정보 조회 성공
- [ ] Mobile App에서 검색/필터링 성공
- [ ] YouTube 링크 작동 확인
- [ ] Pull-to-Refresh 작동 확인
- [ ] 로그아웃 및 보안 확인

---

## 다음 단계

모든 테스트가 성공했다면:

1. **프로덕션 배포 준비**
   - 환경 변수 보안 강화
   - HTTPS 설정
   - 클라우드 MongoDB 연결

2. **추가 기능 개발**
   - 사용자 즐겨찾기
   - 리뷰 시스템
   - 예약 기능
   - 지도 통합

3. **성능 최적화**
   - 이미지 최적화
   - 캐싱 전략
   - 페이지네이션 개선

축하합니다! 🎉 농막 관리 시스템이 정상적으로 작동합니다!
