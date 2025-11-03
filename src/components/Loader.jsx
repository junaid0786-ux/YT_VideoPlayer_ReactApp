import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-linear-to-br from-gray-800 via-gray-900 to-black z-50">
      <motion.div
        className="relative w-40 h-40 rounded-full backdrop-blur-3xl bg-white/10 border border-white/30 
                   shadow-[inset_2px_2px_8px_rgba(255,255,255,0.4),0_8px_30px_rgba(0,0,0,0.6)]
                   overflow-hidden flex items-center justify-center"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent blur-md opacity-60"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute w-16 h-16 rounded-full bg-white/20 blur-lg"
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.h2
        className="mt-10 text-white/80 text-lg font-light tracking-widest"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        Loading your liquid player...
      </motion.h2>
    </div>
  );
};

export default Loader;
