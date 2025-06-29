const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
  getNotifications, 
  markAsRead, 
  deleteNotification 
} = require('../controllers/notificationController');

router.get('/', protect, getNotifications);

router.put('/:id/read', protect, markAsRead);

router.delete('/:id', protect, deleteNotification);

module.exports = router; 