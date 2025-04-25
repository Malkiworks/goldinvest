const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  submitKyc, 
  getUserProfile, 
  updateUserProfile 
} = require('../controllers/userController');
const { 
  getKycPendingUsers, 
  approveKyc, 
  rejectKyc,
  requestResubmission 
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Configure multer for KYC file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/kyc'));
  },
  filename: function(req, file, cb) {
    const userId = req.user.id;
    const fieldname = file.fieldname;
    const extension = path.extname(file.originalname);
    cb(null, `${userId}-${fieldname}${extension}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpg, jpeg, png) and PDF files are allowed'));
  }
});

// User routes - need to be authenticated
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// KYC upload route with multer middleware
const kycUpload = upload.fields([
  { name: 'idProof', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'selfie', maxCount: 1 }
]);
router.post('/kyc', protect, kycUpload, submitKyc);

// Admin only routes
router.get('/kyc/pending', protect, authorize('admin'), getKycPendingUsers);
router.put('/kyc/:id/approve', protect, authorize('admin'), approveKyc);
router.put('/kyc/:id/reject', protect, authorize('admin'), rejectKyc);
router.put('/kyc/:id/resubmit', protect, authorize('admin'), requestResubmission);

module.exports = router; 