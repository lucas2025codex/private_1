const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');

// 환경 변수 로드
dotenv.config();

// Express 앱 초기화
const app = express();

// 데이터베이스 연결
connectDB();

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 (업로드된 이미지)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 라우트
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/shelters', require('./routes/shelterRoutes'));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: '농막 관리 시스템 API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      shelters: '/api/shelters',
    },
  });
});

// 404 에러 핸들러
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: '요청한 리소스를 찾을 수 없습니다',
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '서버 오류가 발생했습니다',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
  console.log(`환경: ${process.env.NODE_ENV || 'development'}`);
});
