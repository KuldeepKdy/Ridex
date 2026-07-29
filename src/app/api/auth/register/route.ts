import connectDB from "@/lib/db";
import { NextRequest } from "next/server";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import bycrypt from "bcryptjs";



export async function POST(req: NextRequest) {

    try {
        const { name, email, password } = await req.json();

        await connectDB();
        let user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({ message: "Email already exists" }, { status: 400 });
        }
        if (password.length < 6) {
          return NextResponse.json(
            { message: "Password must be at least 6 characters long" },
            { status: 400 },
          );
        }
        const hashedPassword = await bycrypt.hash(password, 10);

        user = await User.create({ name, email, password: hashedPassword });
        return NextResponse.json(user, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ message: `Register error ${error}` }, { status: 500 });
    }

}