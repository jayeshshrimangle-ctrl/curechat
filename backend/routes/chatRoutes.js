// ============================================
// Chat Routes - Vectorax Healthcare
// ============================================

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/send', authMiddleware, chatController.sendMessage);
router.get('/history', authMiddleware, chatController.getChats);
router.get('/:id', authMiddleware, chatController.getChat);
router.delete('/:id', authMiddleware, chatController.deleteChat);

module.exports = router;
