const Notification = require("../models/Notification");

async function sendNotification(userId, type, message, demandeId = null) {
  try {
    const notificationData = {
      user: userId,
      type,
      message,
      isRead: false,
      createdAt: new Date()
    };
    if (demandeId) {
      notificationData.demande = demandeId;
    }
    await Notification.create(notificationData);
  } catch (err) {
    console.error("Erreur lors de l'envoi de la notification:", err.message);
  }
}

module.exports = sendNotification;
