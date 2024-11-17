import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/auth';
import { VideoCard } from '../components/VideoCard';
import { ThumbsUp } from 'lucide-react';

export function Liked() {
  const { user } = useAuthStore();

  const { data: likedVideos, isLoading } = useQuery({
    queryKey: ['likedVideos', user?.uid],
    queryFn: async () => {
      if (!user) return [];
      
      const q = query(
        collection(db, 'likes'),
        where('userId', '==', user.uid)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data());
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <main className="pt-14 pl-64">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-3.5rem)]">
          <ThumbsUp className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Keep track of videos you like</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to access your liked videos
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-14 pl-64">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Liked Videos</h1>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : likedVideos?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {likedVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ThumbsUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-medium mb-2">No liked videos yet</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Videos that you like will be shown here
            </p>
          </div>
        )}
      </div>
    </main>
  );
}