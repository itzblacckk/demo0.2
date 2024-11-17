import { useState, useEffect } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Video } from '../types';

export function useRelatedVideos(currentVideoId: string) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedVideos = async () => {
      try {
        const q = query(
          collection(db, 'videos'),
          where('id', '!=', currentVideoId),
          limit(10)
        );
        
        const snapshot = await getDocs(q);
        const relatedVideos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Video[];
        
        setVideos(relatedVideos);
      } catch (error) {
        console.error('Error fetching related videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedVideos();
  }, [currentVideoId]);

  return { videos, loading };
}