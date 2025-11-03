import React, { useRef, useState, useEffect } from "react";
import YouTube from "react-youtube";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import ControlBar from "./ControlBar";

const VideoPlayer = ({ url, ...rest }) => {
  const playerRef = useRef(null);
  const playerWrapperRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const getYouTubeVideoId = (fullUrl) => {
    if (!fullUrl) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = fullUrl.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };
  const videoId = getYouTubeVideoId(url);

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    const dur = playerRef.current.getDuration();
    if (dur > 0) setDuration(dur);
    playerRef.current.setVolume(volume * 100);
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
    setIsPlaying((p) => !p);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    const newVolume = volume > 0 ? 0 : 1;
    playerRef.current.setVolume(newVolume * 100);
    setVolume(newVolume);
  };

  const handleProgressSeek = (fraction) => {
    if (playerRef.current) {
      const seekTime = fraction * playerRef.current.getDuration();
      playerRef.current.seekTo(seekTime, true);
      setProgress(fraction * 100);
      setCurrentTime(seekTime);
    }
  };

  const handleSeek = (type, value) => {
    if (type === "volume" && playerRef.current) {
      playerRef.current.setVolume(value * 100);
      setVolume(value);
    }
  };

  const onPlayerStateChange = (event) => {
    if (event.data === 1) setIsPlaying(true);
    else if (event.data === 2) setIsPlaying(false);
  };

  useEffect(() => {
    let interval;
    if (isPlaying && playerRef.current) {
      interval = setInterval(() => {
        const current = playerRef.current.getCurrentTime();
        const total = playerRef.current.getDuration();
        setCurrentTime(current);
        setProgress((current / total) * 100);
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const playerOptions = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      fs: 0,
    },
  };

  if (!videoId) {
    return (
      <div className="relative w-[850px] h-[480px] bg-black rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-white/20 backdrop-blur-3xl">
        <div className="flex items-center justify-center h-full text-white text-xl">
          Paste a YouTube link in the input bar to begin playback.
        </div>
      </div>
    );
  }

  return (
    <div
      ref={playerWrapperRef}
      className="relative w-[850px] h-[480px] bg-black rounded-3xl overflow-hidden 
      shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-white/20 backdrop-blur-3xl"
    >
      <YouTube
        videoId={videoId}
        opts={playerOptions}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
        className="absolute inset-0"
      />

      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-10"
            onClick={togglePlay}
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="relative w-28 h-28 rounded-full backdrop-blur-3xl bg-white/10 border border-white/30
              shadow-[inset_2px_2px_10px_rgba(255,255,255,0.4),0_10px_40px_rgba(0,0,0,0.6)] flex items-center 
              justify-center text-white overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1/2 bg-linear-to-b from-white/40 to-transparent blur-xl opacity-70"></div>
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-70 blur-sm"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <Play size={50} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <ControlBar
        progress={progress}
        duration={duration}
        currentTime={currentTime}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        toggleMute={toggleMute}
        volume={volume}
        onSeek={handleSeek}
        onProgressSeek={handleProgressSeek}
        playerWrapperRef={playerWrapperRef}
      />
    </div>
  );
};

export default VideoPlayer;
