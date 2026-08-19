import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  orderId: string;          // Human-readable: BRN-XXXXXX
  userId?: mongoose.Types.ObjectId;  // Optional — guest orders allowed
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  productId?: mongoose.Types.ObjectId;
  productName: string;
  quantity: string;
  plan?: string;            // Daily / Weekly / Monthly / Custom
  startDate?: string;       // ISO date string
  subscription?: string;
  orderType: "subscription" | "one-time";
  amount: number;           // Grand total
  deliveryCharge: number;
  subtotal: number;         // amount - deliveryCharge
  status: "Pending" | "Confirmed" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, "Customer phone is required"],
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      default: "",
    },
    customerAddress: {
      type: String,
      required: [true, "Customer address is required"],
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      default: null,
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
      default: "",
    },
    startDate: {
      type: String,
      default: "",
    },
    subscription: {
      type: String,
      default: "None",
    },
    orderType: {
      type: String,
      enum: ["subscription", "one-time"],
      default: "subscription",
    },
    amount: {
      type: Number,
      required: [true, "Order amount is required"],
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
