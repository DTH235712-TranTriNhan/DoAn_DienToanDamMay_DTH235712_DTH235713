const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");

const { connectToServers } = require("./libs/connectToServers");
const mainRouter = require("./rest/router");

const app = express();

// ── Middleware Stack ─────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(morgan("dev"));

// ── Routes ───────────────────────────────────────────────────────
app.use("/api", mainRouter); // Tất cả routes đi qua mainRouter

if (process.env.NODE_ENV === "production" || process.env.SERVE_UI === "true") {
  const frontendPath = path.join(__dirname, "../../ui/dist");
  app.use(express.static(frontendPath));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ── Bootstrap ────────────────────────────────────────────────────
const bootstrap = async () => {
  await connectToServers(); // Kết nối MongoDB + Redis trước khi lắng nghe
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT}`);
  });
};

bootstrap();
