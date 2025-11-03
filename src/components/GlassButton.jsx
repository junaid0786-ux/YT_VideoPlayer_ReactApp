import React from "react";
import { motion } from "framer-motion";

const GlassButton = ({ onClick, icon }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="w-14 h-14 rounded-full backdrop-blur-3xl bg-white/10 border border-white/20 
                 shadow-[inset_2px_2px_6px_rgba(255,255,255,0.4),0_6px_20px_rgba(0,0,0,0.6)] 
                 flex items-center justify-center text-white hover:bg-white/20 transition"
    >
      {icon}
    </motion.button>
  );
};

export default GlassButton;
