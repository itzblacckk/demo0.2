export interface Comment {
  id: string;
  text: string;
  videoId: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL: string;
  timestamp: number;
  likes?: number;
  replies?: Comment[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  userId: string;
  channelName: string;
  channelAvatar: string;
  views: number;
  likes: number;
  timestamp: number;
  duration?: number;
  isHD?: boolean;
  hasCC?: boolean;
  isCreativeCommons?: boolean;
  is4K?: boolean;
  isLive?: boolean;
}

export interface VideoUploadData {
  title: string;
  description?: string;
  userId: string;
  channelName: string;
  channelAvatar: string;
}

export interface SearchFilters {
  uploadDate: string;
  duration: string;
  sortBy: string;
  isHD: boolean;
  hasCC: boolean;
  isCreativeCommons: boolean;
  is4K: boolean;
  isLive: boolean;
}