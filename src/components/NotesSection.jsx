import { useState } from 'react';
import { PenLine, Trash2, Plus, Circle, CheckCircle2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotesSection({ notes, addNote, toggleNote, deleteNote }) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        addNote(inputValue);
        setInputValue('');
    };

    return (
        <div className="flex flex-col h-full w-full min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                    <PenLine size={18} className="text-blue-500" />
                    <h3 className="font-bold text-sm uppercase tracking-widest">Month Memos</h3>
                </div>
                <span className="md:hidden text-[10px] text-gray-500 font-bold bg-gray-200/50 dark:bg-gray-800 px-2 py-1 rounded tracking-wide">
                    BACK PAGE
                </span>
            </div>

            {/* Scrollable List Area */}
            <div className="flex-grow overflow-y-auto pr-2 space-y-1 mb-4 custom-scrollbar min-h-0 relative">
                
                {/* Empty State */}
                {notes.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 gap-3"
                    >
                        <div className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-full">
                            <FileText size={24} strokeWidth={1.5} />
                        </div>
                        <p className="text-xs font-medium uppercase tracking-widest">No Memos Yet</p>
                    </motion.div>
                )}

                <AnimatePresence initial={false}>
                    {notes.map((note) => (
                        <motion.div
                            layout // Animates position changes automatically when items are deleted!
                            key={note.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="group flex items-start gap-3 py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0"
                        >
                            {/* Visual Checkbox */}
                            <button
                                onClick={() => toggleNote(note.id)}
                                className="shrink-0 mt-0.5 text-gray-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                            >
                                {note.scratched ? (
                                    <CheckCircle2 size={18} className="text-blue-500 dark:text-blue-400" />
                                ) : (
                                    <Circle size={18} />
                                )}
                            </button>

                            {/* Note Text */}
                            <button
                                onClick={() => toggleNote(note.id)}
                                className="relative flex-grow text-left text-sm py-0.5"
                            >
                                <span className={`transition-colors duration-300 ${note.scratched ? "text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-200"}`}>
                                    {note.text}
                                </span>
                                
                                {/* Upgraded Custom Marker Strikethrough */}
                                {note.scratched && (
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-400/80 dark:bg-gray-500/80 origin-left -rotate-1 rounded-full pointer-events-none"
                                    />
                                )}
                            </button>

                            {/* Delete Button */}
                            <button
                                onClick={() => deleteNote(note.id)}
                                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-red-400/70 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded transition-all shrink-0 -mt-1 -mr-1"
                                aria-label="Delete memo"
                            >
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Input Form */}
            {/* MOBILE FIX: pr-20 creates space for the Floating Flip Button. */}
            <form onSubmit={handleSubmit} className="shrink-0 mt-auto pt-3 border-t border-gray-200 dark:border-gray-800 pr-20 md:pr-0 no-print">
                <div className="relative flex items-center group">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Write a new memo..."
                        className="w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 
                                   focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 
                                   outline-none text-sm py-3 pl-4 pr-12 shadow-sm transition-all text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
                    />
                    <button 
                        type="submit" 
                        disabled={!inputValue.trim()}
                        className="absolute right-2 p-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg 
                                   disabled:opacity-0 disabled:scale-75 opacity-100 scale-100 transition-all shadow-md"
                    >
                        <Plus size={18} strokeWidth={3} />
                    </button>
                </div>
            </form>
        </div>
    );
} 