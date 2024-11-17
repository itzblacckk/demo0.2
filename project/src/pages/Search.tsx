import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { VideoCard } from '../components/VideoCard';
import { useSearch } from '../hooks/useSearch';
import { SearchFilters } from '../components/SearchFilters';

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [showFilters, setShowFilters] = useState(false);
  
  const { videos, loading, filters, setFilters } = useSearch(query);

  return (
    <main className="pt-14 pl-64">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">
            Search results for "{query}"
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex gap-6">
          {showFilters && (
            <aside className="w-64 shrink-0">
              <SearchFilters filters={filters} onChange={setFilters} />
            </aside>
          )}

          <div className="flex-1">
            {loading ? (
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
            ) : videos.length > 0 ? (
              <div className="space-y-4">
                {videos.map((video) => (
                  <VideoCard key={video.id} {...video} layout="horizontal" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Filter className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-medium mb-2">No results found</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Try different keywords or remove search filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}