import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Settings, Edit3, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { VideoCard } from '../components/VideoCard';
import { useUserVideos } from '../hooks/useUserVideos';
import { ChannelCustomization } from '../components/ChannelCustomization';
import { auth } from '../lib/firebase';

export function Profile() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showCustomization, setShowCustomization] = useState(false);
  const { videos, isLoading } = useUserVideos(user?.uid);
  const [activeTab, setActiveTab] = useState<'videos' | 'about'>('videos');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <main className="pt-14 pl-64">
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-500">
        <button className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70">
          <Camera className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="flex items-end justify-between -mt-8 mb-8">
          <div className="flex items-end gap-6">
            <img
              src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
              alt={user.displayName || 'User'}
              className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900"
            />
            <div>
              <h1 className="text-3xl font-bold mb-1">{user.displayName || 'Anonymous'}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {videos?.length || 0} videos • {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCustomization(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Settings className="w-4 h-4" />
              <span>Customize channel</span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 font-medium border-b-2 -mb-px ${
                activeTab === 'videos'
                  ? 'border-black dark:border-white'
                  : 'border-transparent'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 font-medium border-b-2 -mb-px ${
                activeTab === 'about'
                  ? 'border-black dark:border-white'
                  : 'border-transparent'
              }`}
            >
              About
            </button>
          </nav>
        </div>

        {activeTab === 'videos' ? (
          isLoading ? (
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
              <Edit3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-medium mb-2">No videos yet</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Upload your first video to get started
              </p>
            </div>
          )
        ) : (
          <div className="max-w-2xl">
            <h2 className="text-lg font-medium mb-4">Description</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Welcome to my channel! Here you'll find videos about...
            </p>

            <h2 className="text-lg font-medium mb-4">Details</h2>
            <dl className="space-y-4">
              <div className="flex gap-4">
                <dt className="w-32 text-gray-600 dark:text-gray-400">Location:</dt>
                <dd>Not specified</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-32 text-gray-600 dark:text-gray-400">Joined:</dt>
                <dd>{new Date(user.metadata.creationTime!).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {showCustomization && (
        <ChannelCustomization onClose={() => setShowCustomization(false)} />
      )}
    </main>
  );
}