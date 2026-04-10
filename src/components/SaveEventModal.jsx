import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Check } from 'lucide-react';
import { format, isSameDay } from 'date-fns';

const COLORS = [
    { id: 'blue', class: 'bg-blue-500' },
    { id: 'red', class: 'bg-red-500' },
    { id: 'green', class: 'bg-green-500' },
    { id: 'purple', class: 'bg-purple-500' },
    { id: 'orange', class: 'bg-orange-500' }
];

export default function SaveEventModal({ range, onClose, onSave }) {
    const [title, setTitle] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[0].class);

    if (!range) return null;

    const isSingleDay = isSameDay(range.start, range.end);
    const dateText = isSingleDay 
        ? format(range.start, 'EEEE, MMMM do, yyyy') 
        : `${format(range.start, 'MMM do')} — ${format(range.end, 'MMM do, yyyy')}`;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSave({ title, start: range.start, end: range.end, color: selectedColor });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                
                <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                    <form onSubmit={handleSubmit} className="p-6">
                        
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Save Event</h2>
                            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 bg-gray-100 dark:bg-gray-800 rounded-full"><X size={20} /></button>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-6 border border-gray-100 dark:border-gray-800">
                            <CalendarIcon size={18} className="text-blue-500 shrink-0" />
                            <span className="font-medium">{dateText}</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Event Title</label>
                                <input autoFocus type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Vacation, Dentist..." className="w-full bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none px-4 py-2.5 transition-all" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Color Label</label>
                                <div className="flex gap-3">
                                    {COLORS.map(c => (
                                        <button type="button" key={c.id} onClick={() => setSelectedColor(c.class)} className={`w-8 h-8 rounded-full ${c.class} flex items-center justify-center hover:scale-110 transition-transform`}>
                                            {selectedColor === c.class && <Check size={16} className="text-white drop-shadow-md" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition">Cancel</button>
                            <button type="submit" disabled={!title.trim()} className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition shadow-lg shadow-blue-500/30">Save</button>
                        </div>

                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}