import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInventory extends Document {
  productId: mongoose.Types.ObjectId;
  productName: string;
  stock: number;
  unit: string;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema<IInventory>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    productName: {
      type: String,
      required: [true, "Product name is required"],
    },
    stock: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Inventory: Model<IInventory> = mongoose.models.Inventory || mongoose.model<IInventory>("Inventory", InventorySchema);

export default Inventory;
