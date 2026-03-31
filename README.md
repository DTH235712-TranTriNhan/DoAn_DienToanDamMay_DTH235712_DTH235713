# 🎟️ Nền Tảng Đăng Ký Vé Sự Kiện — Flash Sale Chịu Tải Cao

> **Đồ án môn học:** Điện toán đám mây (SEE910)
> **Trường:** Đại học An Giang — Khoa Công nghệ Thông tin
> **Nhóm:** DTH235712 – DTH235713

---

## 📋 Giới thiệu

Hệ thống **"Nền tảng đăng ký vé sự kiện"** giải quyết bài toán System Design kinh điển: xử lý hàng ngàn request đồng thời (Flash Sale) để tranh mua một lượng vé giới hạn mà **không bị Overselling (bán lố vé)** hay **Race Condition**.

### Điểm nổi bật kỹ thuật

- **Atomic Counter trên Redis (DECR):** Đảm bảo không bao giờ bán lố vé, bất kể bao nhiêu request đồng thời.
- **Asynchronous Processing (BullMQ):** Request được xếp hàng đợi, Worker xử lý bất đồng bộ, API trả về ngay lập tức (HTTP 202).
- **Idempotency Guard (Redis SET NX):** Ngăn chặn cùng một user đặt vé trùng.
- **Defense-in-Depth:** Unique compound index `{ event, user }` trên MongoDB là lớp bảo vệ cuối cùng.

---

## ☁️ Cloud Services đã sử dụng

