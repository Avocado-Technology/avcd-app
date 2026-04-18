/**
 * Animation Examples — Avocado Design System
 * 
 * These components demonstrate the animation patterns from the upgraded
 * motion system. Copy and adapt these patterns for your own components.
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  modalVariants,
  backdropVariants,
  buttonTap,
  slideInFromTop,
  scaleIn,
  expandCollapse,
  spinnerVariants,
  successCheckmark,
} from '@/lib/motion-variants';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

// ============================================================================
// Example 1: Card Grid with Stagger
// ============================================================================

interface CardData {
  id: string;
  title: string;
  description: string;
}

export function StaggeredCardGrid({ cards }: { cards: CardData[] }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {cards.map((card) => (
        <motion.div
          key={card.id}
          variants={fadeInUp}
          className="card border border-gray-200 rounded-xl p-6 hover:border-gray-400 transition-colors"
        >
          <h3 className="font-medium text-gray-900 mb-2">{card.title}</h3>
          <p className="text-gray-700">{card.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ============================================================================
// Example 2: Modal with Backdrop
// ============================================================================

export function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-sm border border-gray-200"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <h2
                id="modal-title"
                className="text-xl font-semibold text-gray-900 mb-4"
              >
                {title}
              </h2>
              <div className="text-gray-700">{children}</div>
              <motion.button
                whileTap={buttonTap}
                onClick={onClose}
                className="mt-6 w-full bg-gray-900 text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors active:translate-y-[1px]"
              >
                Close
              </motion.button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// Example 3: Button with Tap Feedback
// ============================================================================

export function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}) {
  const baseStyles =
    'py-2 px-4 rounded-md font-medium transition-colors active:translate-y-[1px]';

  const variants = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800',
    secondary:
      'bg-white text-gray-700 border border-gray-300 hover:border-gray-400',
    ghost: 'bg-transparent text-gray-500 hover:bg-gray-100',
  };

  return (
    <motion.button
      whileTap={buttonTap}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </motion.button>
  );
}

// ============================================================================
// Example 4: Dropdown Menu (with contextual origin)
// ============================================================================

export function DropdownMenu({
  trigger,
  items,
}: {
  trigger: React.ReactNode;
  items: { label: string; onClick: () => void }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}>{trigger}</button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={slideInFromTop}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ transformOrigin: 'top' }}
            className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-sm min-w-[200px] py-1"
          >
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Example 5: Accordion (Expand/Collapse)
// ============================================================================

export function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-500"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={expandCollapse}
            initial="initial"
            animate="animate"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Example 6: Loading Spinner
// ============================================================================

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <motion.div
      variants={spinnerVariants}
      animate="animate"
      style={{ width: size, height: size }}
      className="border-2 border-gray-200 border-t-gray-900 rounded-full"
    />
  );
}

// ============================================================================
// Example 7: Success Checkmark
// ============================================================================

export function SuccessIndicator() {
  return (
    <motion.div
      variants={successCheckmark}
      initial="initial"
      animate="animate"
      className="w-16 h-16 bg-green-light border-2 border-green-border rounded-full flex items-center justify-center"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-green"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </motion.div>
  );
}

// ============================================================================
// Example 8: Page Transition Wrapper
// ============================================================================

export function PageTransition({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div {...(shouldReduceMotion ? {} : fadeIn)}>{children}</motion.div>
  );
}

// ============================================================================
// Example 9: Toast Notification
// ============================================================================

export function Toast({
  message,
  isVisible,
  onClose,
}: {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={scaleIn}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm"
        >
          <span className="flex-1">{message}</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// Example 10: Skeleton Loading Card
// ============================================================================

export function SkeletonCard() {
  return (
    <motion.div
      {...fadeIn}
      className="border border-gray-200 rounded-xl p-6 space-y-4"
    >
      <div className="skeleton h-6 w-2/3 bg-gray-100 rounded animate-shimmer" />
      <div className="skeleton h-4 w-full bg-gray-100 rounded animate-shimmer" />
      <div className="skeleton h-4 w-5/6 bg-gray-100 rounded animate-shimmer" />
    </motion.div>
  );
}

// ============================================================================
// Example 11: Conditional Animation (Respects Reduced Motion)
// ============================================================================

export function ConditionalAnimationCard({
  children,
}: {
  children: React.ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      {...(shouldReduceMotion ? {} : fadeInUp)}
      className="card border border-gray-200 rounded-xl p-6"
    >
      {children}
      {shouldReduceMotion && (
        <div className="text-xs text-gray-500 mt-4">
          ℹ️ Animations reduced per your system preferences
        </div>
      )}
    </motion.div>
  );
}
