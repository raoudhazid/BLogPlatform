const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Admin', 'Editor', 'Writer', 'Reader'],
    default: 'Reader',
  },
  refreshToken: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);