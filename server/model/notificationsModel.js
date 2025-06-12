import mongoose,{Schema} from "mongoose";

const notificationSchema = new Schema({
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
  receiverRole: { type: Number, enum: [300, 400, 500], required: true },
   link: {
  type: String,
  validate: {
    validator: function(url) {
      // Skip validation if link is empty/null
      if (url == null || url === "") return true;
      return /^\/[a-zA-Z0-9/-]*$/.test(url); 
    },
    message: "Link must be a valid frontend path "
  }
},
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);
