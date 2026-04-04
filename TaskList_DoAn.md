# 📋 BẢNG KẾ HOẠCH NHIỆM VỤ — Hệ thống Bán Vé Sự Kiện Chịu Tải Cao

> **Cập nhật:** 31/03/2026
> **Team Lead (Backend):** Trần Trí Nhân · **Frontend:** Huỳnh Minh Nhật

### Quy ước trạng thái

| Icon | Ý nghĩa |
|------|---------|
| ✅ | Đã hoàn thành (code đã có trong repo) |
| 🔲 | Chưa làm |

### Hiện trạng Repo sau khi audit

**Backend — đã có code hoạt động:** Models (4 file), Services (5 file), Handlers (5 file), Middlewares (4 file), Routes (3 file), Queue (2 file), Config (2 file), Libs (2 file), Types (2 file), `index.js`, `worker.js`, `seed.js`. Tuy nhiên, `router.js` đang **comment out** 2 dòng `authRoutes` và `ticketRoutes` → cần bật lên ở Phase tương ứng.

**Frontend — khung sườn:** `App.jsx` có giao diện mock data. **6 file rỗng (0 bytes):** `NavBar.jsx`, `EventCard.jsx`, `AuthContext.jsx`, `useEvents.js`, `LoginPage.jsx`, `EventsPage.jsx`. Package `axios` được import trong `api.js` nhưng chưa khai trong `package.json` → cần `npm install axios react-router-dom`.

---

## PHASE 1 · FOUNDATION — Khởi tạo móng

> **Mục tiêu:** Cả 2 người chạy được dự án trên local, Backend trả data thật từ MongoDB Atlas, Frontend có layout chung (NavBar, routing).

---

### TASK 1.1 ✅ · Khởi tạo Monorepo & cấu hình chung

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhân |
| **Trạng thái** | ✅ Đã xong — `package.json` root đã có `workspaces`, ESLint, Prettier |
| **File liên quan** | `/package.json`, `/eslint.config.mjs`, `/.prettierrc.json` |
| **Kết quả** | `npm install` từ root cài đồng thời cả `modules/backend` và `modules/ui` |

---

### TASK 1.2 ✅ · Kết nối MongoDB Atlas + Upstash Redis

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhân |
| **Trạng thái** | ✅ Đã xong |
| **File liên quan** | `backend/src/config/connectToServers.js`, `backend/src/libs/redis.js`, `backend/.env` |
| **Kết quả** | `npm run dev:backend` → log `[DB] MongoDB Connected` + `[Redis] Upstash Connected`. Endpoint `GET /api/health` trả `{ status: "ok", database: "connected", redis: "connected" }` |

---

### TASK 1.3 ✅ · Tạo Mongoose Models & Seed Data

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhân |
| **Trạng thái** | ✅ Đã xong |
| **File liên quan** | `backend/src/models/UserModel.js`, `EventModel.js`, `TicketModel.js`, `TransactionModel.js`, `backend/src/seed.js` |
| **Kết quả** | `npm run seed --workspace=modules/backend` tạo 2 event mẫu trong MongoDB và SET counter vào Redis |

---

### TASK 1.4 ✅ · API lấy danh sách sự kiện

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhân |
| **Trạng thái** | ✅ Đã xong |
| **File liên quan** | `backend/src/services/event/getEvents.js`, `backend/src/rest/handlers/event/getEventsHandler.js`, `backend/src/rest/routes/eventRoutes.js` |
| **Kết quả** | `GET /api/events` → `{ success: true, data: [...] }` |

---

### TASK 1.5 🔲 · Cài thêm dependencies Frontend & cấu hình Vite proxy

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhật |
| **File/Thư mục** | `modules/ui/package.json`, `modules/ui/vite.config.js` |
| **Định hướng triển khai** | 1. Từ thư mục root, chạy: `npm install axios react-router-dom --workspace=modules/ui`. 2. Mở `vite.config.js`, thêm `server.proxy` để `/api` trỏ về `http://localhost:5000` (tránh lỗi CORS khi dev). Cấu hình mẫu: `server: { proxy: { '/api': 'http://localhost:5000' } }`. 3. Kiểm tra: `npm run dev:ui` → truy cập `http://localhost:5173/api/health` phải trả JSON từ Backend |
| **Kết quả** | Frontend gọi API qua relative path `/api/...` mà không cần hardcode `localhost:5000` |

---

