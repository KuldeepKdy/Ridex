import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.email || session.user?.role !== "admin") {
      return Response.json("Unauthorized", { status: 400 });
    }

    const { roomId, action, reason } = await req.json();
    if (!roomId) {
      return Response.json({ message: "roomId is required" }, { status: 400 });
    }

    if (!["approved", "rejected"].includes(action)) {
      return Response.json({ message: "Invalid action" }, { status: 400 });
    }

    const partner = await User.findOne({
      videoKycRoomId: roomId,
      role: "partner",
    });
    if (!partner) {
      return Response.json({ message: "Partner not found" }, { status: 400 });
    }

    if (action === "approved") {
      partner.videoKycStatus = "approved";
      partner.videoKycRejectionReason = undefined;
      partner.partnerOnBoardingSteps = 5;
    }

    if (action === "rejected") {
      if (!reason) {
        return Response.json(
          { message: "Rejection Reason is required" },
          { status: 400 },
        );
      }
      partner.videoKycStatus = "rejected";
      partner.videoKycRejectionReason = reason.trim();
    }
    await partner.save();

    return Response.json(
      { message: "Partner video kyc status updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { message: `partner video kyc status update error ${error}` },
      { status: 500 },
    );
  }
}
