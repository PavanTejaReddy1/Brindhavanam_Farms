import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  image: string;
  galleryImages: string[];
  variants: Array<{
    id: string;
    label: string;
    pricePerDay: number;
  }>;
  stock: number;
  stockStatus: "in_stock" | "out_of_stock" | "low_stock";
  featured: boolean;
  active: boolean;
  freshnessBadge: string;
  availability: string;
  deliveryTime: string;
  deliveryCharges: number;
  displayPrice: string;
  sizes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    shortDescription: {
      type: String,
      required: [true, "Product short description is required"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      default: "dairy",
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
      default: "",
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    variants: {
      type: [{
        id: String,
        label: String,
        pricePerDay: Number,
      }],
      required: [true, "Product variants are required"],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      default: 100,
    },
    stockStatus: {
      type: String,
      enum: ["in_stock", "out_of_stock", "low_stock"],
      default: "in_stock",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    freshnessBadge: {
      type: String,
      default: "",
    },
    availability: {
      type: String,
      default: "In Stock",
    },
    deliveryTime: {
      type: String,
      default: "Daily Morning · 5 AM – 7 AM",
    },
    deliveryCharges: {
      type: Number,
      default: 0,
    },
    displayPrice: {
      type: String,
      default: "",
    },
    sizes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
