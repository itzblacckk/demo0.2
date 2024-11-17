import { useQuery } from '@tanstack/react-query';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Video } from '../types';

export function useRecommendations(videoId: string, tags: string[] = []) {
  return useQuery({
    queryKey: ['recommendations', videoId],
    queryFn: async () => {
      let q = query(collection(db, 'videos'));

      // Exclude current video
      if (videoId) {
        q = query(q, where('id', '!=', videoId));
      }

      // If we have tags, prioritize videos with matching tags
      if (tags.length > 0) {
        q = query(q, where('tags', 'array-contains-any', tags));
      }

      q = query(q, orderBy('views', 'desc'), limit(10));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Video[];
    },
  });
}