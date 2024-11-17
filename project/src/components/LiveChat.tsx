import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/auth';

interface Message {
  userId: string;
  username: string;
  message: string;
  timestamp: number;
}

interface LiveChatProps {
  videoId: string;
}

export function LiveChat({ videoId }: LiveChatProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.emit('join-video', videoId);

    newSocket.on('new-message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      newSocket.close();
    };
  }, [videoId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !user || !message.trim()) return;

    const newMessage = {
      userId: user.uid,
      username: user.displayName || 'Anonymous',
      message: message.trim(),
      timestamp: Date.now(),
    };

    socket.emit('chat-message', {
      videoId,
      ...newMessage,
    });

    setMessage('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className="flex items-start gap-2">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.userId}`}
              alt={msg.username}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{msg.username}</p>
              <p className="text-sm">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>
      
      {user ? (
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-full disabled:opacity-50"
          >
            Send
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-500">Sign in to chat</p>
      )}
    </div>
  );
}