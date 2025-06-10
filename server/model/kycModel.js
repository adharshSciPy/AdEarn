import mongoose,{Schema} from "mongoose";

const kycSchema=new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
fullName:{
    type:String
},
dateOfBirth:{
    type:String
},
gender:{
    type:String
},
nationality:{
    type:String
},
guardianName:{
    type:String
},
email:{
    type:String
},
phoneNumber:{
    type:Number
},
permanentAddress:{
    type:String
},
currentAddress:{
    type:String
},
documentType:{
    type:String
},
documentNumber:{
    type:String
},
documentFile:{
    type:String
},
bankName:{
    type:String
},
accountNumber:{
    type:Number
},
ifscCode:{
    type:String
},

kycStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  rejectionReason: {
  type: String,
  default: null,
},

})
export default mongoose.model("kyc",kycSchema)