import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.email || session.user?.role !== "admin") {
      return Response.json("Unauthorized", { status: 400 });
    }

    const partner = await User.find({
      role: "partner",
      partnerOnBoardingSteps: 4,
      videoKycStatus: { $in: ["pending", "in_progress"] },
    });

    return Response.json(partner, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `partner Kyc get error ${error}` },
      { status: 500 },
    );
  }
}
