/**
 * 관리자 계정 생성 스크립트
 *
 * 사용법:
 * node scripts/createAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const createAdmin = async () => {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB 연결 성공');

    // 기존 관리자 계정 확인
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });

    if (existingAdmin) {
      console.log('⚠ 관리자 계정이 이미 존재합니다.');
      console.log('기존 계정 정보:');
      console.log(`  - 이메일: ${existingAdmin.email}`);
      console.log(`  - 사용자명: ${existingAdmin.username}`);
      console.log(`  - 역할: ${existingAdmin.role}`);

      // role이 admin이 아니면 업데이트
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✓ 역할을 "admin"으로 업데이트했습니다.');
      }
    } else {
      // 새 관리자 계정 생성
      const admin = await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      });

      console.log('✓ 관리자 계정이 생성되었습니다!');
      console.log('\n로그인 정보:');
      console.log(`  이메일: admin@example.com`);
      console.log(`  비밀번호: password123`);
      console.log(`\n⚠️  보안을 위해 프로덕션 환경에서는 비밀번호를 변경하세요!`);
    }

    await mongoose.connection.close();
    console.log('\n✓ 완료');
    process.exit(0);
  } catch (error) {
    console.error('✗ 오류 발생:', error.message);
    process.exit(1);
  }
};

createAdmin();
