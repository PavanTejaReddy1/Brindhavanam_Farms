import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubscription extends Document {
  orderId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  productName: string;
  quantity: string;
  plan: string;           // "15 Days" | "30 Days" | "Custom (N Days)" | raw string
  totalDays: number;
  startDate: Date;
  endDate: Date;
  nextDelivery: Date;
  amount: number;
  status: "Active" | "Paused" | "Cancelled" | "Expired";
  remainingDays: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", default: null },
    userId:  { type: Schema.Types.ObjectId, ref: "User",  default: null },
    customerName:    { type: String, required: true, trim: true },
    customerPhone:   { type: String, required: true, trim: true },
    customerEmail:   { type: String, default: "" },
    customerAddress: { type: String, required: true },
    productName: { type: String, required: true },
    quantity:    { type: String, required: true },
    plan:        { type: String, required: true },
    totalDays:   { type: Number, required: true, min: 1 },
    startDate:   { type: Date,   required: true },
    endDate:     { type: Date,   required: true },
    nextDelivery:{ type: Date,   required: true },
    amount:      { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Active", "Paused", "Cancelled", "Expired"],
      default: "Active",
    },
    remainingDays: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

export default Subscription;