### TASK 1.6 🔲 · Tạo Layout chung: NavBar + React Router

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhật |
| **File/Thư mục** | `ui/src/components/NavBar.jsx` (hiện 0 bytes), `ui/src/App.jsx` (cần refactor) |
| **Định hướng triển khai** | 1. **`NavBar.jsx`** — Component thanh điều hướng cố định trên cùng. Props: `user` (object hoặc null). Nếu `user` → hiển thị avatar + tên + nút "Vé của tôi" + "Đăng xuất". Nếu `null` → nút "Đăng nhập với Google". Dùng Tailwind: `bg-white shadow-md sticky top-0 z-50`. 2. **`App.jsx`** — Xóa toàn bộ code mock data hiện tại. Wrap bằng `<BrowserRouter>`, render `<NavBar />` ở trên, bên dưới là `<Routes>`: Route `/` → `<EventsPage />`, Route `/login` → `<LoginPage />`, Route `/auth/callback` → component xử lý token (sẽ làm ở Phase 2), Route `/my-tickets` → `<MyTicketsPage />`. 3. Tạm thời NavBar chưa cần logic auth thật, chỉ cần render UI tĩnh |
| **Kết quả** | Truy cập `localhost:5173` thấy NavBar + trang EventsPage (tạm trống). Chuyển route `/login` thấy LoginPage |

---

### TASK 1.7 🔲 · Tạo trang EventsPage + component EventCard

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhật |
| **File/Thư mục** | `ui/src/pages/EventsPage.jsx` (0 bytes), `ui/src/components/EventCard.jsx` (0 bytes), `ui/src/hooks/useEvents.js` (0 bytes) |
| **Định hướng triển khai** | 1. **`useEvents.js`** — Custom hook gọi `GET /api/events`. Dùng `useState` + `useEffect`. Return `{ events, loading, error }`. Import `api` từ `../services/api.js` (đã có axios instance). **Quan trọng:** sửa `baseURL` trong `api.js` thành `"/api"` (vì đã có Vite proxy ở Task 1.5, không cần hardcode `localhost:5000` nữa). 2. **`EventCard.jsx`** — Props: `event` object. Hiển thị: title, description, date (format DD/MM/YYYY), location, thanh progress (availableTickets/totalTickets), nút "Đặt Vé Ngay". Lấy toàn bộ Tailwind UI từ `App.jsx` cũ (phần `.map(event => ...)`) rồi tách thành component riêng. 3. **`EventsPage.jsx`** — Gọi `useEvents()`, render grid `<EventCard />`. Xử lý 3 trạng thái: loading (skeleton/spinner), error (thông báo lỗi), empty (chưa có sự kiện) |
| **Kết quả** | Trang chủ hiển thị danh sách sự kiện thật từ MongoDB (qua API), bố cục responsive grid 1-2-3 cột |

---

### 🏁 Mốc hoàn thành Phase 1

> Cả 2 người chạy `npm run dev` → Backend port 5000, Frontend port 5173. Trang chủ hiển thị danh sách sự kiện thật từ DB. NavBar hiển thị nhưng chưa có logic auth.

---

## PHASE 2 · AUTHENTICATION — Luồng đăng nhập Google OAuth 2.0

> **Mục tiêu:** User click "Đăng nhập" → redirect sang Google → quay lại app với JWT → Frontend lưu token và hiển thị thông tin user.

---

### TASK 2.1 ✅ · Cấu hình Google OAuth Strategy (Passport.js)

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhân |
| **Trạng thái** | ✅ Đã xong |
| **File liên quan** | `backend/src/config/googleOAuth.js`, `backend/src/services/auth/findOrCreateUser.js` |
| **Kết quả** | Passport strategy nhận profile từ Google, tìm hoặc tạo User trong MongoDB, trả về user object |

---

### TASK 2.2 ✅ · API routes cho Auth + JWT callback

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhân |
| **Trạng thái** | ✅ |
| **File liên quan** | `backend/src/rest/routes/authRoutes.js`, `backend/src/rest/handlers/auth/googleCallbackHandler.js` |
| **Kết quả** | `GET /api/auth/google` → redirect đến Google. Google callback → tạo JWT → redirect về `FRONTEND_URL/auth/callback?token=xxx` |

---

### TASK 2.3 ✅ · Tạo API endpoint lấy thông tin User hiện tại

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhân |
| **Trạng thái** | ✅ Đã xong |
| **File/Thư mục** | Tạo mới 2 file + sửa 1 file |
| **Định hướng triển khai** | Chi tiết từng file: |

