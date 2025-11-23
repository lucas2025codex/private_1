#!/bin/bash

# 농막 관리 시스템 자동 실행 스크립트
# 이 스크립트는 Backend와 관리자 계정을 자동으로 설정합니다.

echo "================================"
echo "농막 관리 시스템 자동 실행 스크립트"
echo "================================"
echo ""

# 색상 정의
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# MongoDB 확인
echo "1. MongoDB 연결 확인..."
if mongosh --eval "db.version()" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ MongoDB가 실행 중입니다${NC}"
else
    echo -e "${RED}✗ MongoDB가 실행되지 않았습니다${NC}"
    echo "MongoDB를 먼저 실행하세요:"
    echo "  macOS: brew services start mongodb-community"
    echo "  Linux: sudo systemctl start mongod"
    echo "  또는: mongod"
    exit 1
fi
echo ""

# Backend 설정
echo "2. Backend 설정..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "   npm 패키지 설치 중..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "   .env 파일 생성 중..."
    cp .env.example .env
    echo -e "${YELLOW}⚠  .env 파일이 생성되었습니다. 필요시 수정하세요.${NC}"
fi

echo -e "${GREEN}✓ Backend 설정 완료${NC}"
echo ""

# 관리자 계정 생성
echo "3. 관리자 계정 생성..."
node scripts/createAdmin.js
echo ""

# 샘플 데이터 생성
echo "4. 샘플 데이터 생성..."
echo "샘플 데이터를 생성하시겠습니까? (y/n)"
read -p "> " create_sample

if [ "$create_sample" = "y" ] || [ "$create_sample" = "Y" ]; then
    node scripts/seedData.js
    echo ""
else
    echo "샘플 데이터 생성을 건너뜁니다."
    echo ""
fi

# Admin Web 설정 확인
cd ../admin-web
echo "5. Admin Web 설정..."

if [ ! -d "node_modules" ]; then
    echo "   npm 패키지 설치 중..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "   .env 파일 생성 중..."
    cp .env.example .env
fi

echo -e "${GREEN}✓ Admin Web 설정 완료${NC}"
echo ""

# 실행 안내
echo "================================"
echo "설정이 완료되었습니다!"
echo "================================"
echo ""
echo "이제 다음 명령어로 시스템을 실행하세요:"
echo ""
echo "터미널 1 - Backend 실행:"
echo "  cd backend && npm run dev"
echo ""
echo "터미널 2 - Admin Web 실행:"
echo "  cd admin-web && npm start"
echo ""
echo "로그인 정보:"
echo "  URL: http://localhost:3000"
echo "  이메일: admin@example.com"
echo "  비밀번호: password123"
echo ""
echo "또는 다음 명령어로 개발 서버를 함께 실행:"
echo "  npm run dev (Backend)"
echo "  npm start (Admin Web)"
echo ""
