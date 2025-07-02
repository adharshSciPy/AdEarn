 import SubscriptionSettings from "../model/subscriptionSettingsModel.js"
 const getSubscriptionSettings = async (req, res) => {
  try {
    const settings = await SubscriptionSettings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Subscription settings not found" });
    }
    res.status(200).json({ settings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const updateSubscriptionSettings = async (req, res) => {
  const { starCountRequired, subscriptionDurationDays } = req.body;

  try {
    const updated = await SubscriptionSettings.findOneAndUpdate(
      {},
      { starCountRequired, subscriptionDurationDays },
      { new: true, upsert: true } // creates if not exists
    );
    res.status(200).json({ message: "Subscription settings updated", updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating settings", error: error.message });
  }
};
export{
    getSubscriptionSettings,
    updateSubscriptionSettings
}