import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReferral extends Document {
  referrerId: mongoose.Types.ObjectId;
  referrerName: string;
  refereeId: mongoose.Types.ObjectId;
  refereeName: string;
  code: string;
  status: "Pending" | "Successful" | "Rejected";
  reward: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralSchema = new Schema<IReferral>(
  {
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Referrer ID is required"],
    },
    referrerName: {
      type: String,
      required: [true, "Referrer name is required"],
    },
    refereeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Referee ID is required"],
    },
    refereeName: {
      type: String,
      required: [true, "Referee name is required"],
    },
    code: {
      type: String,
      required: [true, "Referral code is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Successful", "Rejected"],
      default: "Pending",
    },
    reward: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Referral: Model<IReferral> = mongoose.models.Referral || mongoose.model<IReferral>("Referral", ReferralSchema);

export default Referral;
