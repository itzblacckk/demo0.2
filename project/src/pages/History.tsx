import React from 'react';
import { History as HistoryIcon } from 'lucide-react';
import { VideoCard } from '../components/VideoCard';
import { useHistory } from '../hooks/useHistory';
import { useAuthStore } from '../store/auth';

export function History() {
  const { user } = useAuthStore();
  const { history, isLoading } = useHistory();

  if (!user) {
    return (
      <main className="pt-14 pl-64">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-3.5rem)]">
          <HistoryIcon className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Keep track of what you watch</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to access your watch history
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-14 pl-64">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Watch History</h1>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex gap-4">
                  <div className="w-64 aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : history?.length ? (
          <div className="space-y-4">
            {history.map((video) => (
              <VideoCard key={video.id} {...video} layout="horizontal" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <HistoryIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-medium mb-2">No watch history</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Videos you watch will appear here
            </p>
          </div>
        )}
      </div>
    </main>
  );
}