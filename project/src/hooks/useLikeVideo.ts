import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/auth';

export function useLikeVideo() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const toggleLike = useMutation({
    mutationFn: async ({ videoId, liked }: { videoId: string; liked: boolean }) => {
      if (!user) throw new Error('Must be logged in to like videos');

      const likeRef = doc(db, 'likes', `${user.uid}_${videoId}`);
      
      if (liked) {
        await setDoc(likeRef, {
          userId: user.uid,
          videoId,
          timestamp: Date.now(),
        });
      } else {
        await deleteDoc(likeRef);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likedVideos'] });
    },
  });

  return toggleLike;
}