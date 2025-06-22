const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    let query = Notification.find({ user: req.user._id }).sort({ createdAt: -1 });

    if (req.query.populate === 'demande') {
      query = query.populate({
        path: 'demande',
        populate: [
          {
            path: 'annonce',
            select: 'depart destination dateTrajet prix typeMarchandise'
          },
          {
            path: 'expediteur',
            select: 'name email'
          }
        ]
      });
    }

    const notifications = await query;
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }
    res.json({ message: 'Notification supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}; 