import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Comment } from '../types';

export function useComments(videoId: string) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('videoId', '==', videoId),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
      setComments(newComments);
    });

    return () => unsubscribe();
  }, [videoId]);

  const addComment = async (comment: Omit<Comment, 'id'>) => {
    await addDoc(collection(db, 'comments'), {
      ...comment,
      timestamp: serverTimestamp(),
    });
  };

  return { comments, addComment };
}