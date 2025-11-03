import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ControlBar = ({
  progress,
  duration,
  currentTime,
  isPlaying,
  togglePlay,
  toggleMute,
  volume,
  onSeek,
  onProgressSeek,
  playerWrapperRef,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const isMuted = volume === 0;

  useEffect(() => {
    let timeout;

    const handleMouseMove = () => {
      setIsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsVisible(false), 2500);
    };

    const attachListeners = (target) => {
      if (!target) return;
      target.addEventListener("mousemove", handleMouseMove);
    };

    const detachListeners = (target) => {
      if (!target) return;
      target.removeEventListener("mousemove", handleMouseMove);
    };

    let player = playerWrapperRef?.current;
    attachListeners(player);

    const handleFullscreenChange = () => {
      const fsElement = document.fullscreenElement;
      detachListeners(player);
      player = fsElement || playerWrapperRef?.current;
      attachListeners(player);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      detachListeners(player);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      clearTimeout(timeout);
    };
  }, [playerWrapperRef]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleFullscreen = () => {
    if (!document.fullscreenElement && playerWrapperRef?.current) {
      playerWrapperRef.current.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
  };

  const handleSeek = (e) => {
    if (!onProgressSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const seekFraction = (e.clientX - rect.left) / rect.width;
    onProgressSeek(seekFraction);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="controlbar"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="
            absolute bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[900px]
            px-6 py-5 rounded-[1.75rem] backdrop-blur-3xl
            bg-linear-to-br from-white/20 via-white/10 to-transparent
            border border-white/25 
            shadow-[inset_2px_2px_12px_rgba(255,255,255,0.25),0_8px_40px_rgba(0,0,0,0.8)]
            flex flex-col space-y-4 text-white select-none z-50
          "
          style={{
            boxShadow:
              "0 8px 60px rgba(0,0,0,0.7), inset 0 4px 10px rgba(255,255,255,0.3)",
          }}
        >
          <div
            className="relative w-full h-2 bg-white/15 rounded-full overflow-hidden cursor-pointer group"
            onClick={handleSeek}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
              <div className="absolute inset-0 bg-linear-to-r from-cyan-400/20 via-blue-400/10 to-purple-500/20 blur-lg animate-[ripple_2.5s_infinite_linear]" />
              <div className="absolute inset-0 bg-linear-to-r from-cyan-400/15 via-blue-400/10 to-purple-500/15 blur-md animate-[ripple_3.5s_infinite_reverse_linear]" />
            </div>

            <div
              style={{ width: `${progress}%` }}
              className="absolute top-0 left-0 h-full rounded-full 
              bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600
              shadow-[0_0_25px_rgba(0,200,255,0.7)] transition-all duration-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <motion.button
                onClick={togglePlay}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 flex items-center justify-center rounded-full 
                bg-white/10 border border-white/30 backdrop-blur-lg
                hover:bg-white/20 hover:shadow-[0_0_25px_rgba(0,200,255,0.6)]
                shadow-[inset_2px_2px_8px_rgba(255,255,255,0.25),0_4px_20px_rgba(0,0,0,0.6)]
                transition-all duration-200"
              >
                {isPlaying ? <Pause size={22} /> : <Play size={22} />}
              </motion.button>

              <motion.button
                onClick={toggleMute}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 flex items-center justify-center rounded-full 
                bg-white/10 border border-white/30 backdrop-blur-lg
                hover:bg-white/20 hover:shadow-[0_0_25px_rgba(0,200,255,0.6)]
                shadow-[inset_2px_2px_8px_rgba(255,255,255,0.25),0_4px_20px_rgba(0,0,0,0.6)]
                transition-all duration-200"
              >
                {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </motion.button>

              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => onSeek("volume", parseFloat(e.target.value))}
                  className="
                    w-32 accent-cyan-400 cursor-pointer
                    appearance-none h-1 rounded-full bg-white/20
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-linear-to-r 
                    [&::-webkit-slider-thumb]:from-cyan-400 
                    [&::-webkit-slider-thumb]:to-blue-500 
                    [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,200,255,0.7)]
                    transition-all"
                />
                <span className="text-sm text-gray-200 font-light min-w-[90px]">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 flex items-center justify-center rounded-full 
                bg-white/10 border border-white/30 backdrop-blur-lg
                hover:bg-white/20 hover:shadow-[0_0_25px_rgba(0,200,255,0.6)]
                shadow-[inset_2px_2px_8px_rgba(255,255,255,0.25),0_4px_20px_rgba(0,0,0,0.6)]
                transition-all duration-200"
              >
                <Settings size={20} />
              </motion.button>

              <motion.button
                onClick={handleFullscreen}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 flex items-center justify-center rounded-full 
                bg-white/10 border border-white/30 backdrop-blur-lg
                hover:bg-white/20 hover:shadow-[0_0_25px_rgba(0,200,255,0.6)]
                shadow-[inset_2px_2px_8px_rgba(255,255,255,0.25),0_4px_20px_rgba(0,0,0,0.6)]
                transition-all duration-200"
              >
                {isFullscreen ? (
                  <Minimize2 size={22} />
                ) : (
                  <Maximize2 size={22} />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ControlBar;

const style = document.createElement("style");
style.innerHTML = `
@keyframes ripple {
  0% { transform: translateX(-100%); opacity: 0.3; }
  50% { opacity: 0.6; }
  100% { transform: translateX(100%); opacity: 0.3; }
}
`;
document.head.appendChild(style);
