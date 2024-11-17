import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/auth';
import { VideoCard } from '../components/VideoCard';
import { Users } from 'lucide-react';

export function Subscriptions() {
  const { user } = useAuthStore();

  const { data: subscriptions, isLoading: loadingSubscriptions } = useQuery({
    queryKey: ['subscriptions', user?.uid],
    queryFn: async () => {
      if (!user) return [];
      
      const q = query(
        collection(db, 'subscriptions'),
        where('subscriberId', '==', user.uid)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data());
    },
    enabled: !!user,
  });

  const { data: videos, isLoading: loadingVideos } = useQuery({
    queryKey: ['subscriptionVideos', subscriptions],
    queryFn: async () => {
      if (!subscriptions?.length) return [];
      
      const channelIds = subscriptions.map(sub => sub.channelId);
      const q = query(
        collection(db, 'videos'),
        where('userId', 'in', channelIds)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!subscriptions?.length,
  });

  if (!user) {
    return (
      <main className="pt-14 pl-64">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-3.5rem)]">
          <Users className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Don't miss new videos</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to see updates from your favorite YouTube channels
          </p>
        </div>
      </main>
    );
  }

  const isLoading = loadingSubscriptions || loadingVideos;

  return (
    <main className="pt-14 pl-64">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>
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
        ) : videos?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-medium mb-2">No videos from subscriptions</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Subscribe to channels to see their latest videos here
            </p>
          </div>
        )}
      </div>
    </main>
  );
}