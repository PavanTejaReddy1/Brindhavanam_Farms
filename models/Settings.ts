import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  companyName: string;
  phoneNumber: string;
  email: string;
  gstNumber: string;
  address: string;
  deliveryStartTime: string;
  deliveryEndTime: string;
  referralReward: string;
  referralRewardValue: number;
  whatsappNumber: string;
  logo: string;
  heroImage: string;
  referralBanner: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    companyName: {
      type: String,
      default: "Brindhavanam Farms",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    gstNumber: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    deliveryStartTime: {
      type: String,
      default: "05:00",
    },
    deliveryEndTime: {
      type: String,
      default: "07:00",
    },
    referralReward: {
      type: String,
      default: "1 Litre Free Milk",
    },
    referralRewardValue: {
      type: Number,
      default: 45,
    },
    whatsappNumber: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    heroImage: {
      type: String,
      default: "",
    },
    referralBanner: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
