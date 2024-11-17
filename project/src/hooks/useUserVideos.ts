import { useQuery } from '@tanstack/react-query';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useUserVideos(userId: string | undefined) {
  return useQuery({
    queryKey: ['userVideos', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const q = query(
        collection(db, 'videos'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },
    enabled: !!userId,
  });
}