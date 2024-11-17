import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import NodeMediaServer from 'node-media-server';
import multer from 'multer';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cors());

// Multer configuration for video uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

// RTMP Server Configuration
const nms = new NodeMediaServer({
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
});

// Socket.IO for live chat
io.on('connection', (socket) => {
  socket.on('join-video', (videoId) => {
    socket.join(`video-${videoId}`);
  });

  socket.on('chat-message', async (data) => {
    const { videoId, userId, message } = data;
    await prisma.comment.create({
      data: {
        content: message,
        userId,
        videoId
      }
    });
    io.to(`video-${videoId}`).emit('new-message', data);
  });
});

// Video Routes
app.post('/api/videos/upload', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const videoFile = req.files['video'][0];
    const thumbnailFile = req.files['thumbnail']?.[0];
    const { title, description, userId, channelName } = req.body;

    const video = await prisma.video.create({
      data: {
        title,
        description,
        videoData: videoFile.buffer,
        thumbnail: thumbnailFile?.buffer,
        userId,
        channelName,
        mimeType: videoFile.mimetype,
        size: videoFile.size,
      }
    });

    res.json({ id: video.id });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

app.get('/api/videos/:id/stream', async (req, res) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
      select: { videoData: true, mimeType: true, size: true }
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const range = req.headers.range;
    if (!range) {
      res.writeHead(200, {
        'Content-Type': video.mimeType,
        'Content-Length': video.size,
      });
      res.end(video.videoData);
      return;
    }

    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : video.size - 1;
    const chunksize = end - start + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${video.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': video.mimeType,
    });

    res.end(video.videoData.slice(start, end + 1));
  } catch (error) {
    console.error('Error streaming video:', error);
    res.status(500).json({ error: 'Failed to stream video' });
  }
});

app.get('/api/videos/:id/thumbnail', async (req, res) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
      select: { thumbnail: true }
    });

    if (!video?.thumbnail) {
      return res.status(404).json({ error: 'Thumbnail not found' });
    }

    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': video.thumbnail.length,
    });
    res.end(video.thumbnail);
  } catch (error) {
    console.error('Error fetching thumbnail:', error);
    res.status(500).json({ error: 'Failed to fetch thumbnail' });
  }
});

app.get('/api/videos', async (req, res) => {
  const videos = await prisma.video.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      userId: true,
      channelName: true,
      views: true,
      likes: true,
      createdAt: true,
      isLive: true,
      duration: true,
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(videos);
});

app.post('/api/videos/view', async (req, res) => {
  const { videoId } = req.body;
  await prisma.video.update({
    where: { id: videoId },
    data: { views: { increment: 1 } }
  });
  res.json({ success: true });
});

// Start servers
nms.run();
httpServer.listen(3000, () => {
  console.log('Server running on port 3000');
});