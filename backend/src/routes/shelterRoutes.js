const express = require('express');
const router = express.Router();
const {
  getShelters,
  getShelter,
  createShelter,
  updateShelter,
  deleteShelter,
  searchShelters,
  uploadImages,
} = require('../controllers/shelterController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getShelters);
router.get('/:id', getShelter);
router.post('/search', searchShelters);

// Protected routes (Admin only)
router.post('/', protect, admin, createShelter);
router.put('/:id', protect, admin, updateShelter);
router.delete('/:id', protect, admin, deleteShelter);
router.post(
  '/:id/images',
  protect,
  admin,
  upload.array('images', 10),
  uploadImages
);

module.exports = router;
