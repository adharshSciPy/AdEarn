import Notification from "../model/notificationsModel.js";

const sendNotification = async (
  receiverId,
  role,
  message,
  io,
  connectedUsers,
  link = null
) => {
  try {
    // ✅ Store in DB
    await Notification.create({ receiverId, receiverRole: role, message, link });

    // ✅ Send via socket if connected
    if (connectedUsers && typeof connectedUsers.get === "function") {
      const socketId = connectedUsers.get(receiverId.toString());
      if (socketId && io) {
        io.to(socketId).emit("notification", { message, role, link });
        console.log(`Notification sent to ${receiverId} via socket`);
      } else {
        console.log(`User ${receiverId} not connected via socket`);
      }
    }
  } catch (err) {
    console.error("sendNotification error:", err);
  }
};

export { sendNotification };