| File cần tạo/sửa | Nội dung |
|-------------------|----------|
| `services/auth/getUserProfile.js` | Export hàm `getUserProfile(userId)` — gọi `User.findById(userId).select("-__v")`, return user document |
| `rest/handlers/auth/getMeHandler.js` | Lấy `req.user.userId` từ JWT (đã decode bởi `validateJwt`), gọi `getUserProfile`, trả `{ success: true, data: user }` |
| `rest/routes/authRoutes.js` (sửa) | Thêm route: `router.get("/me", validateJwt, asyncHandler(getMeHandler))` |

**Lý do cần endpoint này:** Frontend cần gọi để lấy thông tin user (displayName, avatar, email) sau khi đã có JWT, vì JWT chỉ chứa `userId` + `email`.

| **Kết quả** | `GET /api/auth/me` (kèm header `Authorization: Bearer <token>`) → `{ success: true, data: { _id, googleId, email, displayName, avatar } }` |

---

### TASK 2.4 🔲 · Tạo AuthContext (quản lý trạng thái auth toàn app)

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhật |
| **File/Thư mục** | `ui/src/context/AuthContext.jsx` (hiện 0 bytes) |
| **Định hướng triển khai** | 1. Tạo `AuthContext` bằng `createContext()`. 2. Tạo `AuthProvider` component quản lý state `{ user, token, loading }`. 3. Khi mount (`useEffect` lần đầu): kiểm tra `localStorage.getItem("jwt_token")`. Nếu có token → gọi `GET /api/auth/me` để lấy thông tin user. Nếu API trả lỗi 401 → xóa token khỏi localStorage, set user = null. 4. Export 3 hàm qua context value: **`login(token)`** — lưu token vào localStorage, gọi `/api/auth/me`, set user. **`logout()`** — xóa token khỏi localStorage, set user = null. **`isAuthenticated`** — computed boolean (`user !== null`). 5. Wrap `<AuthProvider>` quanh toàn bộ app trong `App.jsx` (bên trong `<BrowserRouter>`) |
| **Kết quả** | Bất kỳ component nào cũng có thể `const { user, login, logout } = useContext(AuthContext)` để biết user đã đăng nhập chưa |

---

### TASK 2.5 🔲 · Tạo LoginPage + xử lý OAuth callback

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhật |
| **File/Thư mục** | `ui/src/pages/LoginPage.jsx` (0 bytes), tạo mới `ui/src/pages/AuthCallbackPage.jsx` |
| **Định hướng triển khai** | **File 1 — `LoginPage.jsx`:** Giao diện đơn giản — logo dự án, mô tả "Nền tảng săn vé sự kiện", nút "Đăng nhập với Google" (có icon Google). Click nút → `window.location.href = "/api/auth/google"` (full-page redirect sang Google). Nếu user đã đăng nhập (check AuthContext) → `navigate("/")` tự động. **File 2 — `AuthCallbackPage.jsx`:** Route `/auth/callback`. Khi mount: đọc `token` từ URL search params bằng `new URLSearchParams(window.location.search).get("token")`. Gọi `login(token)` từ AuthContext. Sau khi login thành công → `navigate("/")`. Hiển thị spinner "Đang xử lý đăng nhập..." trong lúc chờ. Nếu không có token trong URL → hiển thị lỗi + link về trang Login. Thêm route trong `App.jsx`: `<Route path="/auth/callback" element={<AuthCallbackPage />} />` |
| **Kết quả** | Luồng hoàn chỉnh: User click đăng nhập → Google → callback → lưu JWT → về trang chủ với NavBar hiển thị avatar + tên |

---

### TASK 2.6 🔲 · Cập nhật NavBar hiển thị trạng thái auth thật

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhật |
| **File/Thư mục** | `ui/src/components/NavBar.jsx` |
| **Định hướng triển khai** | Sửa NavBar để đọc từ AuthContext thay vì props tĩnh. `const { user, logout } = useContext(AuthContext)`. **Nếu `user` tồn tại:** hiển thị `<img src={user.avatar} />` (ảnh tròn), `user.displayName`, nút "Vé của tôi" → link đến `/my-tickets`, nút "Đăng xuất" → gọi `logout()` rồi `navigate("/login")`. **Nếu chưa đăng nhập:** nút "Đăng nhập" → link đến `/login` |
| **Kết quả** | NavBar phản ánh đúng trạng thái auth — đăng nhập/đăng xuất cập nhật realtime |

---

### 🏁 Mốc hoàn thành Phase 2

> User click "Đăng nhập" → redirect Google → quay lại → NavBar hiển thị avatar + tên. Refresh trang không mất session (JWT trong localStorage). Đăng xuất xóa token, về trang Login.

---

## PHASE 3 · EVENT MANAGEMENT — Quản lý sự kiện

