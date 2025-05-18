const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

const validateComment = [
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ max: 1000 }).withMessage('Content must be less than 1000 characters')
    .customSanitizer(value => sanitizeHtml(value, {
      allowedTags: ['b', 'i', 'em', 'strong'],
      allowedAttributes: {}
    })),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateComment };