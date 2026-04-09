/**
 * AdminEventsPage.jsx — Module: UI | Flash Sale Project
 * Admin Dashboard — Restricted to administrators (role === 'admin').
 *
 * Features:
 * - Route protection: Redirect to home if not admin
 * - Tabular view: Professional event list with tech styling
 * - Contextual Actions: Create, Edit, Delete events
 * - i18n support: Fully localized strings
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import useEvents from '../hooks/useEvents.js';
import EventForm from '../components/EventForm.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import api from '../services/api.js';
import { THEME_COLORS, SHADOWS, TYPOGRAPHY } from '../constants/uiConstants.js';

// ─── Animation Variants ───────────────────────────────────────────────────────
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

// ─── Helper: Format date for table display ───────────────────────────────────
const formatDate = (isoString, lang) => {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return isoString;
  }
};

// ─── Sub-component: StatusBadge ──────────────────────────────────────────────
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

// ─── Sub-component: Modal Wrapper for EventForm ─────────────────────────────
const EventModal = ({ isOpen, onClose, editEvent, onSubmit, isSubmitting, submitError, isDirty, setIsDirty }) => {
  const { t } = useLanguage();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRequestClose = () => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="admin-modal-backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-40 bg-black/70"
              onClick={handleRequestClose}
            />
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
                <div
                  className="flex items-center justify-between px-6 py-4 border-b"
                  style={{ borderColor: THEME_COLORS.PRIMARY_GLOW }}
                >
                  <div className="flex flex-col">
                    <h2
                      style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.PRIMARY, fontSize: '0.8rem' }}
                      className="uppercase tracking-widest"
                    >
                      {editEvent ? t('form_edit_title') : t('form_create_title')}
                    </h2>
                    {isDirty && (
                      <span className="text-[10px] text-primary/60 font-mono animate-pulse">
                        {t('form_dirty_warn')}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleRequestClose}
                    style={{ color: THEME_COLORS.TEXT_MUTED, fontFamily: TYPOGRAPHY.TECH }}
                    className="text-lg hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="px-6 py-5">
                  <EventForm
                    initialData={editEvent}
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                    onDirtyChange={setIsDirty}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cyberpunk Confirm Dialog for Dirty Check */}
      <ConfirmDialog
        isOpen={showConfirm}
        onConfirm={() => {
          setShowConfirm(false);
          setIsDirty(false); // Reset dirty to prevent close loop
          onClose();
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};

// ─── Main Page ──────────────────────────────────────────────────────────────
const AdminEventsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { events, loading: eventsLoading, error: eventsError, refetch } = useEvents();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);

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
    if (isSubmitting) return;
    setIsModalOpen(false);
    setEditEvent(null);
    setSubmitError('');
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      if (editEvent) {
        await api.put(`/events/${editEvent._id}`, formData);
        setSuccessMessage(t('admin_success_update'));
      } else {
        await api.post('/events', formData);
        setSuccessMessage(t('admin_success_create'));
      }
      setIsDirty(false);
      closeModal();
      await refetch();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('[AdminEventsPage] Submit Error:', err);
      setSubmitError(err.response?.data?.message || 'Submit error. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return (
    <div className="flex justify-center items-center py-24">
      <p style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.PRIMARY }} className="animate-pulse uppercase tracking-widest text-sm">
        VERIFY_CREDENTIALS...
      </p>
    </div>
  );

  if (user?.role !== 'admin') return null;

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <Breadcrumb items={[{ label: 'ADMIN' }, { label: 'EVENTS' }]} />
      </div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.PRIMARY, fontSize: '0.65rem' }} className="uppercase tracking-widest mb-1">
            // {t('admin_subtitle')}
          </p>
          <h1 style={{ fontFamily: TYPOGRAPHY.HEADING, color: THEME_COLORS.WHITE }} className="text-3xl font-black uppercase tracking-wide">
            {t('admin_title')}
            <span style={{ color: THEME_COLORS.PRIMARY, textShadow: `0 0 12px ${THEME_COLORS.PRIMARY}` }}>_</span>
          </h1>
          <p style={{ fontFamily: TYPOGRAPHY.BODY, color: THEME_COLORS.TEXT_MUTED }} className="text-sm mt-1">
            {events.length} EVENTS_IN_SYSTEM
          </p>
        </div>

        <motion.button
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
          className="px-5 py-2.5 rounded text-sm font-bold uppercase tracking-widest"
        >
          {t('admin_create_btn')}
        </motion.button>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
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

      {/* Mobile Card List (Visible < 768px) */}
      {!eventsLoading && !eventsError && (
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {events.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
              <p style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.TEXT_MUTED }} className="text-xs uppercase tracking-widest">
                {t('admin_no_events')}
              </p>
            </div>
          ) : (
            events.map((event) => (
              <div 
                key={event._id}
                className="p-5 rounded-xl border border-white/5 bg-white/5 space-y-4"
                style={{ boxShadow: SHADOWS.CARD }}
              >
                <div className="flex gap-4">
                  <img src={event.imageUrl || 'https://placehold.co/100x100/090014/FF00FF?text=No+Img'} alt="Thumb" className="w-16 h-16 rounded object-cover border border-white/10" />
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-bold text-white truncate uppercase text-sm" style={{ fontFamily: TYPOGRAPHY.HEADING }}>{event.title}</h3>
                    <p className="text-[10px] text-white/40 truncate uppercase font-mono mt-1">{event.location || 'NO_LOCATION'}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <StatusBadge event={event} />
                      <span className="text-[10px] text-cyan-400 font-mono">
                        {event.price ? new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US', { style: 'currency', currency: 'VND' }).format(event.price) : t('card_price_free')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[8px] text-primary/60 font-black uppercase tracking-widest mb-1">Date_Time</p>
                    <p className="text-[10px] text-white/80 font-mono">{formatDate(event.date, lang)}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-primary/60 font-black uppercase tracking-widest mb-1">Tickets_Sold</p>
                    <p className="text-[10px] text-white/80 font-mono">{event.soldTickets ?? 0} / {event.totalTickets}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => openEditModal(event)} 
                    className="flex-1 py-2 rounded border border-secondary/50 text-secondary text-[10px] font-black uppercase tracking-widest hover:bg-secondary/10"
                    style={{ fontFamily: TYPOGRAPHY.TECH }}
                  >
                    {t('admin_edit_btn')}
                  </button>
                  <button 
                    disabled
                    title="Backend DELETE endpoint: COMING SOON"
                    className="flex-1 py-2 rounded border border-red-500/10 text-red-500/20 text-[8px] font-black uppercase tracking-widest cursor-not-allowed"
                    style={{ fontFamily: TYPOGRAPHY.TECH }}
                  >
                    // DELETE_COMING_SOON
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Desktop Table (Visible >= 768px) */}
      {!eventsLoading && !eventsError && (
        <div className="hidden md:block overflow-x-auto rounded-xl" style={{ border: `1px solid ${THEME_COLORS.PRIMARY_GLOW}`, boxShadow: SHADOWS.CARD }}>
          <table className="w-full min-w-[700px] border-collapse text-sm">
            <thead>
              <tr style={{ backgroundColor: 'rgba(255,0,255,0.08)', borderBottom: `1px solid ${THEME_COLORS.PRIMARY_GLOW}` }}>
                {[t('admin_table_img'), t('admin_table_name'), t('admin_table_loc'), t('admin_table_price'), t('admin_table_date'), t('admin_table_tickets'), t('admin_table_status'), t('admin_table_actions')].map((h) => (
                  <th key={h} style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.PRIMARY, fontSize: '0.65rem', textAlign: 'left' }} className="px-4 py-3 uppercase tracking-widest font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12" style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.TEXT_MUTED, fontSize: '0.75rem' }}>
                    {t('admin_no_events')}
                  </td>
                </tr>
              ) : (
                events.map((event, idx) => (
                  <motion.tr
                    key={event._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                    style={{ borderBottom: `1px solid ${THEME_COLORS.BORDER}`, backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,0,255,0.02)' }}
                  >
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded overflow-hidden border border-white/10 bg-white/5" style={{ boxShadow: `0 0 5px ${THEME_COLORS.PRIMARY_GLOW}` }}>
                        <img src={event.imageUrl || 'https://placehold.co/100x100/090014/FF00FF?text=No+Img'} alt="Thumb" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold max-w-[200px]" style={{ fontFamily: TYPOGRAPHY.BODY, color: THEME_COLORS.WHITE }}>
                      <div className="flex items-center gap-2">
                        <span className="truncate">{event.title}</span>
                        {event.isHot && <span style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.PRIMARY, border: `1px solid ${THEME_COLORS.PRIMARY}`, fontSize: '0.55rem', backgroundColor: `${THEME_COLORS.PRIMARY}10` }} className="px-1.5 py-0.5 rounded animate-pulse">🔥 {t('card_hot_badge')}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[150px] truncate" style={{ fontFamily: TYPOGRAPHY.BODY, color: THEME_COLORS.TEXT_MUTED }}>{event.location || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.ACCENT, fontSize: '0.78rem' }}>
                      {event.price ? new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US', { style: 'currency', currency: 'VND' }).format(event.price) : t('card_price_free')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.SECONDARY, fontSize: '0.78rem' }}>{formatDate(event.date, lang)}</td>
                    <td className="px-4 py-3 min-w-[120px]">
                      <div className="flex flex-col gap-1">
                        <span style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.TEXT, fontSize: '0.78rem' }}>{event.soldTickets ?? 0} / {event.totalTickets}</span>
                        <div className="h-1 rounded-full overflow-hidden" style={{ width: '80px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.round(((event.soldTickets ?? 0) / (event.totalTickets || 1)) * 100))}%`, backgroundColor: ((event.soldTickets ?? 0) / (event.totalTickets || 1)) >= 0.8 ? THEME_COLORS.ACCENT : THEME_COLORS.SECONDARY }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge event={event} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(event)} style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.SECONDARY, border: `1px solid ${THEME_COLORS.SECONDARY}`, fontSize: '0.65rem' }} className="px-3 py-1 rounded uppercase tracking-widest hover:bg-cyan-400/10 transition-all">{t('admin_edit_btn')}</button>
                        <button 
                          disabled 
                          title="Backend DELETE endpoint: COMING SOON"
                          style={{ fontFamily: TYPOGRAPHY.TECH, color: 'rgba(255, 68, 68, 0.2)', border: '1px solid rgba(255, 68, 68, 0.1)', fontSize: '0.6rem' }} 
                          className="px-3 py-1 rounded uppercase tracking-widest cursor-not-allowed"
                        >
                          // DELETE_SOON
                        </button>
                        {/* TODO: Implement DELETE /api/events/:id when backend is ready */}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      <EventModal
        isOpen={isModalOpen} onClose={closeModal} editEvent={editEvent} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitError={submitError} isDirty={isDirty} setIsDirty={setIsDirty}
      />
    </div>
  );
};

export default AdminEventsPage;
