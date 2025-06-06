import User from "../model/userModel.js";
const checkSubscription = async (req, res, next) => {
  try {
    const userId = req.user?.id; // You must have some way to attach user ID (via auth middleware or token)

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.hasActiveSubscription()) {
      return res.status(403).json({
        message: "Your subscription has expired. Please renew to access this feature.",
      });
    }

    // Attach user to request if needed later
    req.userData = user;
    next();
  } catch (err) {
    console.error("Subscription check failed:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default checkSubscription;