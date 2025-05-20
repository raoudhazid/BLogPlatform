const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  image: { type: String }, // URL or base64 string
  tags: [{ type: String, trim: true }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

articleSchema.index({ author: 1 });
articleSchema.index({ tags: 1 });

module.exports = mongoose.model('Article', articleSchema);