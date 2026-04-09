import { format, isSameMonth, isToday, isAfter, isBefore, differenceInDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, X, Loader2, Info, MousePointer2 } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

// Helper function to map Indian festival names to specific emojis
const getIndianFestivalEmoji = (name) => {
    if (!name) return "🎉";
    const festival = name.toLowerCase();
    
    if (festival.includes('diwali') || festival.includes('deepavali')) return "🪔";
    if (festival.includes('holi')) return "🎨";
    if (festival.includes('eid')) return "🌙";
    if (festival.includes('independence') || festival.includes('republic')) return "🇮🇳";
    if (festival.includes('ganesh')) return "🐘";
    if (festival.includes('raksha bandhan')) return "👫";
    if (festival.includes('janmashtami')) return "🍯";
    if (festival.includes('dussehra') || festival.includes('vijayadashami')) return "🏹";
    if (festival.includes('christmas')) return "🎄";
    if (festival.includes('pongal') || festival.includes('sankranti')) return "🌾";
    if (festival.includes('lohri')) return "🔥";
    if (festival.includes('gandhi')) return "👓";
    if (festival.includes('navratri')) return "💃";
    
    return "🎉"; // Default fallback
};

export default function CalendarGrid({
    currentDate, calendarDays, range, hoverDate, handleDateClick, activeMenuDate, setActiveMenuDate,
    handleDateHover, getDayStatus, nextMonth, prevMonth, clearRange,
    festivalMap, openFestivalModal, loadingFestivals 
}) {
    const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    let dayCount = 0;
    const activeStart = range.start;
    const activeEnd = range.end || hoverDate;
    if (activeStart && activeEnd) dayCount = Math.abs(differenceInDays(activeEnd, activeStart)) + 1;

    return (
        <div className="flex-1 select-none relative flex flex-col pb-24 md:pb-8 min-h-0">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-lg font-bold text-gray-800 tracking-tight">
                    {format(currentDate, 'MMMM yyyy')}
                </h3>
                <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"><ChevronLeft size={20} /></button>
                    <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"><ChevronRight size={20} /></button>
                </div>
            </div>

            {/* Week Labels */}
            <div className="grid grid-cols-7 mb-4 shrink-0">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-[10px] font-bold text-gray-400 tracking-widest">{day}</div>
                ))}
            </div>

            {/* Grid Area */}
            <div className="relative flex-grow min-h-0" onMouseLeave={() => handleDateHover(null)}>
                {loadingFestivals ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-20"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={currentDate.toISOString()} 
                            initial={{ opacity: 0, y: 5 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -5 }} 
                            className="grid grid-cols-7 gap-y-2"
                        >
                            {calendarDays.map((day, idx) => {
                                const { isStart, isEnd, inRange, isHoverRange, isHoverEnd } = getDayStatus(day);
                                const isCurrentMonth = isSameMonth(day, currentDate);
                                const isCurrentDay = isToday(day);
                                const dateKey = format(day, 'yyyy-MM-dd');
                                const festival = festivalMap.get(dateKey);
                                const isMenuOpen = activeMenuDate && isSameDay(day, activeMenuDate);

                                const rangeActive = range.start && (range.end || hoverDate);
                                const isForward = rangeActive && isAfter(range.end || hoverDate, range.start);
                                const isBackward = rangeActive && isBefore(range.end || hoverDate, range.start);
                                const connectRight = (isStart && isForward) || (isEnd && isBackward) || (isHoverEnd && isBackward);
                                const connectLeft = (isEnd && isForward) || (isStart && isBackward) || (isHoverEnd && isForward);

                                const onDayClick = () => {
                                    if (festival && isCurrentMonth) setActiveMenuDate(day);
                                    else { setActiveMenuDate(null); handleDateClick(day); }
                                };

                                return (
                                    <div key={idx} className="relative flex justify-center items-center h-10 w-full" onMouseEnter={() => handleDateHover(day)}>
                                        {inRange && <div className="absolute inset-0 bg-blue-50/80" />}
                                        {isHoverRange && <div className="absolute inset-0 bg-blue-50/40" />}
                                        {connectRight && <div className={`absolute right-0 w-1/2 h-full ${isHoverEnd || isHoverRange ? 'bg-blue-50/40' : 'bg-blue-50/80'}`} />}
                                        {connectLeft && <div className={`absolute left-0 w-1/2 h-full ${isHoverEnd || isHoverRange ? 'bg-blue-50/40' : 'bg-blue-50/80'}`} />}

                                        <motion.button
                                            onClick={onDayClick}
                                            className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all
                                                ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                                                ${isCurrentDay && !isStart && !isEnd && !inRange ? 'ring-2 ring-green-100 bg-green-50/30 font-bold' : ''}
                                                ${(isStart || isEnd) ? 'bg-blue-600 text-white shadow-lg scale-110' : 'hover:bg-gray-100'}`}
                                        >
                                            {format(day, 'd')}
                                            
                                            {/* SPECIFIC EMOJI Logic */}
                                            {festival && isCurrentMonth && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute -top-1.5 -right-1.5 text-[10px] drop-shadow-sm pointer-events-none"
                                                >
                                                    {getIndianFestivalEmoji(festival.name)}
                                                </motion.span>
                                            )}
                                        </motion.button>

                                        {/* Context Menu */}
                                        <AnimatePresence>
                                            {isMenuOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                    className="absolute bottom-full mb-2 z-50 bg-white rounded-xl shadow-2xl border border-gray-100 p-1 flex flex-col min-w-[170px]"
                                                >
                                                    <button onClick={() => { openFestivalModal(festival); setActiveMenuDate(null); }} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-blue-50 rounded-lg"><Info size={14} /> Details</button>
                                                    <button onClick={() => { handleDateClick(day); setActiveMenuDate(null); }} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-green-50 rounded-lg"><MousePointer2 size={14} /> Select Range</button>
                                                    <div className="h-px bg-gray-100 my-1" />
                                                    <button onClick={() => setActiveMenuDate(null)} className="py-1 text-[10px] font-bold text-gray-400 uppercase text-center">Cancel</button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                )}
                
                {/* Day Count Popup positioned to avoid Flip Button */}
                <AnimatePresence>
                    {dayCount > 1 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0 }} 
                            className="absolute -bottom-26 md:-bottom-14 left-1/2 -translate-x-1/2 z-20"
                        >
                            <div className="bg-gray-900 text-white text-[11px] font-bold pl-4 pr-1.5 py-1.5 rounded-full shadow-xl flex items-center gap-3 border border-white/10 whitespace-nowrap">
                                <span>{dayCount} DAYS SELECTED</span>
                                <button onClick={(e) => { e.stopPropagation(); clearRange(); }} className="bg-white/10 hover:bg-white/20 p-1 rounded-full"><X size={12} strokeWidth={3} /></button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}