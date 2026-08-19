import mongoose from "mongoose";

type VehicleType = "bike" | "car" | "loading" | "auto" | "truck";

export interface IVehicle {
  owner: mongoose.Types.ObjectId;
  type: VehicleType;
  vehicleModel: string;
  number: string;
  imageUrl?: string;
  baseFare?: number;
  pricePerKM?: number;
  waitingCharge?: number;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new mongoose.Schema<IVehicle>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["bike", "car", "loading", "auto", "truck"],
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
    },
    baseFare: {
      type: Number,
    },
    pricePerKM: {
      type: Number,
    },
    waitingCharge: {
      type: Number,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    rejectionReason: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Vehicle =
  mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
