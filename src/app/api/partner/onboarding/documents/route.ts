import { auth } from "@/auth";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.email) {
      return new Response("Unauthorized", { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response("User not found", { status: 400 });
    }

    const formData = await req.formData();
    const aadhar = formData.get("aadhar") as Blob | null;
    const license = formData.get("drivingLicense") as Blob | null;
    const rc = formData.get("vehicleRC") as Blob | null;

    if (!aadhar || !license || !rc) {
      return Response.json(
        { message: `all documents are required` },
        { status: 400 },
      );
    }

    const updatePayload: any = {
      status: "pending",
    };

    if (aadhar) {
      const url = await uploadOnCloudinary(aadhar);
      if (!url) {
        return Response.json(
          { message: `aadhar upload failed` },
          { status: 500 },
        );
      }
      updatePayload.aadharUrl = url;
    }
    if (license) {
      const url = await uploadOnCloudinary(license);
      if (!url) {
        return Response.json(
          { message: `driving license upload failed` },
          { status: 500 },
        );
      }
      updatePayload.licenseUrl = url;
    }
    if (rc) {
      const url = await uploadOnCloudinary(rc);
      if (!url) {
        return Response.json(
          { message: `vehicle rc upload failed` },
          { status: 500 },
        );
      }
      updatePayload.rcUrl = url;
    }

    const partnerDocs = await PartnerDocs.findOneAndUpdate(
      { owner: user._id },
      { $set: updatePayload },
      { upsert: true, new: true },
    );
    if (user.partnerOnBoardingSteps < 2) {
      user.partnerOnBoardingSteps = 2;
    }

    await user.save();
    return Response.json(partnerDocs, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: `partner docs error ${error}` },
      { status: 500 },
    );
  }
}
