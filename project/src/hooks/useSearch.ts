import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Video, SearchFilters } from '../types';

const DEFAULT_FILTERS: SearchFilters = {
  uploadDate: 'Any time',
  duration: 'Any',
  sortBy: 'relevance',
  isHD: false,
  hasCC: false,
  isCreativeCommons: false,
  is4K: false,
  isLive: false,
};

export function useSearch(searchQuery: string) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [lastDoc, setLastDoc] = useState<any>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!searchQuery) return;

      setLoading(true);
      try {
        let q = query(collection(db, 'videos'));

        // Apply search query
        q = query(q, where('title', '>=', searchQuery.toLowerCase()));
        q = query(q, where('title', '<=', searchQuery.toLowerCase() + '\uf8ff'));

        // Apply filters
        if (filters.uploadDate !== 'Any time') {
          const date = new Date();
          switch (filters.uploadDate) {
            case 'Last hour':
              date.setHours(date.getHours() - 1);
              break;
            case 'Today':
              date.setHours(0, 0, 0, 0);
              break;
            case 'This week':
              date.setDate(date.getDate() - 7);
              break;
            case 'This month':
              date.setMonth(date.getMonth() - 1);
              break;
            case 'This year':
              date.setFullYear(date.getFullYear() - 1);
              break;
          }
          q = query(q, where('timestamp', '>=', date.getTime()));
        }

        // Apply sorting
        switch (filters.sortBy) {
          case 'date':
            q = query(q, orderBy('timestamp', 'desc'));
            break;
          case 'views':
            q = query(q, orderBy('views', 'desc'));
            break;
          case 'rating':
            q = query(q, orderBy('likes', 'desc'));
            break;
          default:
            q = query(q, orderBy('title'));
        }

        q = query(q, limit(20));

        if (lastDoc) {
          q = query(q, startAfter(lastDoc));
        }

        const snapshot = await getDocs(q);
        const searchResults = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Video[];

        setVideos(searchResults);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      } catch (error) {
        console.error('Error searching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQuery, filters, lastDoc]);

  return { videos, loading, filters, setFilters };
}