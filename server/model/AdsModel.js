import mongoose,{Schema} from "mongoose";
const adSchema = new Schema({
  imgAdRef: { type: Schema.Types.ObjectId, ref: "ImageAd" },
  videoAdRef: { type: Schema.Types.ObjectId, ref: "VideoAd" },
  surveyAdRef: { type: Schema.Types.ObjectId, ref: "SurveyAd" }
}, { timestamps: true });

export const Ad = mongoose.model("Ad", adSchema);
