// models/earningsSchema.js
const mongoose = require('mongoose');

const earningSchema = new mongoose.Schema({
  earnerId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyerId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:        { type: Number, required: true },
  earningType:   { type: String, enum: ['purchase', 'referral'], required: true },
  level:         { type: Number },
  transactionId: { type: String },
  createdAt:     { type: Date, default: Date.now }
});

exports.earningModel = mongoose.model('Earning', earningSchema);
