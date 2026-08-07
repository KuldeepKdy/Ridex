import connectDB from "@/lib/db";
import {auth} from "@/auth";
import User from "@/models/user.model";

export async function GET(req: Request) {
  try{
    await connectDB();
    const session = await auth();
    if(!session || !session.user) {
      return new Response(JSON.stringify({message: "User not authenticated"}), {status: 400});
    }

    const user = await User.findOne({email: session.user.email});
    if(!user) {
      return new Response(JSON.stringify({message: "User not found"}), {status: 400});
    }

    return new Response(JSON.stringify(user), {status: 200});
  }catch (error) {
    return new Response(JSON.stringify({message: `Internal server error: ${error}`}), {status: 500});
  }
}