/**
 * 테스트 데이터 생성 스크립트
 *
 * 사용법:
 * node scripts/seedData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Shelter = require('../src/models/Shelter');

const sampleShelters = [
  {
    name: '편안한 농막',
    description: `경기도 양평에 위치한 넓고 편안한 농막입니다.
가족 단위 방문객에게 적합하며, 주변에 계곡과 산책로가 있습니다.
깨끗한 시설과 아름다운 자연 경관을 자랑합니다.`,
    price: 1500000,
    location: {
      address: '경기도 양평군 양평읍 양평대교길 123',
      city: '양평',
      province: '경기도',
      coordinates: {
        latitude: 37.4913,
        longitude: 127.4872,
      },
    },
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    features: ['화장실', '주방시설', '에어컨', '냉장고', 'TV'],
    size: '20평',
    capacity: 4,
    status: 'available',
  },
  {
    name: '산속 쉼터',
    description: `강원도 홍천의 깊은 산속에 위치한 조용한 쉼터입니다.
완벽한 휴식과 힐링을 제공하며, 등산과 자연 관찰에 최적입니다.
겨울에는 난방 시설이 완비되어 있습니다.`,
    price: 2000000,
    location: {
      address: '강원도 홍천군 내면 광원리 산 123',
      city: '홍천',
      province: '강원도',
      coordinates: {
        latitude: 37.7519,
        longitude: 128.1689,
      },
    },
    features: ['화장실', '주방시설', '난방', '바베큐시설'],
    size: '25평',
    capacity: 5,
    status: 'available',
  },
  {
    name: '바다 전망 농막',
    description: `남해 바다가 한눈에 보이는 멋진 전망의 농막입니다.
일출과 일몰을 감상할 수 있으며, 해변까지 도보 5분 거리입니다.
넓은 테라스에서 바비큐를 즐길 수 있습니다.`,
    price: 3000000,
    location: {
      address: '경상남도 남해군 남해읍 해안로 456',
      city: '남해',
      province: '경상남도',
      coordinates: {
        latitude: 34.8376,
        longitude: 127.8926,
      },
    },
    youtubeUrl: 'https://www.youtube.com/watch?v=example',
    features: ['화장실', '주방시설', '에어컨', '전망대', '주차장', '테라스'],
    size: '30평',
    capacity: 6,
    status: 'available',
  },
  {
    name: '작은 농막',
    description: `소규모 가족이나 커플에게 적합한 아담한 농막입니다.
공주 시내와 가까워 접근성이 좋으며, 주변에 온천이 있습니다.
합리적인 가격으로 편안한 휴식을 즐기실 수 있습니다.`,
    price: 800000,
    location: {
      address: '충청남도 공주시 반포면 온천로 78',
      city: '공주',
      province: '충청남도',
      coordinates: {
        latitude: 36.4465,
        longitude: 127.1189,
      },
    },
    features: ['화장실', '간이주방', '주차장'],
    size: '10평',
    capacity: 2,
    status: 'available',
  },
  {
    name: '제주 돌집',
    description: `제주도 특유의 돌집 형태로 지어진 독특한 농막입니다.
제주의 아름다운 자연을 만끽할 수 있으며, 승마장과 감귤밭이 인접해 있습니다.`,
    price: 2500000,
    location: {
      address: '제주특별자치도 서귀포시 표선면 성읍정의로 123',
      city: '서귀포',
      province: '제주특별자치도',
      coordinates: {
        latitude: 33.3191,
        longitude: 126.7943,
      },
    },
    features: ['화장실', '주방시설', '에어컨', 'WiFi', '주차장', '정원'],
    size: '22평',
    capacity: 4,
    status: 'reserved',
  },
];

const seedData = async () => {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB 연결 성공');

    // 기존 데이터 삭제
    const deleteCount = await Shelter.deleteMany({});
    console.log(`✓ 기존 농막 데이터 ${deleteCount.deletedCount}개 삭제`);

    // 샘플 데이터 삽입
    const shelters = await Shelter.insertMany(sampleShelters);
    console.log(`✓ ${shelters.length}개의 샘플 농막 데이터 생성 완료`);

    console.log('\n생성된 농막 목록:');
    shelters.forEach((shelter, index) => {
      console.log(`  ${index + 1}. ${shelter.name} - ${shelter.location.city}, ${shelter.location.province}`);
    });

    await mongoose.connection.close();
    console.log('\n✓ 완료');
    process.exit(0);
  } catch (error) {
    console.error('✗ 오류 발생:', error.message);
    process.exit(1);
  }
};

seedData();
