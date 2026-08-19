import mongoose from "mongoose";

export interface IPartnerDocs {
  owner: mongoose.Types.ObjectId;
  aadharUrl: string;
  rcUrl: string;
  licenseUrl: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const partnerDocsSchema = new mongoose.Schema<IPartnerDocs>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    aadharUrl: {
      type: String,
      required: true,
    },
    rcUrl: {
      type: String,
      required: true,
    },
    licenseUrl: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    rejectionReason: {
      type: String,
    },
  },
  { timestamps: true },
);

const PartnerDocs =
  mongoose.models.PartnerDocs ||
  mongoose.model("PartnerDocs", partnerDocsSchema);

export default PartnerDocs;
