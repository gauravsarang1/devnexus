# Backend Architecture Guide

## Overview

The backend has been refactored for **scalability and maintainability** using a layered architecture pattern. Each layer has clear responsibilities and is independent, making it easy to test, modify, and extend.

## Project Structure

```
backend/src/
├── app.ts                 # Express app setup (routes & middleware)
├── index.ts              # Entry point, server startup & graceful shutdown
├── server.ts             # (unused, kept for reference)
├── config/
│   └── prisma.ts         # Prisma client singleton
├── services/
│   └── userService.ts    # Business logic & DB operations
├── routes/
│   ├── userRoutes.ts     # User CRUD endpoints
│   └── healthRoutes.ts   # Health check endpoint
├── middleware/
│   └── commonMiddleware.ts  # Request logging, error handling, 404
├── sockets/
│   ├── index.ts          # Socket.io entry point
│   └── socketHandlers.ts # Event handlers & logic
├── cron/
│   └── skillPopularity.ts # Scheduled jobs
├── utils/                # Helper functions
└── modules/              # Feature-specific modules (future)
```

## Architecture Layers

### 1. **Entry Point** (`index.ts`)
- Initializes the HTTP server and Socket.io handlers
- Schedules cron jobs
- Handles graceful shutdown (SIGTERM/SIGINT)
- **Responsibility**: Server lifecycle management

### 2. **Express App** (`app.ts`)
- Configures middleware (logging, error handling, JSON parsing)
- Registers routes
- Sets up error handlers and 404 fallback
- **Responsibility**: HTTP request pipeline

### 3. **Routes** (`routes/`)
- Defines HTTP endpoints (POST, GET, PUT, DELETE, etc.)
- Validates input
- Calls services and returns responses
- **Responsibility**: HTTP interface

**Files**:
- `userRoutes.ts` — User CRUD operations
- `healthRoutes.ts` — Health check

### 4. **Services** (`services/`)
- Contains all business logic
- Interacts with the database (Prisma)
- Encapsulates data access patterns
- Returns standardized results (`{ success, data, error }`)
- **Responsibility**: Core application logic

**Files**:
- `userService.ts` — User operations

### 5. **Middleware** (`middleware/`)
- Request/response interceptors
- Logging, error handling, validation
- **Responsibility**: Cross-cutting concerns

### 6. **Socket.io** (`sockets/`)
- Real-time event handlers
- User connection/disconnection logic
- Broadcasting and messaging
- **Responsibility**: WebSocket communication

### 7. **Config** (`config/`)
- Singleton instances (Prisma, cache, etc.)
- Environment setup
- **Responsibility**: External service initialization

### 8. **Cron** (`cron/`)
- Scheduled background jobs
- **Responsibility**: Periodic tasks

### 9. **Utils** (`utils/`)
- Helper functions
- Common utilities
- **Responsibility**: Reusable code

---

## Adding New Features

### Step 1: Create a Service
Create a service in `services/` to handle business logic:

```typescript
// services/skillService.ts
export class SkillService {
  static async getSkills() {
    try {
      const skills = await prisma.skill.findMany();
      return { success: true, data: skills };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }
}
```

### Step 2: Create Routes
Create routes in `routes/` to expose the service:

```typescript
// routes/skillRoutes.ts
import { Router } from 'express';
import { SkillService } from '../services/skillService.js';

const router = Router();

router.get('/', async (_req, res) => {
  const result = await SkillService.getSkills();
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
});

export default router;
```

### Step 3: Register Routes
Add the routes in `app.ts`:

```typescript
import skillRoutes from './routes/skillRoutes.js';

app.use('/api/skills', skillRoutes);
```

---

## Data Flow Example

### Creating a User

1. **HTTP Request** → `POST /api/users`
2. **Route Handler** (`userRoutes.ts`)
   - Validates input
   - Calls `UserService.createUser()`
3. **Service** (`userService.ts`)
   - Executes business logic
   - Calls `prisma.user.create()`
4. **Database** (MongoDB via Prisma)
   - Stores user
5. **Response** → JSON with user data

---

## Error Handling

All services return standardized responses:

```typescript
{
  success: boolean;
  data?: any;
  error?: string;
}
```

The error middleware catches unhandled errors and sends a 500 response.

---

## Socket.io Events

### Server → Client (Broadcasting)

```typescript
socket.emit('welcome', 'Welcome!');
socket.broadcast.emit('userJoined', { userId, name });
io.emit('message', { userId, message, timestamp });
```

### Client → Server (Listening)

```typescript
socket.on('hello', (data) => { /* handle */ });
socket.on('chat', (data) => { /* handle */ });
socket.on('disconnect', () => { /* handle */ });
```

---

## Scalability Features

1. **Service Layer**: Easy to add new business logic without modifying routes
2. **Route Separation**: Each feature gets its own route file
3. **Middleware**: Reusable, chainable middleware for cross-cutting concerns
4. **Error Handling**: Centralized error handling catches all errors
5. **Type Safety**: Full TypeScript support with type definitions
6. **Socket.io**: Organized event handlers with proper typing
7. **Graceful Shutdown**: Proper cleanup on process termination
8. **Logging**: Request/response logging for debugging

---

## Best Practices

- **Services**: Keep all DB logic here; routes should be thin wrappers
- **Routes**: Validate input, call services, return responses
- **Middleware**: Keep it focused on one responsibility
- **Naming**: Use clear, descriptive names (e.g., `userRoutes`, `skillService`)
- **Error Handling**: Always catch errors and return appropriate status codes
- **Logging**: Log important events for debugging and monitoring
- **Testing**: Test services in isolation, then test routes

---

## Running the Server

```bash
# Install dependencies
npm install

# Build db package (if using monorepo)
npm run build:db

# Start development server
npm run dev

# Start production server
npm start
```

---

## Environment Variables

```
PORT=4000
DATABASE_URL=mongodb+srv://...
NODE_ENV=development
```

---

## Future Improvements

- Add request validation middleware (e.g., `express-validator`)
- Add authentication middleware (JWT, OAuth)
- Add rate limiting
- Add request/response logging to a file
- Add API documentation (Swagger/OpenAPI)
- Split Socket.io handlers into separate files by feature
- Add unit tests for services
- Add integration tests for routes
- Add monitoring and health checks