> **Mục tiêu:** Admin CRUD sự kiện (khi tạo event mới, tự đồng bộ counter vào Redis). User xem danh sách có real-time ticket count.

---

### TASK 3.1 🔲 · Thêm trường `role` vào UserModel

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhân |
| **File/Thư mục** | `backend/src/models/UserModel.js` |
| **Định hướng triển khai** | Thêm field: `role: { type: String, enum: ["user", "admin"], default: "user" }`. Cách set admin: vào MongoDB Atlas web UI (Collections tab), tìm user document, sửa `role` thành `"admin"`. Hoặc thêm logic trong `seed.js` |
| **Kết quả** | API `/api/auth/me` trả thêm field `role`. Frontend dựa vào đây để hiện/ẩn UI Admin |

---

### TASK 3.2 🔲 · Tạo middleware phân quyền `requireAdmin`

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhân |
| **File/Thư mục** | Tạo mới: `backend/src/rest/middlewares/requireAdmin.js` |
| **Định hướng triển khai** | Middleware này chạy SAU `validateJwt`. Logic: đọc `req.user.userId` → query `User.findById()` → kiểm tra `user.role === "admin"`. Nếu không phải → `throw new AppError("Bạn không có quyền truy cập", 403)`. **Lưu ý:** JWT hiện chỉ chứa `userId` + `email`, không chứa `role` → phải query DB mỗi lần (đảm bảo role luôn up-to-date) |
| **Kết quả** | Các route Admin sẽ dùng chain: `validateJwt, requireAdmin, asyncHandler(handler)` |

---

### TASK 3.3 🔲 · Backend CRUD API cho Events

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhân |
| **Tạo mới** | 4 file (chi tiết bên dưới) |

| File cần tạo | Chức năng | Kết quả trả về |
|--------------|-----------|----------------|
| `services/event/createEvent.js` | Nhận `{ title, description, date, location, totalTickets }`. Tạo Event document (set `availableTickets = totalTickets`). **Quan trọng:** sau khi tạo xong, gọi `redisClient.set(REDIS_KEYS.EVENT_TICKETS(event._id), event.totalTickets)` để sẵn sàng cho Flash Sale | `event` document |
| `services/event/updateEvent.js` | Nhận `(eventId, updateData)`. Dùng `findByIdAndUpdate` với `{ new: true, runValidators: true }`. Không cho sửa `totalTickets` nếu đã có vé bán (kiểm tra `totalTickets !== availableTickets`) | Updated event |
| `rest/handlers/event/createEventHandler.js` | Đọc `req.body`, gọi `createEvent`, trả HTTP 201 | `{ success: true, data: event }` |
| `rest/handlers/event/updateEventHandler.js` | Đọc `req.params.eventId` + `req.body`, gọi `updateEvent`, trả HTTP 200 | `{ success: true, data: event }` |

**Cập nhật `eventRoutes.js`** — thêm 2 route mới:
```javascript
const validateJwt = require("../middlewares/validateJwt");
const requireAdmin = require("../middlewares/requireAdmin");

router.post("/", validateJwt, requireAdmin, asyncHandler(createEventHandler));
router.put("/:eventId", validateJwt, requireAdmin, asyncHandler(updateEventHandler));
```

| **Kết quả** | Admin gọi `POST /api/events` → tạo event + sync Redis. `PUT /api/events/:id` → cập nhật event |

---

### TASK 3.4 🔲 · Frontend: Trang Admin quản lý sự kiện

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhật |
| **File/Thư mục** | Tạo mới: `ui/src/pages/AdminEventsPage.jsx`, `ui/src/components/EventForm.jsx` |
| **Định hướng triển khai** | **`AdminEventsPage.jsx`:** Kiểm tra `user.role === "admin"` (từ AuthContext), nếu không phải admin → redirect về `/`. Hiển thị bảng danh sách sự kiện (dùng `useEvents`), mỗi dòng có nút "Sửa". Phía trên có nút "➕ Tạo sự kiện mới" mở form. **`EventForm.jsx`:** Form component dùng chung cho Tạo lẫn Sửa. Fields: `title` (text input), `description` (textarea), `date` (date picker), `location` (text input), `totalTickets` (number input). Props: `initialData` (null → tạo mới, object → chế độ sửa), `onSubmit(formData)`, `loading`. Khi submit: nếu tạo mới → `api.post("/api/events", data)`, nếu sửa → `api.put("/api/events/" + id, data)`. Thêm route trong `App.jsx`: `<Route path="/admin/events" element={<AdminEventsPage />} />`. Thêm link "⚙️ Quản lý" trên NavBar nếu `user.role === "admin"` |
| **Kết quả** | Admin truy cập `/admin/events` → thấy bảng danh sách + form tạo/sửa. Tạo event xong → xuất hiện ở trang chủ |

