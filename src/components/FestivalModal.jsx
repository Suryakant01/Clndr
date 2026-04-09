import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Info } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function FestivalModal({ festival, onClose }) {
  // Guard against rendering if no festival is selected
  if (!festival) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        aria-labelledby="festival-modal-title"
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 id="festival-modal-title" className="text-2xl font-bold text-gray-800">
                  {festival.name}
                </h2>
                <span className="text-sm font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mt-2 inline-block">
                  {festival.type.join(', ')}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-gray-600">
              <div className="flex items-start gap-3">
                <Calendar size={20} className="shrink-0 text-gray-400 mt-1" />
                <p>
                  <span className="font-semibold text-gray-800">Date:</span> {format(parseISO(festival.date.iso), 'EEEE, MMMM do, yyyy')}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Info size={20} className="shrink-0 text-gray-400 mt-1" />
                <p>
                  <span className="font-semibold text-gray-800">Details:</span> {festival.description || "No specific details available."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}