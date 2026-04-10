import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { format, isSameDay } from 'date-fns';

export default function EventDetailModal({ event, onClose, onDelete }) {
  if (!event) return null;

  const isSingleDay = isSameDay(new Date(event.start), new Date(event.end));
  const dateText = isSingleDay 
      ? format(new Date(event.start), 'EEEE, MMMM do, yyyy') 
      : `${format(new Date(event.start), 'MMM do')} — ${format(new Date(event.end), 'MMM do, yyyy')}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="p-6">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${event.color} shadow-sm`} />
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 pr-4">{event.title}</h2>
              </div>
              <button onClick={onClose} className="p-2 -mr-2 -mt-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="mt-6 space-y-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                <CalendarIcon size={18} className={`${event.color.replace('bg-', 'text-')} shrink-0`} />
                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{dateText}</span>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-end">
                <button 
                    onClick={() => {
                        if(confirm("Are you sure you want to delete this event?")) {
                            onDelete(event.id);
                        }
                    }} 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <Trash2 size={16} /> Delete Event
                </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}