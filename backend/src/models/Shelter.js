const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '농막 이름을 입력해주세요'],
      trim: true,
      maxlength: [100, '이름은 100자를 초과할 수 없습니다'],
    },
    description: {
      type: String,
      required: [true, '설명을 입력해주세요'],
      maxlength: [2000, '설명은 2000자를 초과할 수 없습니다'],
    },
    price: {
      type: Number,
      required: [true, '가격을 입력해주세요'],
      min: [0, '가격은 0보다 작을 수 없습니다'],
    },
    location: {
      address: {
        type: String,
        required: [true, '주소를 입력해주세요'],
      },
      city: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
      coordinates: {
        latitude: {
          type: Number,
          required: false,
        },
        longitude: {
          type: Number,
          required: false,
        },
      },
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: '',
        },
      },
    ],
    youtubeUrl: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(v);
        },
        message: '유효한 YouTube URL을 입력해주세요',
      },
    },
    features: [
      {
        type: String,
      },
    ],
    size: {
      type: String,
      required: false,
    },
    capacity: {
      type: Number,
      required: false,
      min: 1,
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'unavailable'],
      default: 'available',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 검색을 위한 인덱스
shelterSchema.index({ name: 'text', description: 'text' });
shelterSchema.index({ 'location.city': 1, 'location.province': 1 });
shelterSchema.index({ price: 1 });

module.exports = mongoose.model('Shelter', shelterSchema);
