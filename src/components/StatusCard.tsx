"use client";
import { motion } from "motion/react";

function StatusCard({ icon, title, desc }: any) {
  return (
    <motion.div
      intial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 shadow-lg border flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center"
    >
      <div className="bg-black text-white p-3 md:p-4 rounded-xl shrink-0">
        {icon}
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-base sm:text-lg md:text-xl font-semibold">{title}</p>
        <p className="text-gray-600 text-sm sm:text-base mt-1">{desc}</p>
      </div>
    </motion.div>
  );
}

export default StatusCard;
