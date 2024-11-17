import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, orderBy, limit, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/auth';
import { Video } from '../types';

export function useHistory() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: history, isLoading } = useQuery({
    queryKey: ['history', user?.uid],
    queryFn: async () => {
      if (!user) return [];
      
      const q = query(
        collection(db, 'history'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data()) as Video[];
    },
    enabled: !!user,
  });

  const addToHistory = useMutation({
    mutationFn: async (video: Video) => {
      if (!user) return;

      await addDoc(collection(db, 'history'), {
        userId: user.uid,
        videoId: video.id,
        timestamp: Date.now(),
        ...video,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });

  return { history, isLoading, addToHistory };
}