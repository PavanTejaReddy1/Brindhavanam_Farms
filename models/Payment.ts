import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  customerName: string;
  amount: number;
  status: "Pending" | "Successful" | "Failed" | "Refunded";
  transactionId: string;
  method: "UPI" | "Card" | "Cash" | "Wallet";
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order ID is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Successful", "Failed", "Refunded"],
      default: "Pending",
    },
    transactionId: {
      type: String,
      required: [true, "Transaction ID is required"],
    },
    method: {
      type: String,
      enum: ["UPI", "Card", "Cash", "Wallet"],
      required: [true, "Payment method is required"],
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

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
