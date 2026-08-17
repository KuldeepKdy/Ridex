import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import PartnerDashboard from "@/components/PartnerDashboard";
import PublicHome from "@/components/PublicHome";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import Image from "next/image";

export default async function Home() {
  await connectDB();
  const session = await auth();
  const user = await User.findOne({ email: session?.user?.email });
  return (
    <div className="w-full min-h-screen bg-white">
      <Nav />
      {user?.role == "partner" ? (
        <PartnerDashboard />
      ) : user?.role == "admin" ? (
        <AdminDashboard />
      ) : (
        <PublicHome />
      )}
      <Footer />
    </div>
  );
}
