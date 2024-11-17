import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Upload, Bell, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { VideoUpload } from './VideoUpload';

export function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center gap-1">
              <span className="text-xl font-semibold">YourTube</span>
            </Link>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={() => setShowUpload(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <Upload className="w-6 h-6" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <Bell className="w-6 h-6" />
                </button>
                <Link to="/profile">
                  <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-blue-600 border border-blue-600 rounded-full px-4 py-1 hover:bg-blue-50"
              >
                <UserIcon className="w-5 h-5" />
                <span>Sign in</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {showUpload && <VideoUpload onClose={() => setShowUpload(false)} />}
    </>
  );
}