import mongoose,{Schema} from "mongoose";

const notificationSchema = new Schema({
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
  receiverRole: { type: Number, enum: [300, 400, 500], required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);
