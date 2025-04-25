const User = require('../models/User');

// @desc    Get all users with pending KYC status
// @route   GET /api/users/kyc/pending
// @access  Private/Admin
exports.getKycPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ kycStatus: 'pending' }).select('-password');

    res.json({
      success: true,
      count: pendingUsers.length,
      data: pendingUsers
    });
  } catch (error) {
    console.error('Get pending KYC users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Approve user KYC
// @route   PUT /api/users/kyc/:id/approve
// @access  Private/Admin
exports.approveKyc = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update KYC status
    user.kycStatus = 'approved';
    user.kycDocuments.reviewedBy = req.user.id;
    user.kycDocuments.reviewedAt = Date.now();

    await user.save();

    res.json({
      success: true,
      message: 'KYC approved successfully',
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        kycStatus: user.kycStatus
      }
    });
  } catch (error) {
    console.error('Approve KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reject user KYC
// @route   PUT /api/users/kyc/:id/reject
// @access  Private/Admin
exports.rejectKyc = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update KYC status
    user.kycStatus = 'rejected';
    user.kycDocuments.rejectionReason = rejectionReason;
    user.kycDocuments.reviewedBy = req.user.id;
    user.kycDocuments.reviewedAt = Date.now();

    await user.save();

    res.json({
      success: true,
      message: 'KYC rejected successfully',
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        kycStatus: user.kycStatus,
        rejectionReason
      }
    });
  } catch (error) {
    console.error('Reject KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Request KYC resubmission
// @route   PUT /api/users/kyc/:id/resubmit
// @access  Private/Admin
exports.requestResubmission = async (req, res) => {
  try {
    const { resubmissionMessage } = req.body;

    if (!resubmissionMessage) {
      return res.status(400).json({
        success: false,
        message: 'Resubmission message is required'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update KYC status to need resubmission
    user.kycStatus = 'resubmission_requested';
    user.kycDocuments.resubmissionMessage = resubmissionMessage;
    user.kycDocuments.reviewedBy = req.user.id;
    user.kycDocuments.reviewedAt = Date.now();

    await user.save();

    res.json({
      success: true,
      message: 'KYC resubmission requested successfully',
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        kycStatus: user.kycStatus,
        resubmissionMessage
      }
    });
  } catch (error) {
    console.error('Request resubmission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all users (for admin dashboard)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 