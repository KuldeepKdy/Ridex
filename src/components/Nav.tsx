"use client"
import React from 'react'
import {motion} from "motion/react";

function Nav() {
  return (
    <motion.div initial={{ y: -60 , opacity: 0 }} animate={{ y:0 , opacity: 1 }} className="fixed top-3 left-0 right-1/2 -translate-x-1/2 z-50 flex items-center justify-between h-16 px-4 bg-white shadow-md">

    </motion.div>
  )
}

export default Nav