// src/styles/tokens.ts

export const COLORS = {
  // Brand Primary — used for active states, CTAs, Payment button, Add customer button
  primary:       '#10B981',   // emerald-500 equivalent
  primaryHover:  '#059669',   // emerald-600
  primaryText:   '#FFFFFF',

  // Action Buttons (bottom bar)
  actionReset:    '#F87171',  // red-400    — "Reset"
  actionInfo:     '#3B82F6',  // blue-500   — "Add.info"
  actionDiscount: '#EC4899',  // pink-500   — "Discount"
  actionDraft:    '#F59E0B',  // amber-400  — "Draft"

  // Stock Status Badges
  inStock:        '#10B981',  // green text
  outOfStock:     '#EF4444',  // red text
  discountBadge:  '#10B981',  // teal text (e.g. "5% Off", "Tk. 10 Off")

  // Cart Footer
  paidRow:        '#10B981',  // green bg — "Paid" cell
  dueRow:         '#EF4444',  // red bg   — "Due" cell
  totalRow:       '#1F2937',  // dark bg  — "Total" cell
  statusCell:     '#F3F4F6',  // gray-100 bg — "Status" cell

  // Surfaces
  white:          '#FFFFFF',
  pageBg:         '#F9FAFB',  // gray-50 — app background
  cardBg:         '#FFFFFF',
  inputBg:        '#FFFFFF',
  borderLight:    '#E5E7EB',  // gray-200
  borderMedium:   '#D1D5DB',  // gray-300

  // Text
  textPrimary:    '#111827',  // gray-900
  textSecondary:  '#6B7280',  // gray-500
  textMuted:      '#9CA3AF',  // gray-400

  // Navbar
  navBg:          '#FFFFFF',
  navBorder:      '#E5E7EB',
  navTimeColor:   '#10B981',  // teal for datetime display

  // Cart Qty Badge (on medicine card)
  qtyBadge:       { bg: '#EF4444', text: '#FFFFFF' },  // red circle, white number

  // Selected payment method card
  paymentSelected: { border: '#10B981', bg: '#F0FDF4' },
};
