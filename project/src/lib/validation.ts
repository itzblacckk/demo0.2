import { z } from 'zod';

export const VideoUploadSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(5000).optional(),
  userId: z.string(),
  channelName: z.string(),
  channelAvatar: z.string(),
});