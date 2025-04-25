const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Submit KYC verification
// @route   POST /api/users/kyc
// @access  Private
exports.submitKyc = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If already pending or approved, prevent resubmission
    if (user.kycStatus === 'pending' || user.kycStatus === 'approved') {
      return res.status(400).json({
        success: false,
        message: `KYC verification is already ${user.kycStatus}. You cannot submit another request.`
      });
    }

    // Handle file uploads and store paths
    const kycDocuments = {};
    if (user.kycDocuments) {
      // Preserve existing document references if they exist
      if (user.kycDocuments.idProof) kycDocuments.idProof = user.kycDocuments.idProof;
      if (user.kycDocuments.addressProof) kycDocuments.addressProof = user.kycDocuments.addressProof;
      if (user.kycDocuments.selfie) kycDocuments.selfie = user.kycDocuments.selfie;
    }

    // Store user submitted form data
    const { 
      idNumber, 
      birthDate, 
      phone, 
      street, 
      city, 
      state, 
      postalCode, 
      country 
    } = req.body;
    
    // Update user personal information
    if (idNumber) user.idNumber = idNumber;
    if (birthDate) user.birthDate = new Date(birthDate);
    if (phone) user.phone = phone;
    
    // Update user address
    user.address = {
      street: street || user.address?.street,
      city: city || user.address?.city,
      state: state || user.address?.state,
      postalCode: postalCode || user.address?.postalCode,
      country: country || user.address?.country
    };

    // Check if we have files
    if (req.files) {
      // Store file paths
      const userUploadsPath = `/uploads/kyc/${user._id}`;
      
      // Handle ID proof
      if (req.files.idProof) {
        kycDocuments.idProof = `${userUploadsPath}/idProof${path.extname(req.files.idProof[0].originalname)}`;
      }

      // Handle address proof
      if (req.files.addressProof) {
        kycDocuments.addressProof = `${userUploadsPath}/addressProof${path.extname(req.files.addressProof[0].originalname)}`;
      }

      // Handle selfie
      if (req.files.selfie) {
        kycDocuments.selfie = `${userUploadsPath}/selfie${path.extname(req.files.selfie[0].originalname)}`;
      }
    }

    // Update KYC status
    user.kycStatus = 'pending';
    
    // Clear any previous rejection or resubmission messages
    if (user.kycDocuments) {
      user.kycDocuments.rejectionReason = undefined;
      user.kycDocuments.resubmissionMessage = undefined;
    }
    
    // Save document paths
    user.kycDocuments = {
      ...user.kycDocuments,
      ...kycDocuments
    };

    await user.save();

    res.json({
      success: true,
      message: 'KYC documents submitted successfully',
      data: {
        kycStatus: user.kycStatus,
        documents: kycDocuments
      }
    });
  } catch (error) {
    console.error('KYC submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 