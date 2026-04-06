/**
 * AdminEventsPage.jsx — Module: UI | Flash Sale Project
 * Trang Quản trị Sự kiện — Chỉ dành cho Admin (role === 'admin').
 *
 * Chức năng:
 * - Bảo vệ route: Điều hướng về / nếu không phải admin
 * - Hiển thị danh sách sự kiện dạng Table chuyên nghiệp
 * - Tích hợp EventForm.jsx cho cả Tạo mới và Sửa (dạng Modal)
 * - Sau submit: gọi refetch() để cập nhật bảng, tiết kiệm Quota Redis
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import useEvents from '../hooks/useEvents.js';
import EventForm from '../components/EventForm.jsx';
import api from '../services/api.js';
import { THEME_COLORS, SHADOWS, TYPOGRAPHY } from '../constants/uiConstants.js';

// ─── Animation Variants ────────────────────────────────────────────────────────
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: -40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } },
  exit: { opacity: 0, y: 20, scale: 0.97, transition: { duration: 0.18 } },
};

// ─── Helper: Format ngày hiển thị trong bảng ──────────────────────────────────
const formatDate = (isoString) => {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return isoString;
  }
};

// ─── Sub-component: StatusBadge ───────────────────────────────────────────────
const StatusBadge = ({ event }) => {
  const sold = event.soldTickets ?? 0;
  const total = event.totalTickets ?? 1;
  const pct = Math.round((sold / total) * 100);
  const isOver = new Date(event.date) < new Date();

  let color = THEME_COLORS.SECONDARY;
  let label = 'AVAILABLE';
  if (isOver) { color = THEME_COLORS.TEXT_MUTED; label = 'ENDED'; }
  else if (pct >= 100) { color = '#FF4444'; label = 'SOLD OUT'; }
  else if (pct >= 80) { color = THEME_COLORS.ACCENT; label = 'ALMOST'; }

  return (
    <span
      style={{
        fontFamily: TYPOGRAPHY.TECH,
        color,
        border: `1px solid ${color}`,
        backgroundColor: `${color}18`,
        fontSize: '0.6rem',
      }}
      className="px-2 py-0.5 rounded uppercase tracking-widest whitespace-nowrap"
    >
      {label}
    </span>
  );
};

// ─── Sub-component: Modal bọc EventForm ───────────────────────────────────────
const EventModal = ({ isOpen, onClose, editEvent, onSubmit, isSubmitting, submitError }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          key="admin-modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-40 bg-black/70"
          onClick={onClose}
        />
        {/* Modal Panel */}
        <motion.div
          key="admin-modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        >
          <div
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl pointer-events-auto"
            style={{
              backgroundColor: 'rgba(9, 0, 20, 0.97)',
              border: `1px solid ${THEME_COLORS.PRIMARY_GLOW}`,
              boxShadow: `${SHADOWS.NEON_PRIMARY}, ${SHADOWS.CARD}`,
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: THEME_COLORS.PRIMARY_GLOW }}
            >
              <h2
                style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.PRIMARY, fontSize: '0.8rem' }}
                className="uppercase tracking-widest"
              >
                {editEvent ? '// SỬA SỰ KIỆN' : '// TẠO SỰ KIỆN MỚI'}
              </h2>
              <button
                id="admin-modal-close"
                onClick={onClose}
                style={{ color: THEME_COLORS.TEXT_MUTED, fontFamily: TYPOGRAPHY.TECH }}
                className="text-lg hover:text-white transition-colors"
                aria-label="Đóng modal"
              >
                ✕
              </button>
            </div>

            {/* Form body */}
            <div className="px-6 py-5">
              <EventForm
                initialData={editEvent}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                submitError={submitError}
              />
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
const AdminEventsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { events, loading: eventsLoading, error: eventsError, refetch } = useEvents();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null); // null = create mode
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ── Bảo vệ Route: Redirect nếu không phải admin ──────────────────────────
  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // ── Handlers Modal ─────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setEditEvent(null);
    setSubmitError('');
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditEvent(event);
    setSubmitError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return; // Không cho đóng khi đang submit
    setIsModalOpen(false);
    setEditEvent(null);
    setSubmitError('');
  };

  // ── Submit Handler ─────────────────────────────────────────────────────────
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      if (editEvent) {
        // Cập nhật: PUT /api/events/:id
        await api.put(`/events/${editEvent._id}`, formData);
        setSuccessMessage(`✅ Đã cập nhật sự kiện "${formData.title}" thành công!`);
      } else {
        // Tạo mới: POST /api/events
        await api.post('/events', formData);
        setSuccessMessage(`✅ Đã tạo sự kiện "${formData.title}" thành công!`);
      }

      closeModal();

      // Gọi refetch để cập nhật bảng mà KHÔNG tải lại trang → tiết kiệm Redis Quota
      await refetch();

      // Tự xóa thông báo sau 4 giây
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('[AdminEventsPage] Submit Error:', err);
      setSubmitError(err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render: Loading Auth ───────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <p style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.PRIMARY }}
          className="animate-pulse uppercase tracking-widest text-sm">
          VERIFYING_CREDENTIALS...
        </p>
      </div>
    );
  }

  // Guard: Không render nếu không phải admin (tránh flash nội dung)
  if (user?.role !== 'admin') return null;

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p
            style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.PRIMARY, fontSize: '0.65rem' }}
            className="uppercase tracking-widest mb-1"
          >
            // ADMIN_CONTROL_PANEL
          </p>
          <h1
            style={{ fontFamily: TYPOGRAPHY.HEADING, color: THEME_COLORS.WHITE }}
            className="text-3xl font-black uppercase tracking-wide"
          >
            Quản lý Sự kiện
            <span style={{ color: THEME_COLORS.PRIMARY, textShadow: `0 0 12px ${THEME_COLORS.PRIMARY}` }}>
              _
            </span>
          </h1>
          <p style={{ fontFamily: TYPOGRAPHY.BODY, color: THEME_COLORS.TEXT_MUTED }}
            className="text-sm mt-1">
            {events.length} sự kiện trong hệ thống
          </p>
        </div>

        {/* Nút Tạo mới */}
        <motion.button
          id="admin-create-event-btn"
          onClick={openCreateModal}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{
            fontFamily: TYPOGRAPHY.TECH,
            backgroundColor: THEME_COLORS.PRIMARY,
            color: THEME_COLORS.BLACK,
            boxShadow: SHADOWS.NEON_PRIMARY,
            border: `1px solid ${THEME_COLORS.PRIMARY}`,
          }}
          className="px-5 py-2.5 rounded text-sm font-bold uppercase tracking-widest whitespace-nowrap"
        >
          + Tạo Sự Kiện Mới
        </motion.button>
      </div>

      {/* ── Success Toast ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            key="success-toast"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              fontFamily: TYPOGRAPHY.BODY,
              color: THEME_COLORS.SECONDARY,
              borderColor: THEME_COLORS.SECONDARY,
              backgroundColor: 'rgba(0,255,255,0.06)',
            }}
            className="mb-6 px-5 py-3 rounded border text-sm"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading / Error States ───────────────────────────────────────── */}
      {eventsLoading && (
        <div className="flex justify-center py-16">
          <p style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.PRIMARY }}
            className="animate-pulse text-sm uppercase tracking-widest">
            LOADING_EVENT_DATA...
          </p>
        </div>
      )}

      {eventsError && !eventsLoading && (
        <div
          style={{
            fontFamily: TYPOGRAPHY.TECH,
            color: '#FF4444',
            border: '1px solid rgba(255,68,68,0.4)',
            backgroundColor: 'rgba(255,68,68,0.06)',
          }}
          className="px-6 py-4 rounded text-sm uppercase tracking-wide"
        >
          ⛔ {eventsError}
        </div>
      )}

      {/* ── Events Table ─────────────────────────────────────────────────── */}
      {!eventsLoading && !eventsError && (
        <div
          className="overflow-x-auto rounded-xl"
          style={{
            border: `1px solid ${THEME_COLORS.PRIMARY_GLOW}`,
            boxShadow: SHADOWS.CARD,
          }}
        >
          <table className="w-full min-w-[700px] border-collapse text-sm">
            {/* Table Head */}
            <thead>
              <tr
                style={{
                  backgroundColor: 'rgba(255,0,255,0.08)',
                  borderBottom: `1px solid ${THEME_COLORS.PRIMARY_GLOW}`,
                }}
              >
                {['Tên Sự Kiện', 'Địa Điểm', 'Ngày Giờ', 'Vé (Đã bán/Tổng)', 'Trạng Thái', 'Thao Tác'].map((h) => (
                  <th
                    key={h}
                    style={{
                      fontFamily: TYPOGRAPHY.TECH,
                      color: THEME_COLORS.PRIMARY,
                      fontSize: '0.65rem',
                      textAlign: 'left',
                    }}
                    className="px-4 py-3 uppercase tracking-widest whitespace-nowrap font-normal"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12"
                    style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.TEXT_MUTED, fontSize: '0.75rem' }}
                  >
                    // NO_EVENTS_FOUND — Hãy tạo sự kiện đầu tiên!
                  </td>
                </tr>
              ) : (
                events.map((event, idx) => (
                  <motion.tr
                    key={event._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    style={{
                      borderBottom: `1px solid ${THEME_COLORS.BORDER}`,
                      backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,0,255,0.02)',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,0,255,0.06)')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        idx % 2 === 0 ? 'transparent' : 'rgba(255,0,255,0.02)')
                    }
                  >
                    {/* Tên sự kiện */}
                    <td
                      className="px-4 py-3 font-semibold max-w-[200px] truncate"
                      style={{ fontFamily: TYPOGRAPHY.BODY, color: THEME_COLORS.WHITE }}
                      title={event.title}
                    >
                      {event.title}
                    </td>

                    {/* Địa điểm */}
                    <td
                      className="px-4 py-3 max-w-[150px] truncate"
                      style={{ fontFamily: TYPOGRAPHY.BODY, color: THEME_COLORS.TEXT_MUTED }}
                      title={event.location}
                    >
                      {event.location || '—'}
                    </td>

                    {/* Ngày giờ */}
                    <td
                      className="px-4 py-3 whitespace-nowrap"
                      style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.SECONDARY, fontSize: '0.78rem' }}
                    >
                      {formatDate(event.date)}
                    </td>

                    {/* Vé */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.TEXT, fontSize: '0.78rem' }}>
                          {event.soldTickets ?? 0} / {event.totalTickets}
                        </span>
                        {/* Progress bar */}
                        <div
                          className="h-1 rounded-full overflow-hidden"
                          style={{ width: '80px', backgroundColor: 'rgba(255,255,255,0.1)' }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.round(((event.soldTickets ?? 0) / (event.totalTickets || 1)) * 100))}%`,
                              backgroundColor:
                                ((event.soldTickets ?? 0) / (event.totalTickets || 1)) >= 0.8
                                  ? THEME_COLORS.ACCENT
                                  : THEME_COLORS.SECONDARY,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-4 py-3">
                      <StatusBadge event={event} />
                    </td>

                    {/* Thao tác */}
                    <td className="px-4 py-3">
                      <button
                        id={`admin-edit-event-${event._id}`}
                        onClick={() => openEditModal(event)}
                        style={{
                          fontFamily: TYPOGRAPHY.TECH,
                          color: THEME_COLORS.SECONDARY,
                          border: `1px solid ${THEME_COLORS.SECONDARY}`,
                          fontSize: '0.65rem',
                          transition: 'all 0.15s',
                        }}
                        className="px-3 py-1 rounded uppercase tracking-widest hover:bg-cyan-400/10 whitespace-nowrap"
                      >
                        ✏️ Sửa
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal Form ───────────────────────────────────────────────────── */}
      <EventModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editEvent={editEvent}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />
    </div>
  );
};

export default AdminEventsPage;
