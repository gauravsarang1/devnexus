
import 'dotenv/config';
import { httpServer } from './sockets/socketHandlers.js';
import { initializeSocketHandlers } from './sockets/socketHandlers.js';
import { updateSkillPopularity } from './cron/skillPopularity.js';
import {connectRedis} from './config/redis.js';

/**
 * Initialize Socket.io handlers
 */
initializeSocketHandlers();

connectRedis()

/**
 * Start HTTP server
 */
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

/**
 * Schedule cron jobs
 */
// Daily skill popularity update at midnight
setInterval(updateSkillPopularity, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
// Initial run
//updateSkillPopularity();

/**
 * Graceful shutdown
 */
// Cast process to any to fix type errors for .on and .exit
(process as any).on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    (process as any).exit(0);
  });
});

// Cast process to any to fix type errors for .on and .exit
(process as any).on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    (process as any).exit(0);
  });
});
