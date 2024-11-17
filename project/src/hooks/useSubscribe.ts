import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/auth';

export function useSubscribe() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const toggleSubscription = useMutation({
    mutationFn: async ({ channelId, subscribed }: { channelId: string; subscribed: boolean }) => {
      if (!user) throw new Error('Must be logged in to subscribe to channels');

      const subscriptionRef = doc(db, 'subscriptions', `${user.uid}_${channelId}`);
      
      if (subscribed) {
        await setDoc(subscriptionRef, {
          subscriberId: user.uid,
          channelId,
          timestamp: Date.now(),
        });
      } else {
        await deleteDoc(subscriptionRef);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });

  return toggleSubscription;
}