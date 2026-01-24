
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
import skillOnUserRouter from './path/skill-on-user/skill-on-user.route.js';

export const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4173', 'https://534zgg8z-3000.inc1.devtunnels.ms', process.env.FRONTEND_URL!],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(requestLogger);

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
app.use('/api/skillOnUser', skillOnUserRouter)

app.use(notFound);
app.use(errorHandler);
