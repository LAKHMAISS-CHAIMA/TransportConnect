const Message = require("../models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(" Nouveau client connecté:", socket.id);

    socket.on("join-annonce", (annonceId) => {
      socket.join(`annonce-${annonceId}`);
      console.log(` Utilisateur ${socket.id} a rejoint l'annonce ${annonceId}`);
    });

    socket.on("send-message", async (data) => {
      try {
        const { annonceId, senderId, receiverId, content } = data;
        
        const message = await Message.create({
          annonce: annonceId,
          sender: senderId,
          receiver: receiverId,
          content
        });

        io.to(`annonce-${annonceId}`).emit("new-message", {
          id: message._id,
          content: message.content,
          sender: message.sender,
          receiver: message.receiver,
          createdAt: message.createdAt
        });

        console.log(` Message envoyé dans l'annonce ${annonceId}`);
      } catch (error) {
        console.error(" Erreur lors de l'envoi du message:", error);
        socket.emit("message-error", { message: "Erreur lors de l'envoi du message" });
      }
    });

    socket.on("mark-as-read", async (messageId) => {
      try {
        await Message.findByIdAndUpdate(messageId, { isRead: true });
        socket.emit("message-read", { messageId });
      } catch (error) {
        console.error(" Erreur lors du marquage comme lu:", error);
      }
    });

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

    
    socket.on("disconnect", () => {
      console.log(" Client déconnecté:", socket.id);
    });
  });
}; 