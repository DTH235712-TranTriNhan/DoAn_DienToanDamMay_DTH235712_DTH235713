/**
 * EventForm.jsx — Module: UI | Flash Sale Project
 * Shared Form for both Creating and Updating events.
 * - Mode "create": All fields are editable.
 * - Mode "edit": totalTickets is locked if tickets are already sold (soldTickets > 0).
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEME_COLORS, SHADOWS, TYPOGRAPHY } from '../constants/uiConstants.js';
import { useLanguage } from '../context/LanguageContext.jsx';

// ─── Helper: Convert ISO date → YYYY-MM-DDTHH:mm for input[datetime-local] ─────
const toDatetimeLocal = (isoString) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    const pad = (n) => String(n).padStart(2, '0');
    return (
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
      `T${pad(d.getHours())}:${pad(d.getMinutes())}`
    );
  } catch {
    return '';
  }
};

const INITIAL_STATE = {
  title: '',
  description: '',
  date: '',
  location: '',
  totalTickets: '',
  price: 0,
  imageUrl: '',
  isHot: false,
};

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

const EventForm = ({ 
  initialData = null, 
  onSubmit, 
  isSubmitting = false, 
  submitError = '',
  onDirtyChange = () => {}
}) => {
  const { t } = useLanguage();
  const isEditMode = Boolean(initialData);
  const soldTickets = initialData?.soldTickets ?? 0;
  const isTicketsLocked = isEditMode && soldTickets > 0;

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const mappedData = {
        title: initialData.title || '',
        description: initialData.description || '',
        date: toDatetimeLocal(initialData.date),
        location: initialData.location || '',
        totalTickets: initialData.totalTickets ?? '',
        price: initialData.price ?? 0,
        imageUrl: initialData.imageUrl || '',
        isHot: initialData.isHot || false,
      };
      setFormData(mappedData);
      onDirtyChange(false);
    } else {
      setFormData(INITIAL_STATE);
      onDirtyChange(false);
    }
  }, [initialData, onDirtyChange]);

  const compareTo = useMemo(() => (initialData ? {
    title: initialData.title || '',
    description: initialData.description || '',
    date: toDatetimeLocal(initialData.date),
    location: initialData.location || '',
    totalTickets: initialData.totalTickets ?? '',
    price: initialData.price ?? 0,
    imageUrl: initialData.imageUrl || '',
    isHot: initialData.isHot || false,
  } : INITIAL_STATE), [initialData]);

  useEffect(() => {
    const dirty = JSON.stringify(formData) !== JSON.stringify(compareTo);
    onDirtyChange(dirty);
    // Clear error for a field when it changes
    if (Object.keys(errors).length > 0) setErrors({});
  }, [formData, compareTo, onDirtyChange]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSimulateUpload = () => {
    const samples = [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1470',
      'https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=1470',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1470',
    ];
    const randomImg = samples[Math.floor(Math.random() * samples.length)];
    setFormData(prev => ({ ...prev, imageUrl: randomImg }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Custom Validation
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = t('form_error_required') || 'Title is required';
    if (!formData.totalTickets || Number(formData.totalTickets) < 1) {
      newErrors.totalTickets = t('form_error_min_tickets') || 'Tickets must be at least 1';
    }
    if (formData.price < 0) {
      newErrors.price = t('form_error_price') || 'Price cannot be negative';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      ...formData,
      date: formData.date ? new Date(formData.date).toISOString() : '',
      totalTickets: Number(formData.totalTickets),
      price: Number(formData.price),
    };
    onSubmit(payload);
  };

  const sharedInputProps = {
    style: inputStyle,
    className: 'w-full rounded px-3 py-2.5 text-sm',
    onFocus: (e) => Object.assign(e.target.style, inputFocusStyle),
    onBlur: (e) => {
      e.target.style.borderColor = THEME_COLORS.BORDER;
      e.target.style.boxShadow = 'none';
    },
    onChange: handleChange,
    disabled: isSubmitting,
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5" noValidate
    >
      {/* Hot Status Bar */}
      <AnimatePresence>
        {formData.isHot && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div className="p-3 mb-2 rounded border border-primary/40 bg-primary/10 flex items-center justify-between shadow-[0_0_15px_rgba(255,0,255,0.2)]" style={{ borderLeftWidth: '4px' }}>
              <div className="flex items-center gap-3">
                <span className="text-xl animate-bounce">🔥</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary" style={{ fontFamily: TYPOGRAPHY.TECH }}>{t('form_status_hot')}</span>
                  <span className="text-[9px] text-white/40 uppercase font-mono">BANNER_PRIORITY_ACTIVE</span>
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FormField label={t('form_label_title')}>
        <input 
          {...sharedInputProps} 
          name="title" 
          type="text" 
          placeholder="Flash Sale Event..." 
          value={formData.title} 
          style={{ 
            ...sharedInputProps.style, 
            borderColor: errors.title ? '#ff4444' : sharedInputProps.style.borderColor,
            boxShadow: errors.title ? '0 0 10px rgba(255, 68, 68, 0.2)' : 'none'
          }} 
        />
        {errors.title && <p className="text-[10px] text-red-500 font-mono mt-1 uppercase tracking-tighter">! {errors.title}</p>}
      </FormField>

      <FormField label={t('form_label_desc')}>
        <textarea {...sharedInputProps} name="description" placeholder="Event description..." value={formData.description} rows={3} className="w-full rounded px-3 py-2.5 text-sm resize-none" />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label={t('form_label_date')}>
          <input {...sharedInputProps} name="date" type="datetime-local" value={formData.date} required style={{ ...inputStyle, colorScheme: 'dark' }} 
            min={new Date().toISOString().slice(0, 16)} />
        </FormField>
        <FormField label={t('form_label_loc')}>
          <input {...sharedInputProps} name="location" type="text" placeholder="Location..." value={formData.location} required />
        </FormField>
      </div>

      <div className="flex flex-col gap-3 p-3 border border-white/5 bg-white/5 rounded-lg border-dashed">
        <FormField label={t('form_label_img')}>
          <div className="flex gap-2">
            <input {...sharedInputProps} name="imageUrl" type="text" placeholder="https://..." value={formData.imageUrl} />
            <button type="button" onClick={handleSimulateUpload} style={{ fontFamily: TYPOGRAPHY.TECH, border: `1px solid ${THEME_COLORS.SECONDARY}`, color: THEME_COLORS.SECONDARY }} className="px-3 text-[10px] uppercase font-bold rounded hover:bg-secondary hover:text-black transition-all">
              {t('form_btn_upload')}
            </button>
          </div>
        </FormField>
        {formData.imageUrl && (
          <div className="relative w-full h-32 overflow-hidden rounded border border-primary/30">
            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div 
        className="flex items-center gap-3 p-3 rounded border border-primary/20 bg-primary/5 cursor-pointer"
        onClick={() => setFormData(prev => ({ ...prev, isHot: !prev.isHot }))}
      >
        <input type="checkbox" name="isHot" checked={formData.isHot} onChange={handleChange} className="w-4 h-4 accent-primary" />
        <span className="text-primary font-bold text-[10px] tracking-widest uppercase" style={{ fontFamily: TYPOGRAPHY.TECH }}>{t('form_label_hot')}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label={t('form_label_tickets')} hint={isTicketsLocked ? `⚠️ Locked: ${soldTickets} sold` : ''}>
          <input 
            {...sharedInputProps} 
            name="totalTickets" 
            type="number" 
            value={formData.totalTickets} 
            min={1} 
            disabled={isSubmitting || isTicketsLocked}
            style={{ 
              ...sharedInputProps.style, 
              opacity: isTicketsLocked ? 0.5 : 1,
              borderColor: errors.totalTickets ? '#ff4444' : sharedInputProps.style.borderColor,
              boxShadow: errors.totalTickets ? '0 0 10px rgba(255, 68, 68, 0.2)' : 'none'
            }} 
          />
          {errors.totalTickets && <p className="text-[10px] text-red-500 font-mono mt-1 uppercase tracking-tighter">! {errors.totalTickets}</p>}
        </FormField>

        <FormField label={t('form_label_price')}>
          <input 
            {...sharedInputProps} 
            name="price" 
            type="number" 
            value={formData.price} 
            min={0}
            style={{ 
              ...sharedInputProps.style, 
              borderColor: errors.price ? '#ff4444' : sharedInputProps.style.borderColor,
              boxShadow: errors.price ? '0 0 10px rgba(255, 68, 68, 0.2)' : 'none'
            }} 
          />
          {errors.price && <p className="text-[10px] text-red-500 font-mono mt-1 uppercase tracking-tighter">! {errors.price}</p>}
        </FormField>
      </div>

      {submitError && <p className="text-red-500 text-xs font-mono p-2 border border-red-500/30 bg-red-500/10">⛔ {submitError}</p>}

      <motion.button
        type="submit" disabled={isSubmitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
        style={{ fontFamily: TYPOGRAPHY.TECH, backgroundColor: THEME_COLORS.PRIMARY, color: THEME_COLORS.BLACK, boxShadow: SHADOWS.NEON_PRIMARY }}
        className="w-full py-3 rounded text-xs font-black uppercase tracking-[0.2em]"
      >
        {isSubmitting ? '...' : (isEditMode ? t('form_btn_save') : t('form_btn_create'))}
      </motion.button>
    </motion.form>
  );
};

export default EventForm;
