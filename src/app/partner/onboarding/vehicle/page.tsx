"use client";
import { ArrowLeft, Bike, Car, Package, Truck } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
const VEHICLES = [
  { id: "bike", label: "Bike", icon: Bike, desc: "2 wheeler" },
  { id: "auto", label: "Auto", icon: Car, desc: "3 wheeler ride" },
  { id: "car", label: "Car", icon: Car, desc: "4 wheeler ride" },
  { id: "loading", label: "Loading", icon: Package, desc: "Small goods" },
  { id: "truck", label: "Truck", icon: Truck, desc: "Heavy transport" },
];


function Page() {
    const router = useRouter();
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8"
      >
        <div className="relative text-center">
          <button className="absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition">
            <ArrowLeft onClick={()=> router.back()} size={18} />
          </button>
          <p className="">
            step 1 of 3
          </p>
          <h1 className="text-2xl font-bold mt-1">
            Vehicle Details
          </h1>
          <p  className="text-sm text-gray-500 mt-2">
            Add your vehicle information
          </p>
        </div>
        <div className="mt-8 space-y-6">
            <div>
                <p className="text-xs font-semibold text-gray-500 mb-3"> Vehicle Type</p>
            </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Page;
