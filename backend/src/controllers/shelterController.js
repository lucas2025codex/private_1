const Shelter = require('../models/Shelter');

// @desc    모든 농막 조회
// @route   GET /api/shelters
// @access  Public
exports.getShelters = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const shelters = await Shelter.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Shelter.countDocuments();

    res.status(200).json({
      success: true,
      count: shelters.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: shelters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다',
      error: error.message,
    });
  }
};

// @desc    특정 농막 조회
// @route   GET /api/shelters/:id
// @access  Public
exports.getShelter = async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);

    if (!shelter) {
      return res.status(404).json({
        success: false,
        message: '농막을 찾을 수 없습니다',
      });
    }

    // 조회수 증가
    shelter.views += 1;
    await shelter.save();

    res.status(200).json({
      success: true,
      data: shelter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다',
      error: error.message,
    });
  }
};

// @desc    농막 등록
// @route   POST /api/shelters
// @access  Private/Admin
exports.createShelter = async (req, res) => {
  try {
    const shelter = await Shelter.create(req.body);

    res.status(201).json({
      success: true,
      message: '농막이 성공적으로 등록되었습니다',
      data: shelter,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: '농막 등록에 실패했습니다',
      error: error.message,
    });
  }
};

// @desc    농막 수정
// @route   PUT /api/shelters/:id
// @access  Private/Admin
exports.updateShelter = async (req, res) => {
  try {
    const shelter = await Shelter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!shelter) {
      return res.status(404).json({
        success: false,
        message: '농막을 찾을 수 없습니다',
      });
    }

    res.status(200).json({
      success: true,
      message: '농막이 성공적으로 수정되었습니다',
      data: shelter,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: '농막 수정에 실패했습니다',
      error: error.message,
    });
  }
};

// @desc    농막 삭제
// @route   DELETE /api/shelters/:id
// @access  Private/Admin
exports.deleteShelter = async (req, res) => {
  try {
    const shelter = await Shelter.findByIdAndDelete(req.params.id);

    if (!shelter) {
      return res.status(404).json({
        success: false,
        message: '농막을 찾을 수 없습니다',
      });
    }

    res.status(200).json({
      success: true,
      message: '농막이 성공적으로 삭제되었습니다',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '농막 삭제에 실패했습니다',
      error: error.message,
    });
  }
};

// @desc    농막 검색 및 필터링
// @route   POST /api/shelters/search
// @access  Public
exports.searchShelters = async (req, res) => {
  try {
    const {
      keyword,
      minPrice,
      maxPrice,
      city,
      province,
      status,
      features,
      sortBy,
    } = req.body;

    let query = {};

    // 키워드 검색
    if (keyword) {
      query.$text = { $search: keyword };
    }

    // 가격 범위
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    // 위치
    if (city) query['location.city'] = city;
    if (province) query['location.province'] = province;

    // 상태
    if (status) query.status = status;

    // 특징
    if (features && features.length > 0) {
      query.features = { $in: features };
    }

    // 정렬 옵션
    let sortOptions = {};
    switch (sortBy) {
      case 'price_asc':
        sortOptions.price = 1;
        break;
      case 'price_desc':
        sortOptions.price = -1;
        break;
      case 'rating':
        sortOptions.rating = -1;
        break;
      case 'views':
        sortOptions.views = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }

    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const skip = (page - 1) * limit;

    const shelters = await Shelter.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Shelter.countDocuments(query);

    res.status(200).json({
      success: true,
      count: shelters.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: shelters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '검색 중 오류가 발생했습니다',
      error: error.message,
    });
  }
};

// @desc    이미지 업로드
// @route   POST /api/shelters/:id/images
// @access  Private/Admin
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '이미지 파일을 선택해주세요',
      });
    }

    const shelter = await Shelter.findById(req.params.id);

    if (!shelter) {
      return res.status(404).json({
        success: false,
        message: '농막을 찾을 수 없습니다',
      });
    }

    const images = req.files.map((file) => ({
      url: `/uploads/${file.filename}`,
      alt: req.body.alt || shelter.name,
    }));

    shelter.images.push(...images);
    await shelter.save();

    res.status(200).json({
      success: true,
      message: '이미지가 성공적으로 업로드되었습니다',
      data: shelter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '이미지 업로드에 실패했습니다',
      error: error.message,
    });
  }
};
