import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  videoId: string;
  isLive?: boolean;
  onTimeUpdate?: (time: number) => void;
}

export function VideoPlayer({ videoId, isLive, onTimeUpdate }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isLive && Hls.isSupported()) {
      hlsRef.current = new Hls();
      hlsRef.current.loadSource(`http://localhost:8000/live/${videoId}.m3u8`);
      hlsRef.current.attachMedia(video);
    } else {
      video.src = `http://localhost:3000/api/videos/${videoId}/stream`;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [videoId, isLive]);

  return (
    <video
      ref={videoRef}
      className="w-full aspect-video bg-black rounded-xl"
      poster={`http://localhost:3000/api/videos/${videoId}/thumbnail`}
      controls
      playsInline
      onTimeUpdate={() => {
        if (onTimeUpdate && videoRef.current) {
          onTimeUpdate(videoRef.current.currentTime);
        }
      }}
    />
  );
}