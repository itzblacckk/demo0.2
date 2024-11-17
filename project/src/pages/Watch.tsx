import React from 'react';
import { useParams } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Share2, Flag } from 'lucide-react';
import { CommentSection } from '../components/CommentSection';
import { RelatedVideos } from '../components/RelatedVideos';

export function Watch() {
  const { id } = useParams();
  
  // Mock video data (replace with real data fetching)
  const video = {
    id,
    title: 'Building a YouTube Clone with React, TypeScript, and Firebase',
    views: 1500000,
    likes: 25000,
    timestamp: Date.now() - 86400000,
    channelName: 'Code Masters',
    channelAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    subscribers: 100000,
    description: 'Learn how to build a YouTube clone using React, TypeScript, and Firebase. We\'ll cover authentication, video upload, real-time comments, and more.',
  };

  return (
    <main className="pt-14 pl-64">
      <div className="max-w-[1800px] mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
              <video
                src={`https://storage.googleapis.com/your-tube/${id}.mp4`}
                poster="https://images.unsplash.com/photo-1707343843437-caacff5cfa74"
                controls
                className="w-full h-full"
              />
            </div>

            {/* Video Info */}
            <div className="mt-4">
              <h1 className="text-xl font-semibold">{video.title}</h1>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={video.channelAvatar}
                    alt={video.channelName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{video.channelName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {video.subscribers.toLocaleString()} subscribers
                    </p>
                  </div>
                  <button className="ml-4 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                    Subscribe
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <ThumbsUp className="w-5 h-5" />
                    <span>{video.likes.toLocaleString()}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <ThumbsDown className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                    <Flag className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <p className="whitespace-pre-wrap">{video.description}</p>
              </div>

              {/* Comments Section */}
              <CommentSection videoId={id!} />
            </div>
          </div>

          {/* Related Videos */}
          <div className="space-y-4">
            <h2 className="font-medium text-lg">Related Videos</h2>
            <RelatedVideos currentVideoId={id!} />
          </div>
        </div>
      </div>
    </main>
  );
}