---

### 🏁 Mốc hoàn thành Phase 3

> Admin tạo sự kiện mới → MongoDB có data + Redis có counter. User xem trang chủ thấy event mới. Trang Admin được bảo vệ bởi middleware `requireAdmin`.

---

## PHASE 4 · THE CORE — Flash Sale Ticketing

> **Mục tiêu:** Phần quan trọng nhất của đồ án. 1000 người cùng click "Đặt vé" → hệ thống xử lý chính xác, không bán lố.
>
> ⚠️ **Phase này cần Nhân và Nhật phối hợp chặt chẽ. Đọc kỹ hướng dẫn ráp nối API bên dưới.**

---

### TASK 4.1 ✅ · Backend: Ticket Booking Pipeline (Redis + BullMQ)

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhân |
| **Trạng thái** | ✅ Code đã xong hoàn chỉnh |
| **File liên quan** | `services/ticket/checkIdempotency.js`, `services/ticket/enqueueTicketJob.js`, `services/ticket/bookTicket.js`, `queues/ticketWorkerProcessor.js`, `worker.js` |
| **⚡ Hành động cần làm** | Mở `backend/src/rest/router.js`, **bỏ comment** dòng: `router.use("/tickets", require("./routes/ticketRoutes"));` |

---

### 📐 HƯỚNG DẪN RÁP NỐI API — Nhật đọc kỹ phần này

**Luồng xử lý đã implement trên Backend (Nhật cần hiểu để code Frontend đúng):**

```
User click "Đặt vé"
  │
  ▼
Frontend: POST /api/tickets  { eventId }  (kèm JWT header)
  │
  ▼ Backend xử lý:
  │  1. validateJwt         → decode userId từ JWT
  │  2. ticketLimiter        → max 10 req / 15 phút
  │  3. checkIdempotency     → Redis SET NX (chặn đặt trùng)
  │  4. enqueueTicketJob     → đẩy job vào BullMQ queue
  │  5. Response ngay lập tức: HTTP 202 Accepted
  │
  ▼ Response body:
  │  { success: true, message: "Yêu cầu đang xử lý", data: { jobId: "123" } }
  │
  ▼ Worker (process riêng, chạy song song) nhận job:
  │  1. Redis DECR event:{id}:tickets
  │     → Nếu >= 0: còn vé → tạo Ticket + update Event
  │     → Nếu < 0: hết vé → INCR lại → throw OutOfTicketsError
  │
  ▼
Frontend: Polling GET /api/tickets/status/:jobId  (mỗi 2 giây)
  │
  ▼ Response body:
  │  {
  │    success: true,
  │    data: {
  │      jobId: "123",
  │      state: "completed" | "failed" | "waiting" | "active",
  │      result: { ticketId: "abc" } | null,
  │      failedReason: "Sự kiện đã hết vé" | null
  │    }
  │  }
  │
  ▼
Frontend hiển thị kết quả:
  → state "completed"  → "🎉 Đặt vé thành công!"
  → state "failed"     → "❌ " + failedReason
  → state "waiting/active" → tiếp tục polling
```

**Các mã lỗi Frontend cần xử lý:**

| HTTP Status | Khi nào xảy ra | Message từ Backend | Frontend hiện |
|-------------|-----------------|-------------------|---------------|
| 202 | Đặt vé thành công (đã vào queue) | "Yêu cầu đang xử lý" | Chuyển sang polling |
| 401 | Chưa đăng nhập / JWT hết hạn | "Vui lòng đăng nhập" | Redirect `/login` |
| 409 | Đặt trùng (idempotency) | "Bạn đã đặt vé rồi" | Hiện thông báo, disable nút |
| 429 | Rate limit (spam quá nhiều) | "Quá nhiều request" | Hiện thông báo chờ |

---

### TASK 4.2 🔲 · Frontend: Hook `useBookTicket` — logic đặt vé + polling

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhật |
| **File/Thư mục** | Tạo mới: `ui/src/hooks/useBookTicket.js` |
| **Định hướng triển khai** | Đây là hook **quan trọng nhất** của Frontend, cần xử lý đúng luồng async 2 bước (submit → polling). |

**Skeleton code (Nhật implement chi tiết theo đây):**

