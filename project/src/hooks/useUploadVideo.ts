import { useState } from 'react';
import { useAuthStore } from '../store/auth';

export function useUploadVideo() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuthStore();

  const uploadVideo = async (
    videoFile: File,
    thumbnailFile: File | null,
    videoData: { title: string; description?: string }
  ) => {
    if (!user) throw new Error('Must be logged in to upload videos');

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }
      formData.append('title', videoData.title);
      if (videoData.description) {
        formData.append('description', videoData.description);
      }
      formData.append('userId', user.uid);
      formData.append('channelName', user.displayName || 'Anonymous');

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setProgress(Math.round(progress));
        }
      };

      const response = await new Promise<{ id: string }>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('Upload failed'));
          }
        };
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.open('POST', 'http://localhost:3000/api/videos/upload');
        xhr.send(formData);
      });

      return response.id;
    } finally {
      setUploading(false);
    }
  };

  return { uploadVideo, progress, uploading };
}