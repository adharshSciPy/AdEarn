import Notification from "../model/notificationsModel.js";

const getNotifications = async (req, res) => {
  const { id, role } = req.user;

  if (!id || !role) {
    return res.status(400).json({ success: false, message: "User ID and role are required" });
  }

  try {
    const notifications = await Notification.find({
      receiverId: id,
      receiverRole: role,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const markNotificationsAsRead = async (req, res) => {
  const { id } = req.user;
  const { notificationId } = req.body;

  if (!id || !notificationId || typeof notificationId !== 'string') {
    return res.status(400).json({ success: false, message: "Valid user ID and notification ID required" });
  }

  try {
    const notification = await Notification.findOne({ _id: notificationId, receiverId: id });

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    if (notification.read) {
      console.log("⚠️ Notification already marked as read");
      return res.status(400).json({ success: false, message: "Notification already marked as read" });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ success:true, message: "Notification marked as read",data:notification });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export { getNotifications,markNotificationsAsRead };
