const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// @desc    사용자 등록
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 사용자 존재 여부 확인
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: '이미 존재하는 사용자입니다',
      });
    }

    // 사용자 생성
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: '회원가입이 완료되었습니다',
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: '회원가입에 실패했습니다',
      error: error.message,
    });
  }
};

// @desc    로그인
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 이메일 확인
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다',
      });
    }

    // 비밀번호 확인
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다',
      });
    }

    // 활성화 상태 확인
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: '비활성화된 계정입니다',
      });
    }

    res.status(200).json({
      success: true,
      message: '로그인에 성공했습니다',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '로그인에 실패했습니다',
      error: error.message,
    });
  }
};

// @desc    사용자 프로필 조회
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '프로필 조회에 실패했습니다',
      error: error.message,
    });
  }
};
