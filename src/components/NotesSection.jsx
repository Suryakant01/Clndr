import { useState } from 'react';
import { PenLine, Trash2, Plus } from 'lucide-react';
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
                <div className="flex items-center gap-2 text-gray-800">
                    <PenLine size={18} />
                    <h3 className="font-bold text-sm uppercase tracking-widest">Month Memos</h3>
                </div>
                <span className="md:hidden text-[10px] text-gray-400 font-bold bg-gray-100 px-2 py-1 rounded">
                    BACK PAGE
                </span>
            </div>

            {/* Scrollable List Area */}
            <div className="flex-grow overflow-y-auto pr-1 space-y-1 mb-4 custom-scrollbar min-h-0">
                <AnimatePresence initial={false}>
                    {notes.map((note) => (
                        <motion.div
                            key={note.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="group flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                        >
                            <button
                                onClick={() => toggleNote(note.id)}
                                className="relative flex-grow text-left text-sm text-gray-700 py-2 pr-4"
                            >
                                <span className={note.scratched ? "text-gray-400" : "text-gray-700"}>
                                    {note.text}
                                </span>
                                
                                {note.scratched && (
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute top-1/2 left-0 right-4 h-[1.5px] bg-gray-400 origin-left -rotate-1 pointer-events-none"
                                    />
                                )}
                            </button>
                            <button
                                onClick={() => deleteNote(note.id)}
                                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-red-400 p-2 shrink-0"
                            >
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Input Form */}
            {/* 
                FIX: Added pr-20 on mobile to leave space for the Floating Flip Button.
                The md:pr-0 removes this gap on desktop where the button is hidden.
            */}
            <form onSubmit={handleSubmit} className="shrink-0 mt-auto pt-4 border-t border-gray-200 pr-20 md:pr-0">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="New memo..."
                        className="w-full bg-white rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm py-2.5 pl-4 pr-12 shadow-sm transition-all"
                    />
                    <button 
                        type="submit" 
                        disabled={!inputValue.trim()}
                        className="absolute right-2 p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-30 transition-colors"
                    >
                        <Plus size={22} strokeWidth={2.5} />
                    </button>
                </div>
            </form>
        </div>
    );
}