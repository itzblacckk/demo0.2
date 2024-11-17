import React from 'react';
import { VideoCard } from './VideoCard';
import { useRelatedVideos } from '../hooks/useRelatedVideos';

interface RelatedVideosProps {
  currentVideoId: string;
}

export function RelatedVideos({ currentVideoId }: RelatedVideosProps) {
  const { videos, loading } = useRelatedVideos(currentVideoId);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl mb-2" />
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <div key={video.id} className="flex gap-2">
          <div className="flex-1">
            <VideoCard {...video} compact />
          </div>
        </div>
      ))}
    </div>
  );
}