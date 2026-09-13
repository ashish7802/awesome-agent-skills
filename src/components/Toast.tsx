import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Copy } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 dark:bg-slate-900 text-white border border-sky-500/50 shadow-xl shadow-sky-500/10 font-sans text-xs sm:text-sm backdrop-blur-md"
        >
          <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium text-slate-100">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
