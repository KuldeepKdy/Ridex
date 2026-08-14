import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

const VEHICLE_REGEX = /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,2}[0-9]{4}$/;
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.email) {
      return  Response.json("Unauthorized", { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return  Response.json("User not found", { status: 400 });
    }
    const { type, number, vehicleModel } = await req.json();
    if (!type || !number || !vehicleModel) {
      return  Response.json("Missing required details", { status: 400 });
    }

    if (!VEHICLE_REGEX.test(number)) {
      return  Response.json("Invalid Vehicle Number Format", { status: 400 });
    }

    const vehicleNumber = number.toUpperCase();

    const duplicate = await Vehicle.findOne({ number: vehicleNumber });
    if (duplicate) {
      return  Response.json("Vehicle already registered ", { status: 400 });
    }

    let vehicle = await Vehicle.findOne({ owner: user._id });
    if (vehicle) {
      vehicle.type = type;
      vehicle.number = vehicleNumber;
      vehicle.vehicleModel = vehicleModel;
      vehicle.status = "pending";
      await vehicle.save();
      return Response.json(vehicle, { status: 200 });
    }
    vehicle = await Vehicle.create({
      owner: user._id,
      type,
      number: vehicleNumber,
      vehicleModel,
    });
    if (user.partnerOnBoardingSteps < 1) {
      user.partnerOnBoardingSteps = 1;
    }
    user.role = "partner";
    await user.save();
    return Response.json(vehicle, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: `vehicle error ${error}` },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.email) {
      return Response.json("Unauthorized", { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json("User not found", { status: 400 });
    }

    const vehicle = await Vehicle.findOne({ owner: user._id });

    if (vehicle) {
      return new Response(vehicle, { status: 201 });
    } else {
      return null;
    }
  } catch (error) {
    return Response.json(
      { message: `get vehicle error ${error}` },
      { status: 500 },
    );
  }
}
