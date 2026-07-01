import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDelivery extends Document {
  orderId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  customerAddress: string;
  productName: string;
  status: "Pending" | "Out for Delivery" | "Completed";
  driverId?: mongoose.Types.ObjectId;
  driverName: string;
  time: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DeliverySchema = new Schema<IDelivery>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order ID is required"],
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer ID is required"],
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
    },
    customerAddress: {
      type: String,
      required: [true, "Customer address is required"],
    },
    productName: {
      type: String,
      required: [true, "Product name is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Out for Delivery", "Completed"],
      default: "Pending",
    },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    driverName: {
      type: String,
      default: "Unassigned",
    },
    time: {
      type: String,
      required: [true, "Delivery time is required"],
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

const Delivery: Model<IDelivery> = mongoose.models.Delivery || mongoose.model<IDelivery>("Delivery", DeliverySchema);

export default Delivery;
