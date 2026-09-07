import { IVehicle } from "@/models/vehicle.model";
import { motion } from "motion/react";

function VehicleCard({
  vehicle,
  distance,
}: {
  vehicle: IVehicle;
  distance: number | undefined;
}) {
  return <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ y: -6 }}
  transition={{ duration: 0.28 , ease: [0.22, 1, 0.36, 1] }}
  className="relative bg-white border border-zinc-200 rounded-3xl"
   >
    <div className="relative h-48 bg-zinc-50 flex items-center justify-center overflow-hidden">

    </div>
  </motion.div>;
}

export default VehicleCard;