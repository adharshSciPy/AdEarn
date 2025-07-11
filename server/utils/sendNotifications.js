import Notification from "../model/notificationsModel.js";

const sendNotification = async (
  receiverId,
  role,
  message,
  io,
  connectedUsers,
  link = null
) => {
  // ✅ Store the notification in MongoDB
  await Notification.create({ receiverId, receiverRole: role, message, link });

  // ✅ Send real-time notification only if socket connection exists
  if (connectedUsers && typeof connectedUsers.get === "function") {
    const socketId = connectedUsers.get(receiverId.toString());
    if (socketId && io) {
      io.to(socketId).emit("notification", { message, role, link });
    }
  }
};

export { sendNotification };
