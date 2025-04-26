# TS‑Node · Express · Redis · Bull — Production Template

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node >= 18](https://img.shields.io/badge/node-%3E%3D18.x-brightgreen)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6?logo=typescript)

A modern starter kit for building **low‑latency, horizontally‑scalable** REST APIs and real‑time back‑ends with **TypeScript**, **Express**, **MongoDB**, **Redis** and **Bull** queues.  
It ships with **JWT authentication, Socket.IO, email delivery, background workers, structured logging, and comprehensive tests** out‑of‑the‑box.

> Skip the boilerplate and get straight to shipping features.

---

## ✨ Highlights

| Area | What you get |
|------|--------------|
| **API First** | Clean REST endpoints (OpenAPI ready) + request validation |
| **Typed from top to bottom** | Strict TypeScript + absolute imports |
| **Queue processing** | Bull / BullMQ jobs with Bull‑Board UI |
| **Caching & Pub/Sub** | Redis for both key/value cache and socket cluster |
| **MongoDB (Mongoose)** | Battle‑tested, schema‑driven ODM |
| **AuthN & AuthZ** | JWT access/refresh tokens, password hashing, role helpers |
| **Emails** | Nodemailer + SendGrid transport templates |
| **Real‑time** | Socket.IO channel with Redis adapter |
| **Observability** | Bunyan JSON logs, Swagger‑Stats metrics endpoint |
| **Dev DX** | Nodemon + ts-node, ESLint/Prettier, Jest with coverage |
| **Cloud ready** | 12‑Factor compliant, `.env` driven configuration |

---

## 📁 Project Layout

```
src/
├─ features/          # Domain modules (Auth, User, …)
│  ├─ auth/
│  └─ user/
├─ shared/            # Re‑usable adapters & helpers
│  ├─ globals/
│  ├─ services/
│  │  ├─ db/          # MongoDB data‑access layer
│  │  ├─ redis/       # Caching abstraction
│  │  ├─ queues/      # Bull producers
│  │  └─ workers/     # Job processors
│  └─ sockets/
├─ app.ts             # Express initialisation
├─ routes.ts          # Top‑level router
└─ …                  # Configs, mocks, tests
```

---

## 🏗 High‑Level Architecture

```mermaid
flowchart LR
  client[Client]
  api[Express API]
  db[(MongoDB)]
  redis[(Redis)]
  queue[Bull<br/>(Redis)]
  worker[Worker]
  ext[External<br/>Services]
  monitor[Prometheus<br/>Swagger‑Stats]

  client -->|HTTPS| api
  api --> db
  api --> redis
  api -->|enqueue job| queue
  queue --> worker
  worker --> db
  worker --> ext
  worker -- ack / events --> redis
  api -- Socket.IO --> client
  api -. metrics .-> monitor
```

---

## 🚀 Quick Start

```bash
# 1. Clone template
git clone https://github.com/hassonor/ts-node-express-redis-bull-template.git
cd ts-node-express-redis-bull-template

# 2. Install deps
npm install

# 3. Copy environment template
cp .env.example .env   # then fill in secrets

# 4. Start Mongo, Redis & Bull‑Board in Docker (optional)
docker compose up -d

# 5. Launch API in dev mode
npm run dev
```

Open:

* **API docs**: `http://localhost:5000/api-docs`  
* **Bull‑Board**: `http://localhost:5000/queues`  
* **Redis Commander**: `http://localhost:8081` (if enabled)

---


---

## 📑 Example API Requests

> Use any HTTP client (cURL, [HTTPie](https://httpie.io/), Postman) – replace `localhost:5000` if you mapped a different port.

### 1 · Register

```bash
curl -X POST http://localhost:5000/api/v1/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo",
    "password": "P@ssw0rd!"
  }'
```

Expected `201 Created`

```json
{
  "user": {
    "_id": "6652d3f53acc7b4f1c8c4567",
    "username": "demo",
    "email": "demo@example.com"
  },
  "accessToken": "<jwt>",
  "refreshToken": "<jwt>"
}
```

### 2 · Login

```bash
curl -X POST http://localhost:5000/api/v1/signin \
  -H "Content-Type: application/json" \
  -d '{
    "password": "P@ssw0rd!"
  }'
```

Response includes new `accessToken` and `refreshToken`.

### 3 · Forgot Password

```bash
curl -X POST http://localhost:5000/api/v1/forgot-password \
  -H "Content-Type: application/json" \
  -d '{ "email": "demo@example.com" }'
```

### 4 · Reset Password

```bash
curl -X POST http://localhost:5000/api/v1/reset-password/<token> \
  -H "Content-Type: application/json" \
  -d '{ "password": "NewP@ss1", "confirmPassword": "NewP@ss1" }'
```

### 3 · Access a Protected Route

```bash
curl http://localhost:5000/api/v1/currentUser \
  -H "Authorization: Bearer <accessToken>"
```

### 4 · Enqueue an Email Job

```bash
curl -X POST http://localhost:5000/api/v1/jobs/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "hello@example.com",
    "subject": "Welcome!",
    "body": "<h1>Hello!</h1>"
  }'
```

Returns:

```json
{ "jobId": "baf7c9cf0b3e" }
```

Monitor it on **Bull‑Board** → `/queues`.

### 5 · Check Job Status

```bash
curl http://localhost:5000/api/v1/jobs/baf7c9cf0b3e
```

---

## ⚙️ Configuration

All runtime settings are **environment variables** (12‑Factor). See **`.env.example`** for the full list.

| Name | Purpose |
|------|---------|
| `DATABASE_URI` | MongoDB connection string |
| `PORT` | Express port (default `5000`) |
| `JWT_TOKEN` | Secret for signing access tokens |
| `SECRET_KEY_ONE/TWO` | Refresh‑token encryption keys |
| `REDIS_HOST` | Redis connection URL |
| `SENDGRID_API_KEY` | Mail provider credentials |
| … | _and more_ |

> ✅ Nothing is hard‑coded; safe for containerised or cloud deployment.

---

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Hot‑reload server with **Nodemon** |
| `npm run build` | Transpile to `build/` and fix TS path aliases |
| `npm start` | Run production build with **PM2** cluster |
| `npm test` | Run **Jest** unit tests with coverage |
| `npm run lint:fix` | ESLint + Prettier auto‑fix |
| `npm run seeds:dev` | Seed local database with Faker |

---

## 🛡️ Testing

Unit tests live alongside code and are executed with a single worker to avoid race conditions:

```bash
npm test           # coverage + JUnit report
```

---

## 📊 Observability

* **Logs**   Bunyan streams colourised JSON (pretty in dev).  
* **Metrics** `/stats` exposes API latency, #requests, memory (Swagger‑Stats).  
* **Health** `/healthz` & `/readyz` endpoints for Kubernetes probes.

---

## 🗺 Roadmap

- [ ] OAuth social login
- [ ] Rate‑limiter middleware (Redis token‑bucket)
- [ ] GraphQL layer
- [ ] Helm chart & GitHub Actions CI

---

## 🤝 Contributing

PRs are welcome! Please open an issue first to discuss any significant change.  
Run `npm run lint && npm test` before pushing.

---

## 📝 License

Distributed under the **MIT** license — see `LICENSE` for details.
