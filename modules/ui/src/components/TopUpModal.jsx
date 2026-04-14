/**
 * TopUpModal.jsx — Module: UI | Flash Sale Project
 * Modal nạp tiền vào tài khoản (Top-up Simulator).
 * Design: Cyberpunk/Vaporwave — màu nền NAVY_DARK theo uiConstants.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { THEME_COLORS, SHADOWS, TYPOGRAPHY } from "../constants/uiConstants.js";
import api from "../services/api.js";

// ── Preset amounts để nạp nhanh (không hardcode, tính từ đơn vị cơ bản) ──────
const QUICK_AMOUNTS = [100_000, 500_000, 1_000_000, 2_000_000, 5_000_000];

// ── Animation variants ─────────────────────────────────────────────────────────
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 22 }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.18 }
  }
};

// ── Helper format VNĐ ──────────────────────────────────────────────────────────
const formatVND = value =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

// ── Main Component ─────────────────────────────────────────────────────────────

/**
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
const TopUpModal = ({ isOpen, onClose }) => {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();

  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState("");

  // ── Đặt lại state khi đóng modal ────────────────────────────────────────────
  const handleClose = () => {
    if (status === "loading") return; // Ngăn đóng giữa chừng
    setAmount("");
    setStatus("idle");
    setErrorMsg("");
    onClose();
  };

  // ── Chọn nhanh số tiền preset ────────────────────────────────────────────────
  const handleQuickAmount = preset => {
    setAmount(String(preset));
    setStatus("idle");
    setErrorMsg("");
  };

  // ── Submit nạp tiền ──────────────────────────────────────────────────────────
  const handleSubmit = async e => {
    e.preventDefault();

    const parsedAmount = Number(amount);

    // Client-side validation
    if (!amount || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setStatus("error");
      setErrorMsg(t("topup_error_invalid"));
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      await api.post("/users/topup", { amount: parsedAmount });

      // Đồng bộ lại user.balance trong AuthContext (Global State)
      await refreshUser();

      setStatus("success");

      // Tự động đóng modal sau 1.8 giây
      setTimeout(() => {
        handleClose();
      }, 1800);
    } catch (err) {
      console.error("[Top-up] ❌ Lỗi khi nạp tiền:", err);
      setStatus("error");
      setErrorMsg(
        err?.response?.data?.message || t("topup_error_server")
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ─────────────────────────────────────────────── */}
          <motion.div
            id="topup-modal-backdrop"
            key="topup-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* ── Modal Panel ──────────────────────────────────────────── */}
          <motion.div
            id="topup-modal-panel"
            key="topup-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md rounded-2xl overflow-hidden pointer-events-auto"
              style={{
                background: THEME_COLORS.NAVY_DARK,
                border: `1px solid ${THEME_COLORS.PRIMARY_GLOW}`,
                boxShadow: `${SHADOWS.NEON_PRIMARY}, 0 25px 60px rgba(0,0,0,0.9)`
              }}
            >
              {/* ── Decorative scan-line ────────────────────────────── */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${THEME_COLORS.PRIMARY}, transparent)` }}
              />

              {/* ── Header ─────────────────────────────────────────── */}
              <div className="px-6 pt-6 pb-4 border-b border-white/5">
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className="text-[9px] font-mono tracking-[0.3em] mb-1"
                      style={{ color: THEME_COLORS.PRIMARY, fontFamily: TYPOGRAPHY.TECH }}
                    >
                      ◈ TRANSACTION_MODULE_v2
                    </p>
                    <h2
                      className="text-lg font-black text-white uppercase tracking-tight"
                      style={{ fontFamily: TYPOGRAPHY.HEADING }}
                    >
                      {t("topup_modal_title")}
                    </h2>
                    <p className="text-xs text-white/40 mt-0.5">{t("topup_modal_subtitle")}</p>
                  </div>
                  <button
                    id="topup-modal-close-btn"
                    onClick={handleClose}
                    disabled={status === "loading"}
                    className="text-white/30 hover:text-white transition-colors text-xl leading-none p-1 disabled:opacity-30"
                  >
                    ✕
                  </button>
                </div>

                {/* Current Balance Display */}
                <div
                  className="mt-4 px-4 py-3 rounded-lg flex items-center justify-between"
                  style={{ background: "rgba(255,0,255,0.07)", border: "1px solid rgba(255,0,255,0.15)" }}
                >
                  <span
                    className="text-[10px] font-mono tracking-widest text-white/50 uppercase"
                    style={{ fontFamily: TYPOGRAPHY.TECH }}
                  >
                    {t("topup_current_balance")}
                  </span>
                  <span
                    className="text-base font-black"
                    style={{ color: THEME_COLORS.PRIMARY, fontFamily: TYPOGRAPHY.TECH, textShadow: "0 0 10px rgba(255,0,255,0.5)" }}
                  >
                    {formatVND(user?.balance || 0)}
                  </span>
                </div>
              </div>

              {/* ── Body ───────────────────────────────────────────── */}
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

                {/* Quick Amount Buttons */}
                <div>
                  <p
                    className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-2"
                    style={{ fontFamily: TYPOGRAPHY.TECH }}
                  >
                    {t("topup_quick_amount")}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {QUICK_AMOUNTS.map(preset => (
                      <button
                        key={preset}
                        type="button"
                        id={`topup-quick-${preset}`}
                        onClick={() => handleQuickAmount(preset)}
                        className="py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all duration-200"
                        style={{
                          fontFamily: TYPOGRAPHY.TECH,
                          background: String(amount) === String(preset)
                            ? THEME_COLORS.PRIMARY
                            : "rgba(255,255,255,0.05)",
                          color: String(amount) === String(preset)
                            ? THEME_COLORS.BLACK
                            : "rgba(255,255,255,0.6)",
                          border: `1px solid ${String(amount) === String(preset)
                            ? THEME_COLORS.PRIMARY
                            : "rgba(255,255,255,0.1)"}`,
                          boxShadow: String(amount) === String(preset)
                            ? SHADOWS.NEON_PRIMARY
                            : "none"
                        }}
                      >
                        {formatVND(preset)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manual Amount Input */}
                <div>
                  <label
                    htmlFor="topup-amount-input"
                    className="block text-[9px] font-mono tracking-widest text-white/50 uppercase mb-2"
                    style={{ fontFamily: TYPOGRAPHY.TECH }}
                  >
                    {t("topup_label_amount")}
                  </label>
                  <div className="relative">
                    <input
                      id="topup-amount-input"
                      type="number"
                      min="1000"
                      step="1000"
                      value={amount}
                      onChange={e => {
                        setAmount(e.target.value);
                        setStatus("idle");
                        setErrorMsg("");
                      }}
                      placeholder={t("topup_placeholder")}
                      disabled={status === "loading" || status === "success"}
                      className="w-full px-4 py-3 rounded-lg text-white placeholder-white/20 text-sm font-mono outline-none transition-all duration-200 disabled:opacity-50"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: `1px solid ${status === "error" ? THEME_COLORS.DANGER : "rgba(255,255,255,0.1)"}`,
                        fontFamily: TYPOGRAPHY.TECH,
                        boxShadow: status === "error" ? `0 0 8px rgba(255,68,68,0.3)` : "none"
                      }}
                      onFocus={e => {
                        e.target.style.border = `1px solid ${THEME_COLORS.PRIMARY_GLOW}`;
                        e.target.style.boxShadow = `0 0 12px rgba(255,0,255,0.2)`;
                      }}
                      onBlur={e => {
                        e.target.style.border = `1px solid ${status === "error" ? THEME_COLORS.DANGER : "rgba(255,255,255,0.1)"}`;
                        e.target.style.boxShadow = status === "error" ? `0 0 8px rgba(255,68,68,0.3)` : "none";
                      }}
                    />
                    <span
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold"
                      style={{ color: THEME_COLORS.PRIMARY, fontFamily: TYPOGRAPHY.TECH }}
                    >
                      VNĐ
                    </span>
                  </div>

                  {/* Live formatted preview */}
                  {Number(amount) > 0 && (
                    <p className="text-[10px] text-white/30 mt-1.5 font-mono">
                      ≈ {formatVND(Number(amount))}
                    </p>
                  )}
                </div>

                {/* Status Messages */}
                <AnimatePresence mode="wait">
                  {status === "error" && errorMsg && (
                    <motion.div
                      key="error-msg"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="px-4 py-2.5 rounded-lg text-xs font-mono"
                      style={{
                        background: "rgba(255,68,68,0.1)",
                        border: `1px solid ${THEME_COLORS.DANGER}`,
                        color: THEME_COLORS.DANGER,
                        fontFamily: TYPOGRAPHY.TECH
                      }}
                    >
                      ⚠ {errorMsg}
                    </motion.div>
                  )}
                  {status === "success" && (
                    <motion.div
                      key="success-msg"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-4 py-2.5 rounded-lg text-xs font-mono text-center"
                      style={{
                        background: "rgba(34,197,94,0.12)",
                        border: "1px solid rgba(34,197,94,0.4)",
                        color: "#22c55e",
                        fontFamily: TYPOGRAPHY.TECH
                      }}
                    >
                      {t("topup_success")} &nbsp;
                      <span className="text-white/50">
                        → {formatVND(user?.balance || 0)}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Action Buttons ────────────────────────────────── */}
                <div className="flex gap-3 pt-1">
                  <button
                    id="topup-cancel-btn"
                    type="button"
                    onClick={handleClose}
                    disabled={status === "loading"}
                    className="flex-1 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-40"
                    style={{
                      fontFamily: TYPOGRAPHY.TECH,
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.5)"
                    }}
                  >
                    {t("topup_btn_cancel")}
                  </button>

                  <button
                    id="topup-confirm-btn"
                    type="submit"
                    disabled={status === "loading" || status === "success" || !amount}
                    className="flex-[2] py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                    style={{
                      fontFamily: TYPOGRAPHY.TECH,
                      background:
                        status === "loading" || status === "success"
                          ? "rgba(255,0,255,0.3)"
                          : THEME_COLORS.PRIMARY,
                      color:
                        status === "loading" || status === "success"
                          ? THEME_COLORS.PRIMARY
                          : THEME_COLORS.BLACK,
                      border: `1px solid ${THEME_COLORS.PRIMARY}`,
                      boxShadow: status === "loading" || status === "success"
                        ? "none"
                        : SHADOWS.NEON_PRIMARY
                    }}
                  >
                    {status === "loading" ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ĐANG XỬ LÝ...
                      </span>
                    ) : status === "success" ? (
                      "✓ HOÀN THÀNH"
                    ) : (
                      t("topup_btn_confirm")
                    )}
                  </button>
                </div>
              </form>

              {/* ── Decorative bottom scan-line ───────────────────── */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${THEME_COLORS.SECONDARY}, transparent)` }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TopUpModal;
