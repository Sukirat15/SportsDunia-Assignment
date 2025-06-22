// models/userSchema.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:             { type: String, required: true },
  email:            { type: String, required: true, unique: true },
  referralCode:     { type: String, required: true, unique: true },
  parentReferreal:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  level:            { type: Number, default: 1 },
  earning:          { type: Number, default: 0 },
  referrals:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

exports.userModel = mongoose.model('User', userSchema);
