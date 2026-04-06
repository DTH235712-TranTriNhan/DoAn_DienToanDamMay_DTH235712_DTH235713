/**
 * EventForm.jsx — Module: UI | Flash Sale Project
 * Form dùng chung cho cả Tạo mới và Cập nhật sự kiện.
 * - Mode "create": Tất cả các trường đều chỉnh sửa được.
 * - Mode "edit": Trường totalTickets bị khoá nếu đã có vé bán ra (soldTickets > 0).
 * Tuân thủ Design System: Cyberpunk / Vaporwave (uiConstants.js)
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { THEME_COLORS, SHADOWS, TYPOGRAPHY } from '../constants/uiConstants.js';

// ─── Helper: Chuyển ISO date → YYYY-MM-DDTHH:mm cho input[datetime-local] ─────
const toDatetimeLocal = (isoString) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    // Lấy theo giờ địa phương để tránh lệch múi giờ
    const pad = (n) => String(n).padStart(2, '0');
    return (
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
      `T${pad(d.getHours())}:${pad(d.getMinutes())}`
    );
  } catch {
    return '';
  }
};

// ─── Giá trị mặc định của form ─────────────────────────────────────────────────
const INITIAL_STATE = {
  title: '',
  description: '',
  date: '',
  location: '',
  totalTickets: '',
};

// ─── Style dùng chung cho các input / textarea ─────────────────────────────────
const inputStyle = {
  fontFamily: TYPOGRAPHY.BODY,
  backgroundColor: 'rgba(9, 0, 20, 0.7)',
  color: THEME_COLORS.TEXT,
  border: `1px solid ${THEME_COLORS.BORDER}`,
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const inputFocusStyle = {
  borderColor: THEME_COLORS.PRIMARY,
  boxShadow: `0 0 8px ${THEME_COLORS.PRIMARY_GLOW}`,
};

// ─── Sub-component: FormField ──────────────────────────────────────────────────
const FormField = ({ label, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label
      style={{ fontFamily: TYPOGRAPHY.TECH, color: THEME_COLORS.PRIMARY, fontSize: '0.7rem' }}
      className="uppercase tracking-widest"
    >
      {label}
    </label>
    {children}
    {hint && (
      <p style={{ fontFamily: TYPOGRAPHY.BODY, color: THEME_COLORS.TEXT_MUTED, fontSize: '0.72rem' }}>
        {hint}
      </p>
    )}
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
/**
 * @param {object}   initialData  — Dữ liệu sự kiện khi ở mode Edit (null/undefined = Create)
 * @param {function} onSubmit     — async (formData) => void, gọi khi submit
 * @param {boolean}  isSubmitting — Trạng thái loading từ page cha
 * @param {string}   submitError  — Thông báo lỗi từ page cha (nếu có)
 */
const EventForm = ({ initialData = null, onSubmit, isSubmitting = false, submitError = '' }) => {
  const isEditMode = Boolean(initialData);
  const soldTickets = initialData?.soldTickets ?? 0;
  const isTicketsLocked = isEditMode && soldTickets > 0;

  const [formData, setFormData] = useState(INITIAL_STATE);

  // Điền dữ liệu vào form khi initialData thay đổi (mở modal sửa)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        date: toDatetimeLocal(initialData.date),
        location: initialData.location || '',
        totalTickets: initialData.totalTickets ?? '',
      });
    } else {
      setFormData(INITIAL_STATE);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (e) => Object.assign(e.target.style, inputFocusStyle);
  const handleBlur = (e) => {
    e.target.style.borderColor = THEME_COLORS.BORDER;
    e.target.style.boxShadow = 'none';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Chuyển đổi ngày sang ISO trước khi gửi lên backend
    const payload = {
      ...formData,
      date: formData.date ? new Date(formData.date).toISOString() : '',
      totalTickets: Number(formData.totalTickets),
    };
    onSubmit(payload);
  };

  const sharedInputProps = {
    style: inputStyle,
    className: 'w-full rounded px-3 py-2.5 text-sm',
    onFocus: handleFocus,
    onBlur: handleBlur,
    onChange: handleChange,
    disabled: isSubmitting,
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5"
      noValidate
    >
      {/* Title */}
      <FormField label="// TÊN SỰ KIỆN *">
        <input
          {...sharedInputProps}
          id="event-form-title"
          name="title"
          type="text"
          placeholder="VD: Flash Sale Vé Nhạc Hội..."
          value={formData.title}
          required
          minLength={3}
        />
      </FormField>

      {/* Description */}
      <FormField label="// MÔ TẢ">
        <textarea
          {...sharedInputProps}
          id="event-form-description"
          name="description"
          placeholder="Mô tả chi tiết về sự kiện..."
          value={formData.description}
          rows={4}
          className="w-full rounded px-3 py-2.5 text-sm resize-y"
        />
      </FormField>

      {/* Date & Location (2 cột trên màn hình lớn) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="// NGÀY GIỜ *">
          <input
            {...sharedInputProps}
            id="event-form-date"
            name="date"
            type="datetime-local"
            value={formData.date}
            required
            style={{
              ...inputStyle,
              colorScheme: 'dark', // Datetime picker tối màu
            }}
          />
        </FormField>

        <FormField label="// ĐỊA ĐIỂM *">
          <input
            {...sharedInputProps}
            id="event-form-location"
            name="location"
            type="text"
            placeholder="VD: Nhà hát TP.HCM..."
            value={formData.location}
            required
          />
        </FormField>
      </div>

      {/* Total Tickets */}
      <FormField
        label="// TỔNG SỐ VÉ *"
        hint={
          isTicketsLocked
            ? `⚠️ Không thể sửa — Đã bán ${soldTickets} vé`
            : 'Số vé tối đa có thể bán cho sự kiện này'
        }
      >
        <input
          {...sharedInputProps}
          id="event-form-totalTickets"
          name="totalTickets"
          type="number"
          placeholder="VD: 500"
          value={formData.totalTickets}
          required
          min={1}
          disabled={isSubmitting || isTicketsLocked}
          style={{
            ...inputStyle,
            opacity: isTicketsLocked ? 0.5 : 1,
            cursor: isTicketsLocked ? 'not-allowed' : 'auto',
          }}
        />
      </FormField>

      {/* Thông báo lỗi từ page cha */}
      {submitError && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontFamily: TYPOGRAPHY.TECH,
            color: '#FF4444',
            border: '1px solid rgba(255,68,68,0.4)',
            backgroundColor: 'rgba(255,68,68,0.08)',
            fontSize: '0.75rem',
          }}
          className="px-4 py-2.5 rounded uppercase tracking-wide"
        >
          ⛔ {submitError}
        </motion.p>
      )}

      {/* Submit Button */}
      <motion.button
        id="event-form-submit"
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
        style={{
          fontFamily: TYPOGRAPHY.TECH,
          backgroundColor: isSubmitting ? 'rgba(255,0,255,0.2)' : THEME_COLORS.PRIMARY,
          color: isSubmitting ? THEME_COLORS.PRIMARY : THEME_COLORS.BLACK,
          boxShadow: isSubmitting ? 'none' : SHADOWS.NEON_PRIMARY,
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          border: `1px solid ${THEME_COLORS.PRIMARY}`,
          transition: 'all 0.2s',
        }}
        className="w-full py-3 rounded text-sm font-bold uppercase tracking-widest"
      >
        {isSubmitting
          ? '[ ĐANG XỬ LÝ... ]'
          : isEditMode
          ? '[ LƯU THAY ĐỔI ]'
          : '[ TẠO SỰ KIỆN ]'}
      </motion.button>
    </motion.form>
  );
};

export default EventForm;
