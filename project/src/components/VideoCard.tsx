import React from 'react';
import { Link } from 'react-router-dom';

interface VideoCardProps {
  id: string;
  thumbnail: string;
  title: string;
  channelName: string;
  channelAvatar: string;
  views: number;
  timestamp: number;
  layout?: 'grid' | 'horizontal';
}

export function VideoCard({
  id,
  thumbnail,
  title,
  channelName,
  channelAvatar,
  views,
  timestamp,
  layout = 'grid',
}: VideoCardProps) {
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views;
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  };

  if (layout === 'horizontal') {
    return (
      <Link to={`/watch/${id}`} className="flex gap-4 group">
        <div className="relative w-64 aspect-video rounded-xl overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold line-clamp-2 mb-1">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <img
              src={channelAvatar}
              alt={channelName}
              className="w-6 h-6 rounded-full"
            />
            <span>{channelName}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {formatViews(views)} views • {formatTimestamp(timestamp)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <div className="group">
      <Link to={`/watch/${id}`} className="block">
        <div className="relative aspect-video rounded-xl overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="mt-3 flex gap-3">
          <img
            src={channelAvatar}
            alt={channelName}
            className="w-9 h-9 rounded-full"
          />
          <div>
            <h3 className="font-semibold line-clamp-2">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{channelName}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatViews(views)} views • {formatTimestamp(timestamp)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}