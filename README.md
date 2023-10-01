# TS-Node-Express-Redis-Bull Template

Welcome to the **TS-Node-Express-Redis-Bull** template!
Dive into a world-class development experience with this cutting-edge template,
tailored for developers who seek excellence.
Harness the power of TypeScript, Node.js, Express, Redis,
and Bull to craft scalable, efficient, and robust web applications.

## 📂 Structure



- **src/app.ts**: The main application entry point.
- **src/config.ts**: Configuration settings for the application.
- **src/routes.ts**: Defines the application routes.
- **src/setupDatabase.ts**: Set up the database connection.
- **src/setupServer.ts**: Configures and sets up the Express server.
- **src/shared/globals/helpers/error-handler.ts**: Global error handler.
- **src/shared/globals/helpers/helpers.ts**: Utility and helper functions.
- **src/shared/services/db/auth.service.ts**: Authentication service.
- **src/shared/services/db/user.service.ts**: User service.
- **src/shared/services/emails/mail.transport.ts**: Email transport configuration.
- **src/shared/services/queues/auth.queue.ts**: Authentication queue.
- **src/shared/services/queues/base.queue.ts**: Base queue.
- **src/shared/services/queues/email.queue.ts**: Email queue.
- **src/shared/services/queues/user.queue.ts**: User queue.
- **src/shared/services/redis/base.cache.ts**: Base cache for Redis.
- **src/shared/services/redis/redis.connection.ts**: Redis connection setup.
- **src/shared/services/redis/user.cache.ts**: User cache in Redis.
- **src/shared/sockets/user.socket.ts**: User socket configuration.
- **src/shared/workers/auth.worker.ts**: Authentication worker.
  ts-node-express-redis-bull-template/
  └── src/
  ├── app.ts
  ├── config.ts
  ├── routes.ts
  ├── setupDatabase.ts
  ├── setupServer.ts
  ├── features/
  │   ├── auth/
  │   │   ├── controllers/
  │   │   ├── interfaces/
  │   │   ├── models/
  │   │   ├── routes/
  │   │   └── schemes/
  │   └── user/
  │       ├── interfaces/
  │       └── models/
  ├── mocks/
  └── shared/
  ├── globals/
  │   ├── decorators/
  │   └── helpers/
  ├── services/
  │   ├── db/
  │   ├── emails/
  │   ├── queues/
  │   └── redis/
  ├── sockets/
  └── workers/


## 🌟 Features

- **TypeScript**: Strongly-typed JavaScript for better developer experience.
- **Node.js & Express**: Fast and scalable backend framework.
- **Redis**: In-memory data structure store used for caching and as a message broker.
- **Bull**: A Node.js library that provides robust job and message queue based on Redis.
- **Modular Structure**: Organized and modular code structure for scalability and maintainability.
- **Error Handling**: Global error handler for handling exceptions and errors.
- **Authentication**: Built-in authentication using JWT.
- **Email Service**: Integrated email service for sending emails.
- **Web Sockets**: Real-time bidirectional event-based communication.
- **Workers**: Separate workers for handling background tasks.
  ... and more!

## Getting Started

1. Redis: Set it up with this [Guide](https://redis.io/docs/getting-started/installation/install-redis-on-windows/)
2. Redis Commander: Get it running with this [Guide](https://www.npmjs.com/package/redis-commander)
3. Install dependencies: `npm i`
4. Start the development server: `npm run dev`
5. Run tests: `npm run test`
6. Redis Cache URL: `http://localhost:8081`
7. Bull Queues: `http://localhost:5000/queues/queue/auth`

# API Request Examples

## 1. SignUp Request

**Endpoint:**  
`POST` http://localhost:5000/api/v1/signup

**Raw Body:**
```json
{
    "username": "orh4",
    "password": "zfq23546ydfg",
    "email": "or3424234assf@gmail.com",
    "avatarColor": "red",
    "avatarImage": ""
}
```

## 2. SignIn Request

**Endpoint:**  
`POST` http://localhost:5000/api/v1/signin

**Raw Body:**
```json
{
   "username": "orh4",
   "password": "zfq23546ydfg"
}
```

## 3. Forgot Password Request

**Endpoint:**  
`POST` http://localhost:5000/api/v1/forgot-password

**Raw Body:**
```json
{
   "email": "or3424234assf@gmail.com"
}
```

## 4. Reset Password Request
`Note: You need to paste the token from the mail.
`
**Endpoint:**  
`POST` http://localhost:5000/api/v1/forgot-password/:token

**Raw Body:**
```json
{
   "password": "someNewPassword",
   "confirmPassword": "someNewPassword"
}
```

## 5. SignOut Request

**Endpoint:**  
`GET` http://localhost:5000/api/v1/signout

## 6. CurrentUser Request

**Endpoint:**  
`GET` http://localhost:5000/api/v1/currentUser


