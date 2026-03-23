/** @type {import('tailwindcss').Config} */
const COLORS = {
  primary:       '#10B981',
  primaryHover:  '#059669',
  primaryText:   '#FFFFFF',
  actionReset:    '#F87171',
  actionInfo:     '#3B82F6',
  actionDiscount: '#EC4899',
  actionDraft:    '#F59E0B',
  inStock:        '#10B981',
  outOfStock:     '#EF4444',
  discountBadge:  '#10B981',
  paidRow:        '#10B981',
  dueRow:         '#EF4444',
  totalRow:       '#1F2937',
  statusCell:     '#F3F4F6',
  white:          '#FFFFFF',
  pageBg:         '#F9FAFB',
  cardBg:         '#FFFFFF',
  inputBg:        '#FFFFFF',
  borderLight:    '#E5E7EB',
  borderMedium:   '#D1D5DB',
  textPrimary:    '#111827',
  textSecondary:  '#6B7280',
  textMuted:      '#9CA3AF',
  navBg:          '#FFFFFF',
  navBorder:      '#E5E7EB',
  navTimeColor:   '#10B981',
};

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: COLORS,
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
