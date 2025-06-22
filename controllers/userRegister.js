// controllers/userRegister.js
const crypto = require('crypto');
const { userModel } = require('../models/userSchema');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, referralCode } = req.body;
    console.log('→ registerUser payload:', req.body);

    // prevent duplicate email
    if (await userModel.findOne({ email })) {
      return res.status(400).json({ message: 'Email already registered!' });
    }

    // if they provided a referral code, validate it
    let parentUser = null;
    if (referralCode) {
      parentUser = await userModel.findOne({ referralCode });
      if (!parentUser) {
        return res.status(400).json({ message: 'Invalid referral code!' });
      }
      if (parentUser.referrals.length >= 8) {
        return res.status(400).json({ message: 'Referral limit reached!' });
      }
    }

    // generate a unique 8-char code
    const newReferralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const newUser = new userModel({
      name,
      email,
      referralCode: newReferralCode,
      parentReferreal: parentUser?._id || null,
      level: parentUser ? parentUser.level + 1 : 1
    });

    await newUser.save();

    // add this user to parent's referrals[]
    if (parentUser) {
      parentUser.referrals.push(newUser._id);
      await parentUser.save();
    }

    console.log('✅ New user created:', newUser._id);
    return res.status(201).json({ message: 'New user registered', user: newUser });
  } catch (err) {
    console.error('❌ Error in registerUser:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
