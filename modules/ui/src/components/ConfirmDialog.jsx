/**
 * ConfirmDialog.jsx — Module: UI | Flash Sale Project
 * Custom Confirmation Dialog with Cyberpunk/Neon styling.
 * Replaces window.confirm().
 */

import { motion, AnimatePresence } from 'framer-motion';
import { THEME_COLORS, SHADOWS, TYPOGRAPHY } from '../constants/uiConstants.js';
import { useLanguage } from '../context/LanguageContext.jsx';

const ConfirmDialog = ({ isOpen, onConfirm, onCancel, title, body }) => {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Dialog Panel */}
          <div className="fixed inset-0 z-101 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm overflow-hidden pointer-events-auto rounded-lg"
              style={{
                backgroundColor: 'rgba(15, 5, 25, 0.95)',
                border: `1px solid ${THEME_COLORS.PRIMARY_GLOW}`,
                boxShadow: `0 0 30px ${THEME_COLORS.PRIMARY_GLOW}`,
              }}
            >
              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-scanline" />

              <div className="relative p-6">
                {/* Header with Warning Icon */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">⚠️</span>
                  <h3
                    style={{ fontFamily: TYPOGRAPHY.HEADING, color: THEME_COLORS.PRIMARY }}
                    className="text-lg font-bold tracking-tighter uppercase"
                  >
                    {title || t('confirm_title')}
                  </h3>
                </div>

                {/* Message Content */}
                <p
                  style={{ fontFamily: TYPOGRAPHY.BODY, color: THEME_COLORS.TEXT }}
                  className="text-sm leading-relaxed mb-8"
                >
                  {body || t('confirm_body')}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                  {/* Cancel Button (Stay) */}
                  <button
                    onClick={onCancel}
                    className="px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 rounded border hover:bg-white/5"
                    style={{
                      fontFamily: TYPOGRAPHY.TECH,
                      color: THEME_COLORS.TEXT_MUTED,
                      borderColor: 'rgba(255,255,255,0.2)',
                    }}
                  >
                    {t('confirm_stay')}
                  </button>

                  {/* Nút Xác nhận (Rời đi) */}
                  <motion.button
                    whileHover={{ scale: 1.05, x: [0, -2, 2, 0] }}
                    onClick={onConfirm}
                    className="px-6 py-2 text-xs font-black uppercase tracking-widest transition-all duration-200 rounded"
                    style={{
                      fontFamily: TYPOGRAPHY.TECH,
                      backgroundColor: THEME_COLORS.PRIMARY,
                      color: THEME_COLORS.BLACK,
                      boxShadow: SHADOWS.NEON_PRIMARY,
                    }}
                  >
                    {t('confirm_discard')}
                  </motion.button>
                </div>
              </div>

              {/* Decorative Corner */}
              <div 
                className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2"
                style={{ borderColor: THEME_COLORS.PRIMARY }}
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
