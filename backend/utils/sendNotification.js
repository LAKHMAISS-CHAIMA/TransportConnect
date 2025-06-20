const Notification = require("../models/Notification");

async function sendNotification(userId, type, message) {
  try {
    await Notification.create({
      user: userId,
      type,
      message,
      isRead: false,
      createdAt: new Date()
    });
  } catch (err) {
    console.error("Erreur lors de l'envoi de la notification:", err.message);
  }
}

module.exports = sendNotification;
