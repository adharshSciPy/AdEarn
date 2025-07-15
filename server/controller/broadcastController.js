import { Broadcast } from "../model/broadcastMessages.js";
import User from "../model/userModel.js";
import { Admin } from "../model/adminModel.js";
import { sendNotification } from "../utils/sendNotifications.js";

const createBroadcast = async (req, res) => {
  const { io, connectedUsers } = req;
  const { message, target } = req.body;

  try {
    if (!message || !target) {
      return res.status(400).json({ message: "Message and target are required" });
    }

    const createdMessage = await Broadcast.create({ message, target });

    let recipients = [];
    let role;

    if (target === "allUsers") {
      recipients = await User.find({}, "_id");
      role = 300; 
    } else if (target === "allAdmins") {
      recipients = await Admin.find({}, "_id");
      role = 400; 
    }

    for (const user of recipients) {
      await sendNotification(
        user._id,
        role, 
        message,
        io,
        connectedUsers
      );
    }

    return res.status(201).json({
      message: "Broadcast message sent successfully",
      broadcast: createdMessage,
      notifiedCount: recipients.length,
    });
  } catch (error) {
    console.error("Error sending broadcast:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createBroadcast };
