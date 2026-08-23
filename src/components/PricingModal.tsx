"use client";

import { IVehicle } from "@/models/vehicle.model";
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

function PricingModal({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: (a: boolean) => void;
  data: IVehicle | null;
}) {

    const [image, setImage] = useState<File | null>(null);
    const [preview , setPreview] = useState<string | null>(null);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Pricing and Vehicle Image</h2>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PricingModal;
