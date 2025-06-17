const Message = require("../models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Nouveau client connecté:", socket.id);

    // Rejoindre une room pour une annonce spécifique
    socket.on("join-annonce", (annonceId) => {
      socket.join(`annonce-${annonceId}`);
      console.log(`👥 Utilisateur ${socket.id} a rejoint l'annonce ${annonceId}`);
    });

    // Envoyer un message
    socket.on("send-message", async (data) => {
      try {
        const { annonceId, senderId, receiverId, content } = data;
        
        // Sauvegarder le message en base
        const message = await Message.create({
          annonce: annonceId,
          sender: senderId,
          receiver: receiverId,
          content
        });

        // Émettre le message à tous les utilisateurs de l'annonce
        io.to(`annonce-${annonceId}`).emit("new-message", {
          id: message._id,
          content: message.content,
          sender: message.sender,
          receiver: message.receiver,
          createdAt: message.createdAt
        });

        console.log(`💬 Message envoyé dans l'annonce ${annonceId}`);
      } catch (error) {
        console.error("❌ Erreur lors de l'envoi du message:", error);
        socket.emit("message-error", { message: "Erreur lors de l'envoi du message" });
      }
    });

    // Marquer un message comme lu
    socket.on("mark-as-read", async (messageId) => {
      try {
        await Message.findByIdAndUpdate(messageId, { isRead: true });
        socket.emit("message-read", { messageId });
      } catch (error) {
        console.error("❌ Erreur lors du marquage comme lu:", error);
      }
    });

    // Typing indicator
    socket.on("typing", (data) => {
      socket.to(`annonce-${data.annonceId}`).emit("user-typing", {
        userId: data.userId,
        isTyping: true
      });
    });

    socket.on("stop-typing", (data) => {
      socket.to(`annonce-${data.annonceId}`).emit("user-typing", {
        userId: data.userId,
        isTyping: false
      });
    });

    // Déconnexion
    socket.on("disconnect", () => {
      console.log("🔌 Client déconnecté:", socket.id);
    });
  });
}; 