// controllers/referralEarnings.js
const { v4: uuidv4 } = require('uuid');
const { earningModel } = require('../models/earningsSchema');
const { userModel } = require('../models/userSchema');
const { getIo } = require('../socket');

exports.referralEarning = async (req, res) => {
  try {
    const { buyerId, amount } = req.body;
    console.log('→ referralEarning payload:', req.body);

    if (amount < 1000) {
      return res.status(400).json({ message: 'No referral rewards under 1000' });
    }

    const buyer = await userModel.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found!' });
    }

    const txId = uuidv4();
    let parent = buyer.parentReferreal;
    let level = 1;

    while (parent && level <= 2) {
      const p = await userModel.findById(parent);
      if (!p) break;

      const earned = level === 1 ? 0.05 * amount : 0.01 * amount;

      await earningModel.create({
        buyerId,
        earnerId: p._id,
        amount: earned,
        earningType: 'purchase',
        level,
        transactionId: txId
      });

      p.earning += earned;
      await p.save();

      // broadcast
      getIo().emit('earnings_Update', {
        userName: p.name,
        earnedAmount: earned
      });

      parent = p.parentReferreal;
      level++;
    }

    return res
      .status(200)
      .json({ message: 'Purchase recorded and referral earnings distributed' });
  } catch (err) {
    console.error('❌ Error in referralEarning:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
