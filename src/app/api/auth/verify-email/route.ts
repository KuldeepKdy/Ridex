import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    if (!email && !otp) {
        return NextResponse.json({ message: "Email and OTP is Required" }, { status: 404 });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }


    if(user.isEmailVerified) {
        return NextResponse.json({ message: "Email already verified" }, { status: 400 });
    }

    if(!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
        return NextResponse.json({ message: "OTP has expired" }, { status: 400 });

    }

    if(!user.otp || user.otp !== otp) {
        return NextResponse.json({ message: "OTP is incorrect" }, { status: 400 });
    }
  

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    
    await user.save();

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Verify email error ${error}` },
      { status: 500 },
    );
  }
}