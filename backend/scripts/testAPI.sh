#!/bin/bash

# 농막 관리 시스템 API 테스트 스크립트

BASE_URL="http://localhost:5000/api"
TOKEN=""

echo "================================"
echo "농막 관리 시스템 API 테스트"
echo "================================"
echo ""

# 색상 정의
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 서버 상태 확인
echo "1. 서버 상태 확인..."
response=$(curl -s http://localhost:5000)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 서버가 실행 중입니다${NC}"
    echo "$response" | jq .
else
    echo -e "${RED}✗ 서버에 연결할 수 없습니다${NC}"
    exit 1
fi
echo ""

# 2. 회원가입
echo "2. 회원가입 테스트..."
response=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123456"
  }')

if echo "$response" | jq -e '.success' > /dev/null; then
    echo -e "${GREEN}✓ 회원가입 성공${NC}"
    echo "$response" | jq .
else
    echo -e "${YELLOW}⚠ 회원가입 실패 (이미 존재하는 계정일 수 있습니다)${NC}"
fi
echo ""

# 3. 로그인
echo "3. 로그인 테스트..."
response=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }')

if echo "$response" | jq -e '.success' > /dev/null; then
    TOKEN=$(echo "$response" | jq -r '.data.token')
    echo -e "${GREEN}✓ 로그인 성공${NC}"
    echo "토큰: ${TOKEN:0:50}..."
else
    echo -e "${RED}✗ 로그인 실패${NC}"
    echo "$response" | jq .
    exit 1
fi
echo ""

# 4. 농막 목록 조회
echo "4. 농막 목록 조회..."
response=$(curl -s $BASE_URL/shelters?page=1&limit=10)
if echo "$response" | jq -e '.success' > /dev/null; then
    count=$(echo "$response" | jq -r '.count')
    total=$(echo "$response" | jq -r '.total')
    echo -e "${GREEN}✓ 농막 목록 조회 성공${NC}"
    echo "총 ${total}개 중 ${count}개 조회"
    echo "$response" | jq '.data[] | {name: .name, price: .price, city: .location.city}'
else
    echo -e "${RED}✗ 농막 목록 조회 실패${NC}"
fi
echo ""

# 5. 농막 등록 (관리자)
echo "5. 농막 등록 테스트..."
response=$(curl -s -X POST $BASE_URL/shelters \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "테스트 농막",
    "description": "API 테스트를 위한 농막입니다",
    "price": 1200000,
    "location": {
      "address": "서울시 강남구 테스트로 123",
      "city": "서울",
      "province": "서울특별시"
    },
    "features": ["화장실", "주방"],
    "size": "15평",
    "capacity": 3
  }')

if echo "$response" | jq -e '.success' > /dev/null; then
    SHELTER_ID=$(echo "$response" | jq -r '.data._id')
    echo -e "${GREEN}✓ 농막 등록 성공${NC}"
    echo "농막 ID: $SHELTER_ID"
else
    echo -e "${RED}✗ 농막 등록 실패${NC}"
    echo "$response" | jq .
fi
echo ""

# 6. 농막 상세 조회
if [ -n "$SHELTER_ID" ]; then
    echo "6. 농막 상세 조회..."
    response=$(curl -s $BASE_URL/shelters/$SHELTER_ID)
    if echo "$response" | jq -e '.success' > /dev/null; then
        echo -e "${GREEN}✓ 농막 상세 조회 성공${NC}"
        echo "$response" | jq '.data | {name: .name, price: .price, views: .views}'
    else
        echo -e "${RED}✗ 농막 상세 조회 실패${NC}"
    fi
    echo ""
fi

# 7. 농막 검색
echo "7. 농막 검색 테스트..."
response=$(curl -s -X POST $BASE_URL/shelters/search \
  -H "Content-Type: application/json" \
  -d '{
    "minPrice": 1000000,
    "maxPrice": 2000000,
    "sortBy": "price_asc"
  }')

if echo "$response" | jq -e '.success' > /dev/null; then
    count=$(echo "$response" | jq -r '.count')
    echo -e "${GREEN}✓ 농막 검색 성공${NC}"
    echo "검색 결과: ${count}개"
    echo "$response" | jq '.data[] | {name: .name, price: .price}'
else
    echo -e "${RED}✗ 농막 검색 실패${NC}"
fi
echo ""

# 8. 농막 수정
if [ -n "$SHELTER_ID" ]; then
    echo "8. 농막 수정 테스트..."
    response=$(curl -s -X PUT $BASE_URL/shelters/$SHELTER_ID \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "price": 1500000,
        "status": "reserved"
      }')

    if echo "$response" | jq -e '.success' > /dev/null; then
        echo -e "${GREEN}✓ 농막 수정 성공${NC}"
        echo "$response" | jq '.data | {name: .name, price: .price, status: .status}'
    else
        echo -e "${RED}✗ 농막 수정 실패${NC}"
    fi
    echo ""
fi

# 9. 농막 삭제
if [ -n "$SHELTER_ID" ]; then
    echo "9. 농막 삭제 테스트..."
    response=$(curl -s -X DELETE $BASE_URL/shelters/$SHELTER_ID \
      -H "Authorization: Bearer $TOKEN")

    if echo "$response" | jq -e '.success' > /dev/null; then
        echo -e "${GREEN}✓ 농막 삭제 성공${NC}"
    else
        echo -e "${RED}✗ 농막 삭제 실패${NC}"
    fi
    echo ""
fi

echo "================================"
echo "테스트 완료"
echo "================================"
