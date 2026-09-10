import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Booking from "@/models/booking.model";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }

    const partner = await User.findOne({ email: session.user.email });
    if (!partner) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const count = await Booking.countDocuments({
      driver: partner._id,
      bookingStatus: "requested",
    });
    return NextResponse.json(count, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `fetch pending requests count error ${error}` },
      { status: 500 },
    );
  }
}
