import React from 'react';
import { Compass, Gamepad, Music2, Film, Radio, Newspaper, Trophy, Lightbulb } from 'lucide-react';
import { VideoCard } from '../components/VideoCard';

const categories = [
  { icon: Compass, label: 'Trending', color: 'text-red-500' },
  { icon: Music2, label: 'Music', color: 'text-blue-500' },
  { icon: Gamepad, label: 'Gaming', color: 'text-green-500' },
  { icon: Film, label: 'Movies', color: 'text-purple-500' },
  { icon: Radio, label: 'Live', color: 'text-yellow-500' },
  { icon: Newspaper, label: 'News', color: 'text-orange-500' },
  { icon: Trophy, label: 'Sports', color: 'text-pink-500' },
  { icon: Lightbulb, label: 'Learning', color: 'text-indigo-500' },
];

const MOCK_TRENDING = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74',
    title: 'Top 10 Programming Languages in 2024',
    channelName: 'Tech Insights',
    channelAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
    views: 2500000,
    timestamp: Date.now() - 86400000,
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1707345512638-997d31a10eaa',
    title: 'The Future of AI: What to Expect',
    channelName: 'AI Daily',
    channelAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai',
    views: 1800000,
    timestamp: Date.now() - 172800000,
  },
];

export function Explore() {
  return (
    <main className="pt-14 pl-64">
      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {categories.map(({ icon: Icon, label, color }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Icon className={`w-8 h-8 ${color}`} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6">Trending</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MOCK_TRENDING.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      </div>
    </main>
  );
}