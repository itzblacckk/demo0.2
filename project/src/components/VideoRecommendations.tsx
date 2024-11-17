import React from 'react';
import { VideoCard } from './VideoCard';
import { useRecommendations } from '../hooks/useRecommendations';

interface VideoRecommendationsProps {
  videoId: string;
  tags?: string[];
}

export function VideoRecommendations({ videoId, tags = [] }: VideoRecommendationsProps) {
  const { data: recommendations, isLoading } = useRecommendations(videoId, tags);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations?.map((video) => (
        <VideoCard key={video.id} {...video} layout="horizontal" />
      ))}
    </div>
  );
}