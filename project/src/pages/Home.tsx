import React from 'react';
import { VideoCard } from '../components/VideoCard';

const MOCK_VIDEOS = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74',
    title: 'Building a YouTube Clone with React, TypeScript, and Firebase',
    channelName: 'Code Masters',
    channelAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    views: 1500000,
    timestamp: Date.now() - 86400000,
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1707345512638-997d31a10eaa',
    title: 'Advanced TypeScript Features You Need to Know',
    channelName: 'TypeScript Pro',
    channelAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    views: 750000,
    timestamp: Date.now() - 172800000,
  },
  {
    id: '3',
    thumbnail: 'https://images.unsplash.com/photo-1707237032161-521a4ccd092d',
    title: 'Mastering Tailwind CSS: From Basics to Advanced',
    channelName: 'Design Guru',
    channelAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    views: 250000,
    timestamp: Date.now() - 259200000,
  },
];

export function Home() {
  return (
    <main className="pt-14 pl-64">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MOCK_VIDEOS.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      </div>
    </main>
  );
}