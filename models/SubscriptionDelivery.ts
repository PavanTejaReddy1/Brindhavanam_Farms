import mongoose, { Schema, Document, Model } from "mongoose";

export type DeliveryStatus = "Pending" | "Out for Delivery" | "Delivered" | "Skipped";

export interface ISubscriptionDelivery extends Document {
  subscriptionId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  customerName: string;
  customerAddress: string;
  productName: string;
  quantity: string;
  deliveryDate: Date;       // The specific calendar date for this delivery
  dayNumber: number;        // 1-based day index within the subscription
  status: DeliveryStatus;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionDeliverySchema = new Schema<ISubscriptionDelivery>(
  {
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    customerName:    { type: String, required: true },
    customerAddress: { type: String, required: true },
    productName:     { type: String, required: true },
    quantity:        { type: String, required: true },
    deliveryDate: { type: Date, required: true },
    dayNumber:    { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Out for Delivery", "Delivered", "Skipped"],
      default: "Pending",
    },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

// Compound index so we can look up a specific day fast
SubscriptionDeliverySchema.index({ subscriptionId: 1, deliveryDate: 1 });
SubscriptionDeliverySchema.index({ userId: 1, deliveryDate: 1 });

const SubscriptionDelivery: Model<ISubscriptionDelivery> =
  mongoose.models.SubscriptionDelivery ||
  mongoose.model<ISubscriptionDelivery>(
    "SubscriptionDelivery",
    SubscriptionDeliverySchema
  );

export default SubscriptionDelivery;
