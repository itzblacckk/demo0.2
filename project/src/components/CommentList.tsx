import React from 'react';
import { ThumbsUp, ThumbsDown, MoreVertical } from 'lucide-react';
import { Comment } from '../types';

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4">
          <img
            src={comment.userPhotoURL}
            alt={comment.userDisplayName}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.userDisplayName}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatTimestamp(comment.timestamp)}
              </span>
            </div>
            <p className="mt-1">{comment.text}</p>
            <div className="flex items-center gap-4 mt-2">
              <button className="flex items-center gap-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full">
                <ThumbsUp className="w-4 h-4" />
                <span>{comment.likes || 0}</span>
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <ThumbsDown className="w-4 h-4" />
              </button>
              <button className="text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 rounded-full">
                Reply
              </button>
              <button className="ml-auto p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}