```javascript
// ui/src/hooks/useBookTicket.js
import { useState, useRef, useCallback } from "react";
import api from "../services/api";

const POLL_INTERVAL = 2000;   // Polling mỗi 2 giây
const POLL_TIMEOUT  = 30000;  // Timeout sau 30 giây

export default function useBookTicket() {
  // status: "idle" | "submitting" | "queued" | "completed" | "failed"
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const bookTicket = useCallback(async (eventId) => {
    setStatus("submitting");
    setError(null);

    try {
      // ── Bước 1: Gửi yêu cầu đặt vé → nhận jobId ──
      const { data } = await api.post("/api/tickets", { eventId });
      const { jobId } = data.data;

      setStatus("queued");

      // ── Bước 2: Polling trạng thái job ──
      const startTime = Date.now();
      intervalRef.current = setInterval(async () => {
        // Timeout protection
        if (Date.now() - startTime > POLL_TIMEOUT) {
          stopPolling();
          setStatus("failed");
          setError("Quá thời gian chờ, vui lòng thử lại sau");
          return;
        }
        try {
          const res = await api.get(`/api/tickets/status/${jobId}`);
          const { state, failedReason } = res.data.data;

          if (state === "completed") {
            stopPolling();
            setStatus("completed");
          } else if (state === "failed") {
            stopPolling();
            setStatus("failed");
            setError(failedReason || "Đặt vé thất bại");
          }
          // "waiting" hoặc "active" → tiếp tục polling
        } catch {
          stopPolling();
          setStatus("failed");
          setError("Lỗi kiểm tra trạng thái");
        }
      }, POLL_INTERVAL);

    } catch (err) {
      // Xử lý lỗi từ bước 1 (409, 429, 401...)
      setStatus("failed");
      setError(err.response?.data?.message || "Lỗi gửi yêu cầu đặt vé");
    }
  }, [stopPolling]);

  const reset = useCallback(() => {
    stopPolling();
    setStatus("idle");
    setError(null);
  }, [stopPolling]);

  return { status, error, bookTicket, reset };
}
```

| **Kết quả** | Hook trả về `{ status, error, bookTicket, reset }`. Component gọi `bookTicket(eventId)` và render UI dựa trên `status` |

---

### TASK 4.3 🔲 · Frontend: Cập nhật EventCard — nút "Đặt vé" hoạt động thật

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhật |
| **File/Thư mục** | `ui/src/components/EventCard.jsx` |
| **Định hướng triển khai** | 1. Import `useBookTicket` từ hooks. 2. Nút "Đặt Vé Ngay" gọi `bookTicket(event._id)`. Kiểm tra `isAuthenticated` trước — nếu chưa đăng nhập → `navigate("/login")`. 3. **Hiển thị trạng thái trên nút theo `status`:** |

| `status` | Text nút | Màu Tailwind | Trạng thái |
|----------|----------|--------------|------------|
| `"idle"` | 🎟️ Đặt Vé Ngay | `bg-blue-600` | Clickable |
| `"submitting"` | ⏳ Đang gửi... | `bg-gray-400` | Disabled |
| `"queued"` | ⏳ Đang xử lý... | `bg-yellow-500 animate-pulse` | Disabled |
| `"completed"` | ✅ Đặt vé thành công! | `bg-green-500` | Disabled |
| `"failed"` | ❌ {error} | `bg-red-500` | Hiện thêm nút "Thử lại" gọi `reset()` |

4. Khi `status === "completed"`, giảm `availableTickets` hiển thị đi 1 (update local state hoặc refetch danh sách events).

| **Kết quả** | User click Đặt vé → nút chuyển trạng thái realtime theo pipeline → hiện kết quả cuối cùng |

---

### TASK 4.4 🔲 · Frontend: Trang "Vé của tôi"

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhật |
| **File/Thư mục** | Tạo mới: `ui/src/pages/MyTicketsPage.jsx`, `ui/src/hooks/useMyTickets.js` |
| **Định hướng triển khai** | **`useMyTickets.js`:** Gọi `GET /api/tickets/my` (handler đã có sẵn trên Backend). Return `{ tickets, loading, error }`. Mỗi ticket object có dạng: `{ _id, event: { title, date, location }, status, createdAt }` (do Backend đã `.populate("event", "title date location")`). **`MyTicketsPage.jsx`:** Kiểm tra auth — chưa đăng nhập thì redirect. Hiển thị danh sách vé dạng card hoặc table. Mỗi vé hiện: tên sự kiện, ngày, địa điểm, trạng thái (badge màu: `confirmed` = xanh lá, `pending` = vàng, `cancelled` = đỏ), ngày đặt (format từ `createdAt`). Empty state: "Bạn chưa đặt vé nào." Thêm route: `<Route path="/my-tickets" element={<MyTicketsPage />} />` |
| **Kết quả** | User xem được danh sách vé đã đặt thành công, có trạng thái rõ ràng |

