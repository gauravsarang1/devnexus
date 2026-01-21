export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  HELLO: 'hello',

  PRESENCE_REQUEST: 'request:presence',
  PRESENCE_ONLINE: 'presence:online',
  PRESENCE_OFFLINE: 'presence:offline',

  JOIN_CHAT: 'join:chat',

  MESSAGE_SEND: 'message:send',
  MESSAGE_READ: 'message:read',
  MESSAGE_STATUS: 'message:status',
  MESSAGE_EDIT: 'message:edit',
  MESSAGE_DELETE: 'message:delete',

  CHAT_SEEN: 'chat:seen',

  TYPING: 'chat:typing',
} as const;
