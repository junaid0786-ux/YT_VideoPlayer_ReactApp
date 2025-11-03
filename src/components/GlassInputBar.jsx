import React from "react";
import { motion } from "framer-motion";
import { Play, Download } from "lucide-react";

const GlassInputBar = ({
  videoUrl,
  setVideoUrl,
  onLoadAndPlay,
  onDownload,
}) => {
  const handlePlayClick = () => {
    if (!videoUrl || !videoUrl.trim()) {
      alert("Please paste a valid YouTube URL.");
      return;
    }
    onLoadAndPlay(videoUrl.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-[850px] h-20 mb-8 flex items-center justify-between 
             px-5 py-2 rounded-full 
             backdrop-blur-2xl bg-white/10 border border-white/20
             shadow-[inset_2px_2px_10px_rgba(255,255,255,0.3),0_8px_30px_rgba(0,0,0,0.4)]"
    >
      <input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Paste YouTube video link here..."
        className="flex-1 bg-transparent text-white placeholder-white/60 outline-none px-3 text-lg"
      />

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePlayClick}
          className="relative w-12 h-12 rounded-full 
                     backdrop-blur-3xl bg-white/10 border border-white/30
                     shadow-[inset_1px_1px_8px_rgba(255,255,255,0.3),0_6px_25px_rgba(0,0,0,0.5)]
                     flex items-center justify-center text-white overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1/2 bg-linear-to-b from-white/40 to-transparent blur-md opacity-60"></div>
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-60 blur-sm"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <Play size={20} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDownload}
          className="relative w-12 h-12 rounded-full 
                     backdrop-blur-3xl bg-white/10 border border-white/30
                     shadow-[inset_1px_1px_8px_rgba(255,255,255,0.3),0_6px_25px_rgba(0,0,0,0.5)]
                     flex items-center justify-center text-white overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1/2 bg-linear-to-b from-white/40 to-transparent blur-md opacity-60"></div>
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-60 blur-sm"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <Download size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GlassInputBar;