---

### TASK 4.5 🔲 · Chạy Worker song song & Test end-to-end

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhân + Nhật (cùng test) |
| **Quy trình test** | Thực hiện tuần tự: |

**Bước 1 — Mở 3 terminal:**
```bash
# Terminal 1: API Server
npm run dev:backend

# Terminal 2: BullMQ Worker
npm run worker:dev --workspace=modules/backend

# Terminal 3: Frontend
npm run dev:ui
```

**Bước 2 — Seed lại data sạch:**
```bash
npm run seed --workspace=modules/backend
```

**Bước 3 — Test luồng happy path:**
1. Mở browser `localhost:5173`, đăng nhập Google.
2. Mở DevTools → tab Network.
3. Click "Đặt Vé Ngay" trên 1 event.
4. Quan sát: `POST /api/tickets` trả 202, sau đó chuỗi `GET /api/tickets/status/:jobId` cho đến khi `completed`.
5. Vào trang "Vé của tôi" → thấy vé mới.

**Bước 4 — Test edge cases:**

| Test case | Hành động | Kết quả mong đợi |
|-----------|-----------|-------------------|
| Đặt trùng | Click "Đặt vé" lần 2 cho cùng event | HTTP 409: "Bạn đã đặt vé rồi" |
| Hết vé | Seed event với `totalTickets: 1`, đặt 1 vé, rồi đặt lại bằng user khác | Job failed: "Sự kiện đã hết vé" |
| Chưa đăng nhập | Gọi `POST /api/tickets` không có JWT | HTTP 401 |
| Rate limit | Gửi 11 request liên tiếp trong 15 phút | HTTP 429 từ request thứ 11 |

**Bước 5 — Verify data:**
- MongoDB Atlas: collection `tickets` có document mới với `status: "confirmed"`.
- Redis (qua Upstash Console): key `event:{id}:tickets` giảm đúng số lượng.

---

### 🏁 Mốc hoàn thành Phase 4

> Luồng Flash Sale hoạt động end-to-end: User đặt vé → Backend xử lý qua Redis + BullMQ → Frontend polling → hiện kết quả. Đặt trùng bị chặn. Hết vé bị chặn. Trang "Vé của tôi" hiển thị vé đã đặt.

---

## PHASE 5 · CLOUD DEPLOYMENT & TESTING

> **Mục tiêu:** Deploy lên cloud, ứng dụng chạy được trên internet, viết tài liệu, nộp bài.

---

### TASK 5.1 🔲 · Chuẩn bị build production

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhân |
| **File/Thư mục** | `backend/src/index.js` (đã có logic serve static), `package.json` root |
| **Định hướng triển khai** | 1. Chạy `npm start` từ root → verify: build UI thành công (`modules/ui/dist/` có file), Backend serve static. 2. Truy cập `http://localhost:5000` → phải thấy giao diện Frontend đầy đủ. 3. Test tất cả chức năng: trang chủ, đăng nhập, đặt vé, vé của tôi. 4. Code serve static đã có sẵn trong `index.js` (regex SPA catch-all cho non-API routes) |
| **Kết quả** | `npm start` → toàn bộ app hoạt động trên 1 port duy nhất (production mode) |

---

### TASK 5.2 🔲 · Deploy Backend + Worker lên Render.com

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhân |
| **Định hướng triển khai** | Thực hiện tuần tự: |

**Bước 1 — Push lên GitHub:**
```bash
git add -A && git commit -m "Production ready" && git push origin main
```

**Bước 2 — Tạo Web Service trên Render (cho API + Frontend):**

| Cấu hình | Giá trị |
|-----------|---------|
| Build Command | `npm install && npm run build:all` |
| Start Command | `node modules/backend/src/index.js` |
| Environment | `NODE_ENV=production`, `SERVE_UI=true` |
| Thêm tất cả biến `.env` | MONGODB_URI, REDIS_URL, JWT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, CORS_ORIGIN, FRONTEND_URL |

**Bước 3 — Tạo Background Worker trên Render (cho BullMQ):**

| Cấu hình | Giá trị |
|-----------|---------|
| Start Command | `node modules/backend/src/worker.js` |
| Environment | Cùng env vars như Web Service |

**Bước 4 — Cập nhật Google Cloud Console:**
- Thêm `https://your-app.onrender.com/api/auth/google/callback` vào "Authorized redirect URIs"
- Cập nhật env vars trên Render: `GOOGLE_CALLBACK_URL`, `CORS_ORIGIN`, `FRONTEND_URL` trỏ về domain Render

