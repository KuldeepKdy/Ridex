import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Vehicle from "@/models/vehicle.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.email || session.user?.role !== "admin") {
      return Response.json("Unauthorized", { status: 400 });
    }

    const vehicleId = (await context.params).id;
    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return Response.json({ message: "Vehicle not found" }, { status: 400 });
    }

    vehicle.status = "approved";
    vehicle.rejectionReason = undefined;
    await vehicle.save();

    const partner = await User.findById(vehicle.owner);
    if (!partner) {
      return Response.json({ message: "Partner not found" }, { status: 400 });
    }

    partner.partnerOnBoardingSteps = 7;
    await partner.save();

    return Response.json(vehicle, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `vehicle approved error ${error}` },
      { status: 500 },
    );
  }
}
