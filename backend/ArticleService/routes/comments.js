const express = require('express');
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Article = require('../models/Article');
const authMiddleware = require('../../api-gateway/middleware/auth');
const { validateComment } = require('../../api-gateway/middleware/validate');
const router = express.Router();

// Create comment (Authenticated users)
router.post('/:articleId', authMiddleware(), validateComment, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.articleId)) {
      return res.status(400).json({ message: 'Invalid article ID' });
    }
    const article = await Article.findById(req.params.articleId);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    const { content, parentComment } = req.body;
    if (parentComment && !mongoose.isValidObjectId(parentComment)) {
      return res.status(400).json({ message: 'Invalid parent comment ID' });
    }
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent) return res.status(404).json({ message: 'Parent comment not found' });
    }

    const comment = new Comment({
      content,
      article: req.params.articleId,
      author: req.user.userId,
      parentComment: parentComment || null,
    });
    await comment.save();

    // Emit Socket.io event
    const io = req.app.get('socketio');
    io.to(`article:${req.params.articleId}`).emit('newComment', {
      comment: await comment.populate('author', 'username email'),
      articleId: req.params.articleId,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get comments for an article
router.get('/:articleId', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.articleId)) {
      return res.status(400).json({ message: 'Invalid article ID' });
    }
    const comments = await Comment.find({ article: req.params.articleId })
      .populate('author', 'username email')
      .lean();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;