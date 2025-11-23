# 농막 관리 시스템 - API 문서

Base URL: `http://localhost:5000/api`

## 인증

대부분의 관리자 전용 엔드포인트는 JWT 토큰 인증이 필요합니다.

요청 헤더에 토큰 포함:
```
Authorization: Bearer <your_jwt_token>
```

---

## 인증 (Authentication)

### 회원가입
```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 로그인
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "로그인에 성공했습니다",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 프로필 조회
```http
GET /auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "admin",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 농막 (Shelters)

### 농막 목록 조회
```http
GET /shelters?page=1&limit=10
```

**Query Parameters:**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 10)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "편안한 농막",
      "description": "넓고 편안한 농막입니다",
      "price": 1500000,
      "location": {
        "address": "경기도 양평군 양평읍 123",
        "city": "양평",
        "province": "경기도",
        "coordinates": {
          "latitude": 37.491,
          "longitude": 127.487
        }
      },
      "images": [
        {
          "url": "/uploads/image-1234567890.jpg",
          "alt": "농막 외부"
        }
      ],
      "youtubeUrl": "https://www.youtube.com/watch?v=example",
      "features": ["화장실", "주방", "에어컨"],
      "size": "20평",
      "capacity": 4,
      "status": "available",
      "rating": 4.5,
      "views": 120,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 농막 상세 조회
```http
GET /shelters/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "편안한 농막",
    "description": "넓고 편안한 농막입니다",
    "price": 1500000,
    "location": {
      "address": "경기도 양평군 양평읍 123",
      "city": "양평",
      "province": "경기도",
      "coordinates": {
        "latitude": 37.491,
        "longitude": 127.487
      }
    },
    "images": [...],
    "youtubeUrl": "https://www.youtube.com/watch?v=example",
    "features": ["화장실", "주방", "에어컨"],
    "size": "20평",
    "capacity": 4,
    "status": "available",
    "rating": 4.5,
    "views": 121,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 농막 등록 (관리자 전용)
```http
POST /shelters
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "편안한 농막",
  "description": "넓고 편안한 농막입니다",
  "price": 1500000,
  "location": {
    "address": "경기도 양평군 양평읍 123",
    "city": "양평",
    "province": "경기도",
    "coordinates": {
      "latitude": 37.491,
      "longitude": 127.487
    }
  },
  "youtubeUrl": "https://www.youtube.com/watch?v=example",
  "features": ["화장실", "주방", "에어컨"],
  "size": "20평",
  "capacity": 4
}
```

**Response:**
```json
{
  "success": true,
  "message": "농막이 성공적으로 등록되었습니다",
  "data": { ... }
}
```

### 농막 수정 (관리자 전용)
```http
PUT /shelters/:id
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "수정된 농막 이름",
  "price": 1800000,
  "status": "reserved"
}
```

**Response:**
```json
{
  "success": true,
  "message": "농막이 성공적으로 수정되었습니다",
  "data": { ... }
}
```

### 농막 삭제 (관리자 전용)
```http
DELETE /shelters/:id
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "농막이 성공적으로 삭제되었습니다",
  "data": {}
}
```

### 농막 검색 및 필터링
```http
POST /shelters/search
```

**Request Body:**
```json
{
  "keyword": "편안한",
  "minPrice": 1000000,
  "maxPrice": 2000000,
  "city": "양평",
  "province": "경기도",
  "status": "available",
  "features": ["화장실", "주방"],
  "sortBy": "price_asc",
  "page": 1,
  "limit": 10
}
```

**Sort Options:**
- `latest`: 최신순 (기본값)
- `price_asc`: 가격 낮은순
- `price_desc`: 가격 높은순
- `rating`: 평점순
- `views`: 조회수순

**Response:**
```json
{
  "success": true,
  "count": 5,
  "total": 5,
  "page": 1,
  "pages": 1,
  "data": [ ... ]
}
```

### 이미지 업로드 (관리자 전용)
```http
POST /shelters/:id/images
```

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `images`: 이미지 파일들 (최대 10개)
- `alt` (optional): 이미지 설명

**Response:**
```json
{
  "success": true,
  "message": "이미지가 성공적으로 업로드되었습니다",
  "data": { ... }
}
```

---

## 에러 응답

모든 에러는 다음 형식으로 반환됩니다:

```json
{
  "success": false,
  "message": "에러 메시지",
  "error": "상세 에러 정보 (개발 환경에서만)"
}
```

### 일반적인 HTTP 상태 코드

- `200 OK`: 성공
- `201 Created`: 리소스 생성 성공
- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 리소스를 찾을 수 없음
- `500 Internal Server Error`: 서버 오류

---

## 데이터 유효성 검사

### 농막 등록/수정 시 필수 필드

- `name`: 문자열, 최대 100자
- `description`: 문자열, 최대 2000자
- `price`: 숫자, 0 이상
- `location.address`: 문자열, 필수
- `location.city`: 문자열, 필수
- `location.province`: 문자열, 필수

### 선택 필드

- `location.coordinates.latitude`: 숫자
- `location.coordinates.longitude`: 숫자
- `youtubeUrl`: YouTube URL 형식
- `features`: 문자열 배열
- `size`: 문자열
- `capacity`: 숫자, 1 이상
- `status`: "available", "reserved", "unavailable" 중 하나

---

## 예제 사용법

### cURL 예제

```bash
# 로그인
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# 농막 목록 조회
curl http://localhost:5000/api/shelters?page=1&limit=10

# 농막 등록 (관리자)
curl -X POST http://localhost:5000/api/shelters \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "테스트 농막",
    "description": "테스트용 농막입니다",
    "price": 1500000,
    "location": {
      "address": "서울시 강남구",
      "city": "서울",
      "province": "서울특별시"
    }
  }'

# 검색
curl -X POST http://localhost:5000/api/shelters/search \
  -H "Content-Type: application/json" \
  -d '{
    "keyword": "편안한",
    "minPrice": 1000000,
    "maxPrice": 2000000,
    "sortBy": "price_asc"
  }'
```

### JavaScript (Axios) 예제

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// 로그인
const login = async () => {
  const response = await api.post('/auth/login', {
    email: 'admin@example.com',
    password: 'password123',
  });
  return response.data.data.token;
};

// 농막 목록 조회
const getShelters = async () => {
  const response = await api.get('/shelters?page=1&limit=10');
  return response.data.data;
};

// 농막 등록 (관리자)
const createShelter = async (token, shelterData) => {
  const response = await api.post('/shelters', shelterData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
```
