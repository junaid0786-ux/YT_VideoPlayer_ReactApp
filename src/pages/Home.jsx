import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GlassInputBar from "../components/GlassInputBar";
import VideoPlayer from "../components/VideoPlayer";
import Loader from "../components/Loader";

const Home = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [shouldPlay, setShouldPlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [lastMouseMove, setLastMouseMove] = useState(Date.now());

  const normalizeYouTubeUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtu.be")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/watch?v=${videoId}`;
    } else if (url.includes("youtube.com/watch?v=")) {
      return url;
    } else if (url.includes("youtube.com/embed/")) {
      const videoId = url.split("embed/")[1].split("?")[0];
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
    return url;
  };

  const handleDownload = () =>
    alert("Download feature is disabled .");

  const handleLoadAndPlay = () => {
    if (
      videoUrl &&
      (videoUrl.includes("youtube.com") ||
        videoUrl.includes("youtu.be") ||
        videoUrl.includes("vimeo.com"))
    ) {
      setShouldPlay(true);
    } else {
      alert("Please paste a valid YouTube URL.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    setLastMouseMove(Date.now());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastMouseMove > 3000) {
        setShowControls(false);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [lastMouseMove]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-linear-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 z-50"
          >
            <Loader />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="z-10 flex flex-col items-center justify-center p-6 space-y-6"
          >
            <GlassInputBar
              videoUrl={videoUrl}
              setVideoUrl={setVideoUrl}
              onLoadAndPlay={handleLoadAndPlay}
              onDownload={handleDownload}
            />

            <div className="relative flex flex-col items-center justify-center">
              {shouldPlay && videoUrl ? (
                <VideoPlayer
                  url={normalizeYouTubeUrl(videoUrl)}
                  initialPlayState={shouldPlay}
                  setInitialPlayState={setShouldPlay}
                  showControls={showControls}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-white/60 text-lg mt-6"
                >
                  Paste a YouTube link above to start playing
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
