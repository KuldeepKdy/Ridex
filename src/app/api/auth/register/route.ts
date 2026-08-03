import connectDB from "@/lib/db";
import { NextRequest } from "next/server";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import bycrypt from "bcryptjs";
import {sendMail}from "@/lib/sendMail";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    await connectDB();
    let user = await User.findOne({ email });
    if (user && user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 },
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }
    const hashedPassword = await bycrypt.hash(password, 10);

    if (user && !user.isEmailVerified) {
      user.name = name;
      user.password = hashedPassword;
      user.email = email;
      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiresAt,
      });
    }

    await sendMail(
      email,
      "Verify your Email",
      `<h2>OTP for email verification is <strong>${otp}</strong></h2>
         <p>This OTP will expire in 10 minutes.</p>`,
    );

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: `Register error ${error}` },
      { status: 500 },
    );
  }
}
