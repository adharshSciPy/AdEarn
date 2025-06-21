import Notification from "../model/notificationsModel.js";

const getNotifications = async (req, res) => {
  const { id, role } = req.user; // 🔥 pulled from token

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

export { getNotifications };
