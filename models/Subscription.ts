import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  productName: string;
  quantity: string;
  plan: "Daily" | "Weekly" | "Monthly";
  startDate: Date;
  nextDelivery: Date;
  status: "Active" | "Paused" | "Cancelled" | "Expired";
  remainingDays: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    productName: {
      type: String,
      required: [true, "Product name is required"],
    },
    quantity: {
      type: String,
      required: [true, "Quantity is required"],
    },
    plan: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly"],
      required: [true, "Plan is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    nextDelivery: {
      type: Date,
      required: [true, "Next delivery date is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Paused", "Cancelled", "Expired"],
      default: "Active",
    },
    remainingDays: {
      type: Number,
      default: 30,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription: Model<ISubscription> = mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

export default Subscription;
