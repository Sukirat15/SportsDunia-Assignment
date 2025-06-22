// controllers/earningDetails.js
const { earningModel } = require('../models/earningsSchema');
const { userModel } = require('../models/userSchema');

exports.earningDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`→ earningDetails for userId=${userId}`);

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const history = await earningModel
      .find({ earnerId: userId })
      .sort({ createdAt: -1 });

    return res.json({ earningHistory: history });
  } catch (err) {
    console.error('❌ Error in earningDetails:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
