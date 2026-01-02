
import express from 'express';
import cors from 'cors';
import {
  errorHandler,
  requestLogger,
  notFound,
} from './middleware/commonMiddleware.js';

import healthRoutes from './path/health/health.route.js';
import userRoutes from './path/user/user.route.js';
import chatrouter from './path/chat/chat.route.js';
import messageRouter from './path/message/message.route.js';
import saveRouter from './path/save/save.route.js';
import photoRouter from './path/photo/photo.route.js';
import reviewRouter from './path/review/review.route.js';
import skillRouter from './path/skill/skill.route.js';
import authRouter from './path/auth/auth.route.js';
import matchRouter from './path/match/match.route.js';
import mediaRouter from './path/media/media.route.js';
import notificationRouter from './path/notification/notification.route.js';
import aiRouter from './path/ai/ai.route.js';

export const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}) as any);

app.use(express.json() as any);
app.use(requestLogger as any);

app.use('/health', healthRoutes);
app.use('/api/auth', authRouter);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatrouter);
app.use('/api/messages', messageRouter);
app.use('/api/saves', saveRouter);
app.use('/api/photos', photoRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/skills', skillRouter);
app.use('/api/matches', matchRouter);
app.use('/api/media', mediaRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/ai', aiRouter);

app.use(notFound as any);
app.use(errorHandler as any);