**Bước 5 — Seed data trên production:**
- Set env vars local trỏ về MongoDB Atlas production cluster
- Chạy `npm run seed --workspace=modules/backend`

| **Kết quả** | `https://your-app.onrender.com` → app chạy hoàn chỉnh trên internet |

---

### TASK 5.3 🔲 · Frontend: Polish UI & Responsive

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhật |
| **File/Thư mục** | Tất cả components và pages |
| **Định hướng triển khai** | 1. Test mobile viewport (Chrome DevTools responsive). 2. NavBar: collapse thành hamburger trên màn nhỏ. 3. Grid sự kiện: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. 4. Form và button đủ lớn để tap trên mobile. 5. Thêm meta tags trong `index.html` (title, description). 6. Loading states: dùng skeleton UI thay vì text "Đang tải" |
| **Kết quả** | Giao diện đẹp, responsive trên cả desktop và mobile |

---

### TASK 5.4 🔲 · Viết tài liệu hướng dẫn sử dụng

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhân + Nhật |
| **Phân chia** | **Nhân:** cập nhật `README.md` (thay placeholder bằng link Render thật, email Admin test). **Nhật:** chụp screenshot các trang chính (events, đặt vé, vé của tôi, admin panel). Cùng viết mục "Hướng dẫn sử dụng" trong Báo cáo Word |
| **Kết quả** | Tài liệu hoàn chỉnh, có hình minh họa |

---

### TASK 5.5 🔲 · Kiểm tra final checklist trước nộp

| Mục | Chi tiết |
|-----|---------|
| **Người phụ trách** | Nhân (review toàn bộ) |

**Checklist theo yêu cầu đề bài (SEE910):**

| # | Tiêu chí đề bài | Cách verify |
|---|-----------------|-------------|
| 1 | Sử dụng tối thiểu 1 dịch vụ cloud | ✅ MongoDB Atlas + Upstash Redis + Google OAuth = 3 dịch vụ |
| 2 | Deploy mã nguồn + CSDL lên cloud, không localhost | Truy cập link Render → app chạy |
| 3 | Tự xây dựng, không copy source có sẵn | Toàn bộ code tự viết |
| 4 | Trang web chạy được | Test tất cả chức năng trên link deploy |
| 5 | Dung lượng nén ≤ 100MB | Chạy: `du -sh` (loại `node_modules`, `.git`) |
| 6 | Có source code | ✅ Trong file zip |
| 7 | Có mô tả CSDL | ✅ Báo cáo Word chương 3 |
| 8 | Có hướng dẫn sử dụng + tài khoản | ✅ Trong README |
| 9 | Có link truy cập | Cập nhật link Render vào README |

---

## 📊 TỔNG HỢP PHÂN CÔNG

| Phase | Nhân (Backend) | Nhật (Frontend) | Ghi chú |
|-------|---------------|-----------------|---------|
| **1 — Foundation** | ✅ 1.1, 1.2, 1.3, 1.4 | 🔲 1.5, 1.6, 1.7 | Nhật bắt đầu từ đây |
| **2 — Auth** | ✅ 2.1, 2.2 + 🔲 2.3 | 🔲 2.4, 2.5, 2.6 | Nhân làm 2.3 song song với Nhật làm 2.4 |
| **3 — Events** | 🔲 3.1, 3.2, 3.3 | 🔲 3.4 | Nhân xong 3.3 thì Nhật mới bắt đầu 3.4 |
| **4 — Flash Sale** | ✅ 4.1 + 🔲 4.5 | 🔲 4.2, 4.3, 4.4 | Nhật cần đọc kỹ phần "Ráp nối API" |
| **5 — Deploy** | 🔲 5.1, 5.2, 5.4, 5.5 | 🔲 5.3, 5.4 | Cùng test + viết docs |

### Tổng đếm task

| | ✅ Đã xong | 🔲 Còn lại |
|--|-----------|-----------|
| **Nhân** | 6 task | 6 task mới |
| **Nhật** | 0 task | 10 task |
| **Tổng** | 6 / 22 | 16 / 22 |

> **Gợi ý tiến độ:** Nhật ưu tiên Phase 1 (1.5 → 1.6 → 1.7) trước, chạy được data thật rồi mới qua Phase 2. Nhân trong lúc đó làm song song Task 2.3 + 3.1 + 3.2 + 3.3 để khi Nhật đến Phase 3–4 thì Backend đã sẵn sàng.
