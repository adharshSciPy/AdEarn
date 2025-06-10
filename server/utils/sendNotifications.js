import Notification from "../model/notificationsModel.js"

 const sendNotification = async (receiverId, role, message, io, connectedUsers,link = null) => {
  await Notification.create({ receiverId, receiverRole: role, message,link });

  const socketId = connectedUsers.get(receiverId.toString());
  if (socketId) {
    io.to(socketId).emit("notification", { message, role,link });
  }
};
export {sendNotification}