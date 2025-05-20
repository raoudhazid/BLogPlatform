const express = require('express');
const mongoose = require('mongoose');
const Article = require('../models/Article');
const authMiddleware = require('../middleware/auth');
const router = express.Router();


router.post('/', authMiddleware(), async (req, res) => {
  try {
    const { title, content, image, tags } = req.body;
    const article = new Article({
      title,
      content,
      image,
      tags,
      author: req.user.userId,
    });
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/', async (req, res) => {
  try {
    const articles = await Article.find()
      .populate('author', 'username email')
      .lean(); // Optimize by converting to plain JS objects
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid article ID' });
    }
    const article = await Article.findById(req.params.id)
      .populate('author', 'username email')
      .lean();
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.patch('/:id', authMiddleware(), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid article ID' });
    }
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    // Permission check
    const isAuthor = article.author.toString() === req.user.userId;
    const canEdit = req.user.role === 'Admin' || req.user.role === 'Editor' || (req.user.role === 'Writer' && isAuthor);
    if (!canEdit) return res.status(403).json({ message: 'Insufficient permissions' });

    const { title, content, image, tags } = req.body;
    article.title = title || article.title;
    article.content = content || article.content;
    article.image = image || article.image;
    article.tags = tags || article.tags;

    await article.save();
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete article (Admins only)
router.delete('/:id', authMiddleware('Admin'), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid article ID' });
    }
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;