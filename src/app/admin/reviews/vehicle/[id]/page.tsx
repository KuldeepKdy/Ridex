"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { VehicleType } from "@/models/vehicle.model";
import { IUser } from "@/models/user.model";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  ImageIcon,
  IndianRupee,
  ShieldCheck,
  Truck,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import AnimatedCard from "@/components/AnimatedCard";

interface IVehicle {
  owner: IUser;
  type: VehicleType;
  vehicleModel: string;
  number: string;
  imageUrl?: string;
  baseFare?: number;
  pricePerKM?: number;
  waitingCharge?: number;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function Page() {
  const { id } = useParams();
  const [data, setData] = useState<IVehicle | null>(null);
  const router = useRouter();
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  useEffect(() => {
    const load = async () => {
      try {
        const result = await axios.get(`/api/admin/reviews/vehicle/${id}`);
        setData(result.data);
      } catch (error: any) {
        console.log(error.response.data.message ?? error);
      }
    };
    load();
  }, [id]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 ">
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <div className="font-semibold text-lg">{data?.owner?.name}</div>
            <div className="text-sm text-gray-500">{data?.email}</div>
          </div>
          {data?.status === "approved" ? (
            <div className="px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 bg-green-100 text-green-700">
              <CheckCircle size={14} />
              Approved
            </div>
          ) : data?.status === "rejected" ? (
            <div className="px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 bg-red-100 text-red-700">
              <XCircle size={14} />
              Rejected
            </div>
          ) : (
            <div className="px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 bg-yellow-100 text-yellow-700">
              <Clock size={14} />
              Pending
            </div>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl overflow-hidden shadow-xl bg-white "
        >
          {data?.imageUrl ? (
            <img
              src={data?.imageUrl}
              alt="vehicle image"
              className="w-full h-[450px] object-cover"
            />
          ) : (
            <div className="h-[450px] grid place-items-center text-gray-300">
              <ImageIcon size={25} />
            </div>
          )}
        </motion.div>
        <div className="space-y-8">
          <AnimatedCard title="Vehicle Details" icon={<Truck size={18} />}>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vehicle Type</span>
              <span className="font-semibold">{data?.type || "-"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Registration Number</span>
              <span className="font-semibold">{data?.number || "-"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Model</span>
              <span className="font-semibold">{data?.vehicleModel || "-"}</span>
            </div>
          </AnimatedCard>
          <AnimatedCard
            title="Pricing Configuration"
            icon={<IndianRupee size={18} />}
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Base Fare</span>
              <span className="font-semibold flex  items-center">
                <IndianRupee size={13} />
                {data?.baseFare || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Price Per KM</span>
              <span className="font-semibold flex  items-center">
                <IndianRupee size={13} />
                {data?.pricePerKM || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Waiting Charge</span>
              <span className="font-semibold flex items-center">
                <IndianRupee size={13} />
                {data?.waitingCharge || 0}
              </span>
            </div>
          </AnimatedCard>
          {data?.status === "pending" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] p-8 shadow-xl space-y-6"
            >
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck size={18} />
                Admin Check
              </div>
              <p className="text-sm text-gray-500">
                Verify documents carefully before approving.
              </p>
              <div className="flex flex-col gap-4 ">
                <button
                  onClick={() => setShowApprove(true)}
                  className="py-3 rounded-2xl bg-linear-to-r from-black to-gray-800 text-white font-semibold hover:opacity-90 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => setShowReject(true)}
                  className="py-3 rounded-2xl border font-semibold hover:bg-gray-100 transition"
                >
                  Reject
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Page;
