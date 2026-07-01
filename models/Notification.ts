import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  recipientType: "all" | "selected" | "referral";
  channel: "push" | "email" | "whatsapp";
  status: "Sent" | "Pending";
  sentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: [true, "Notification title is required"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
    },
    recipientType: {
      type: String,
      enum: ["all", "selected", "referral"],
      default: "all",
    },
    channel: {
      type: String,
      enum: ["push", "email", "whatsapp"],
      required: [true, "Channel is required"],
    },
    status: {
      type: String,
      enum: ["Sent", "Pending"],
      default: "Sent",
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