| Dịch vụ | Vai trò | Tài liệu |
|---------|---------|-----------|
| **MongoDB Atlas** | Cloud Database chính — lưu trữ Users, Events, Tickets, Transactions | [mongodb.com/atlas](https://www.mongodb.com/atlas) |
| **Upstash Redis** | In-memory Cache + Message Queue (BullMQ). Xử lý atomic counter chống Overselling | [upstash.com](https://upstash.com) |
| **Google OAuth 2.0** | Xác thực người dùng thông qua tài khoản Google | [developers.google.com](https://developers.google.com/identity/protocols/oauth2) |

---

## 📁 Cấu trúc thư mục Monorepo

```
event-ticket-monorepo/
├── modules/
│   ├── backend/                    # Node.js / Express API Server
│   │   ├── src/
│   │   │   ├── config/             # Kết nối DB, cấu hình OAuth
│   │   │   │   ├── connectToServers.js
│   │   │   │   └── googleOAuth.js
│   │   │   ├── libs/               # Thư viện dùng chung
│   │   │   │   ├── redis.js        # Upstash Redis client (ioredis)
│   │   │   │   └── logger.js       # Structured logging
│   │   │   ├── models/             # Mongoose Schemas
│   │   │   │   ├── UserModel.js
│   │   │   │   ├── EventModel.js
│   │   │   │   ├── TicketModel.js
│   │   │   │   └── TransactionModel.js
│   │   │   ├── queues/             # BullMQ Queue + Worker Processor
│   │   │   │   ├── ticketQueue.js
│   │   │   │   └── ticketWorkerProcessor.js
│   │   │   ├── rest/
│   │   │   │   ├── handlers/       # Request handlers (1 file = 1 hàm)
│   │   │   │   │   ├── auth/       # googleCallbackHandler.js
│   │   │   │   │   ├── event/      # getEventsHandler.js
│   │   │   │   │   └── ticket/     # registerTicketHandler.js, getJobStatusHandler.js, getMyTicketsHandler.js
│   │   │   │   ├── middlewares/    # asyncHandler, errorHandler, rateLimiter, validateJwt
│   │   │   │   ├── routes/         # authRoutes, eventRoutes, ticketRoutes
│   │   │   │   └── router.js       # Main API router
│   │   │   ├── services/           # Business logic (1 file = 1 hàm)
│   │   │   │   ├── auth/           # findOrCreateUser.js
│   │   │   │   ├── event/          # getEvents.js
│   │   │   │   └── ticket/         # bookTicket.js, checkIdempotency.js, enqueueTicketJob.js
│   │   │   ├── types/              # Constants, AppError classes
│   │   │   ├── index.js            # Express server entry point
│   │   │   ├── worker.js           # BullMQ Worker (chạy process riêng)
│   │   │   └── seed.js             # Seed dữ liệu mẫu + sync Redis
│   │   ├── .env.example
│   │   └── package.json
│   │
│   └── ui/                         # React / Vite Frontend
│       ├── src/
│       │   ├── components/         # NavBar, EventCard
│       │   ├── context/            # AuthContext
│       │   ├── hooks/              # useEvents
│       │   ├── pages/              # LoginPage, EventsPage
│       │   ├── services/           # api.js (axios + JWT interceptor)
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
│
├── package.json                    # Root monorepo (npm workspaces)
├── eslint.config.mjs               # Shared ESLint config
├── .prettierrc.json                 # Shared Prettier config
└── README.md                        # ← Bạn đang đọc file này
```

---

## ⚙️ Hướng dẫn Setup

### 1. Yêu cầu hệ thống

- **Node.js** >= 18.x (khuyến nghị 20 LTS)
- **npm** >= 9.x
- Tài khoản **MongoDB Atlas** (Free Tier M0)
- Tài khoản **Upstash** (Free Tier)
- **Google Cloud Console** project (để lấy OAuth credentials)

### 2. Clone repository

```bash
git clone https://github.com/<your-username>/event-ticket-monorepo.git
cd event-ticket-monorepo
```

### 3. Cài đặt dependencies

```bash
npm install        # Cài tất cả dependencies cho cả backend và ui (npm workspaces)
```

### 4. Cấu hình biến môi trường

Tạo file `modules/backend/.env` dựa trên `.env.example`:

```bash
cp modules/backend/.env.example modules/backend/.env
```

#### File `.env.example`

```env
# ─── Server Config ───────────────────────────────────────
PORT=5000
NODE_ENV=development

# ─── MongoDB Atlas ───────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>

# ─── Upstash Redis ───────────────────────────────────────
REDIS_URL=rediss://default:<password>@<host>.upstash.io:6379

# ─── JWT ─────────────────────────────────────────────────
JWT_SECRET=<random-string-min-64-chars>

# ─── Google OAuth 2.0 ───────────────────────────────────
GOOGLE_CLIENT_ID=<your-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-<your-secret>
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# ─── CORS — Frontend URL ────────────────────────────────
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

### 5. Seed dữ liệu mẫu

```bash
npm run seed --workspace=modules/backend
```

Script sẽ tạo 2 sự kiện mẫu trong MongoDB và sync số vé vào Redis.

---

## 🚀 Chạy dự án

### Môi trường Development (2 cổng riêng biệt)

```bash
# Cách 1: Chạy song song cả Backend (port 5000) + Frontend (port 5173)
npm run dev

# Cách 2: Chạy riêng từng module
npm run dev:backend     # Backend tại http://localhost:5000
npm run dev:ui           # Frontend tại http://localhost:5173

# Chạy Worker (process riêng, cần mở terminal khác)
npm run worker --workspace=modules/backend

# Hoặc Worker với hot-reload
npm run worker:dev --workspace=modules/backend
```

### Môi trường Production (Backend serve static Frontend)

```bash
npm start
# Lệnh này sẽ:
# 1. Build frontend (vite build) → modules/ui/dist/
# 2. Backend serve static files từ ui/dist/
# 3. Chạy server trên PORT (mặc định 5000)
```

---

## 🌐 Link Deploy & Tài khoản Test

### Link truy cập ứng dụng

| Thành phần | URL |
|-----------|-----|
| **Ứng dụng chính** | `https://<your-app>.onrender.com` |
| **API Health Check** | `https://<your-app>.onrender.com/api/health` |
| **API Events** | `https://<your-app>.onrender.com/api/events` |

### Tài khoản Admin test

```
Đăng nhập bằng Google OAuth:
Email: <email-test>@gmail.com
```

> **Lưu ý:** Ứng dụng sử dụng Google OAuth 2.0, không có hệ thống đăng ký tài khoản riêng. Mọi người dùng đều đăng nhập thông qua tài khoản Google.

---

## 📊 API Endpoints

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| `GET` | `/api/health` | ❌ | Kiểm tra trạng thái server, DB, Redis |
| `GET` | `/api/events` | ❌ | Danh sách sự kiện |
| `GET` | `/api/auth/google` | ❌ | Redirect đến Google login |
| `GET` | `/api/auth/google/callback` | ❌ | Callback sau khi Google xác thực |
| `POST` | `/api/tickets` | ✅ JWT | Đặt vé (trả jobId, xử lý async) |
| `GET` | `/api/tickets/status/:jobId` | ✅ JWT | Kiểm tra trạng thái job đặt vé |
| `GET` | `/api/tickets/my` | ✅ JWT | Xem danh sách vé của tôi |

---

## 🔒 Bảo mật

- **Helmet.js** — HTTP Security Headers
- **CORS** — Chỉ cho phép origin từ Frontend
- **Rate Limiting** — 100 req/15 phút (general), 10 req/15 phút (đặt vé)
- **JWT** — Token hết hạn 7 ngày, secret >= 64 ký tự
- **Biến môi trường** — Mọi credentials đều trong `.env`, không commit lên Git

---

## 🛠️ Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4 |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB Atlas (Mongoose 9) |
| **Cache / Queue** | Upstash Redis (ioredis) + BullMQ |
| **Authentication** | Google OAuth 2.0 (Passport.js) |
| **Security** | Helmet, express-rate-limit, JWT |
| **DevOps** | ESLint, Prettier, npm workspaces |
| **Deploy** | Render.com / Railway |

---

## 📝 License

[MIT](LICENSE)
