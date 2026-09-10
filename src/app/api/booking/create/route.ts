import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import User from "@/models/user.model";
import Booking from "@/models/booking.model";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const {
      driverId,
      vehicleId,
      pickUpLocation,
      dropLocation,
      pickUpAddress,
      dropAddress,
      fare,
      mobileNumber,
    } = await req.json();

    if (
      !driverId ||
      !vehicleId ||
      !pickUpLocation.coordinates ||
      !dropLocation.coordinates
    ) {
      return NextResponse.json(
        { message: "missing required details" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email: session.user.email });

    const driver = await User.findById(driverId);
    if (!driver) {
      return NextResponse.json(
        { message: "driver not found" },
        { status: 400 },
      );
    }
    const existing = await Booking.findOne({
      user: user._id,
      bookingStatus: {
        $in: ["requested", "awaiting_payment", "confirmed", "started"],
      },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    const booking = await Booking.create({
      user: user._id,
      driver,
      vehicle: vehicleId,
      pickUpAddress,
      dropAddress,
      pickUpLocation,
      dropLocation,
      fare,
      userMobileNumber: mobileNumber,
      driverMobileNumber: driver.mobileNumber,
      bookingStatus: "requested",
    });
    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `create booking error ${error}` },
      { status: 500 },
    );
  }
}
