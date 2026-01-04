
import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';
import { app } from '../app.js';
import prisma from '../config/prisma.js';

export const httpServer = http.createServer(app);

// Strict Event Payloads
export interface SocketMessagePayload {
  id: string;
  chatId: string;
  text: string;
  senderId: string;
  createdAt: Date;
  status: 'SENT' | 'DELIVERED' | 'READ';
  sender: {
    name: string;
    avatar: string | null;
    uId: string;
  };
}

export interface SocketNotificationPayload {
  type: 'CHAT' | 'MATCH_REQUEST' | 'MATCH_ACCEPTED' | 'SYSTEM' | 'SKILL_UPDATE' | 'REVIEW';
  title: string;
  message: string;
  link: string;
  payload?: Record<string, any>;
}

export interface SocketTypingPayload {
  chatId: string;
  userId: string;
  isTyping: boolean;
}

export interface SocketStatusPayload {
  messageId: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  chatId?: string;
}

export interface SocketPresencePayload {
  userId: string;
}

export type ServerToClientEvents = {
  welcome: (msg: string) => void;
  userJoined: (data: SocketPresencePayload) => void;
  userLeft: (data: SocketPresencePayload) => void;
  'presence:online': (data: { userId: string }) => void;
  'presence:offline': (data: { userId: string }) => void;
  'message:delete': (data: { id: string, chatId: string }) => void;
  'message:send': (data: SocketMessagePayload) => void;
  'notification': (data: SocketNotificationPayload) => void;
  'message:edit': (data: SocketMessagePayload) => void;
  'message:status': (data: SocketStatusPayload) => void;
  'message:seen': (data: { messageId: string, userId: string, chatId: string }) => void;
  'chat:seen': (data: { chatId: string, userId: string }) => void;
  'chat:typing': (data: SocketTypingPayload) => void;
};

export type ClientToServerEvents = {
  hello: (data: { id: string, name: string }) => void;
  chat: (data: { message: string }) => void;
  'join:chat': (data: { chatId: string }) => void;
  'chat:typing': (data: { chatId: string, isTyping: boolean }) => void;
  'request:presence': () => void;
}

const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
} as any);

const connectedUsers = new Map<string, {name: string, id: string}>();

export const initializeSocketHandlers = () => {
  io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log('🟢 socket connected:', socket.id);

    socket.on('hello', async (data) => {
      connectedUsers.set(socket.id, { name: data.name, id: data.id });
      socket.join(`user:${data.id}`);
      
      // Privacy-focused Presence: Join all chat rooms this user is part of
      try {
        const userChats = await prisma.chatParticipant.findMany({
          where: { userId: data.id },
          select: { chatId: true }
        });
        
        userChats.forEach(c => {
          socket.join(c.chatId);
          // Notify partners in these rooms that user is online
          socket.to(c.chatId).emit('presence:online', { userId: data.id });
        });
      } catch (err) {
        console.error("Error setting up user rooms:", err);
      }

      console.log(`👋 ${data.name} identified (user:${data.id})`);
    });

    socket.on('request:presence', () => {
      // Allow user to request online status of everyone they are currently connected to in rooms
      connectedUsers.forEach((user, sid) => {
        if (sid !== socket.id) {
          socket.emit('presence:online', { userId: user.id });
        }
      });
    });

    socket.on('join:chat', ({ chatId }) => {
      socket.join(chatId);
      console.log(`📡 Socket ${socket.id} joined chat room: ${chatId}`);
    });

    socket.on('chat:typing', ({ chatId, isTyping }) => {
      const userData = connectedUsers.get(socket.id);
      if (userData) {
        socket.to(chatId).emit('chat:typing', {
          chatId,
          userId: userData.id,
          isTyping
        });
      }
    });

    socket.on('disconnect', () => {
      const userData = connectedUsers.get(socket.id);
      if (userData) {
        console.log(`🔴 ${userData.name} disconnected`);
        // Notify all rooms the user was in
        io.emit('presence:offline', { userId: userData.id });
        connectedUsers.delete(socket.id);
      }
    });

    socket.on('error', (error) => {
      console.error(`⚠️ Socket error:`, error);
    });
  });
};

export default io;
