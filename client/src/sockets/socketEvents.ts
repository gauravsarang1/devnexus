export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  HELLO: 'hello',

  PRESENCE_REQUEST: 'request:presence',
  PRESENCE_ONLINE: 'presence:online',
  PRESENCE_OFFLINE: 'presence:offline',

  JOIN_CHAT: 'join:chat',
  MESSAGE_SEND: 'message:send',

  TYPING: 'chat:typing',
} as const;
