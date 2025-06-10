import Notification from "../model/notificationsModel.js"

 const sendNotification = async (receiverId, role, message, io, connectedUsers) => {
  await Notification.create({ receiverId, receiverRole: role, message });

  const socketId = connectedUsers.get(receiverId.toString());
  if (socketId) {
    io.to(socketId).emit("notification", { message, role });
  }
};
export {sendNotification}