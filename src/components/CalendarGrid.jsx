import { useState } from 'react';
import { format, isSameMonth, isToday, isSameDay, differenceInDays, isAfter, isBefore, isWithinInterval  } from 'date-fns';
import { ChevronLeft, ChevronRight, Loader2, Info, Grid2X2, Plus, MousePointer2, X, CalendarDays } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

export default function CalendarGrid(props) {
    const {
        currentDate, calendarDays, range, hoverDate, handleDateClick, activeMenuDate, setActiveMenuDate,
        handleDateHover, getDayStatus, nextMonth, prevMonth, clearRange, setViewMode,
        festivalMap, openFestivalModal, loadingFestivals, localEvents, openSaveModal, openEventModal
    } = props;
    
    const [swipeDirection, setSwipeDirection] = useState(0);
    const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    
    let dayCount = 0;
    const activeEnd = range.end || hoverDate;
    if (range.start && activeEnd) dayCount = Math.abs(differenceInDays(activeEnd, range.start)) + 1;

    const handleDragEnd = (e, { offset }) => {
        const swipe = offset.x;
        if (swipe < -50) { setSwipeDirection(1); nextMonth(); }
        else if (swipe > 50) { setSwipeDirection(-1); prevMonth(); }
    };

    const handleTriggerSave = () => {
        openSaveModal({ start: range.start, end: range.end || range.start });
        setActiveMenuDate(null);
    };

    const variants = {
        enter: (dir) => ({ x: dir > 0 ? 100 : -100, opacity: 0, rotateY: dir > 0 ? 10 : -10 }),
        center: { zIndex: 1, x: 0, opacity: 1, rotateY: 0 },
        exit: (dir) => ({ zIndex: 0, x: dir < 0 ? 100 : -100, opacity: 0, rotateY: dir < 0 ? 10 : -10 })
    };

    return (
        <div className="flex-1 select-none relative flex flex-col pb-24 md:pb-8 min-h-0 h-full">
            <div className="flex justify-between items-center mb-6 shrink-0">
                <button onClick={() => setViewMode('year')} className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition text-gray-800 dark:text-gray-100 font-bold text-lg">
                    {format(currentDate, 'MMMM yyyy')} <Grid2X2 size={16} className="text-gray-400"/>
                </button>
                <div className="flex gap-1 no-print">
                    <button onClick={() => {setSwipeDirection(-1); prevMonth()}} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"><ChevronLeft size={20} /></button>
                    <button onClick={() => {setSwipeDirection(1); nextMonth()}} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="grid grid-cols-7 mb-4 shrink-0">
                {weekDays.map(day => <div key={day} className="text-center text-[10px] font-bold text-gray-400 tracking-widest">{day}</div>)}
            </div>

            <motion.div drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={handleDragEnd} className="relative flex-grow min-h-0" onMouseLeave={() => handleDateHover(null)}>
                {loadingFestivals && <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-20"><Loader2 className="animate-spin text-blue-500" size={32} /></div>}
                
                <AnimatePresence custom={swipeDirection} mode="wait">
                    <motion.div key={currentDate.toISOString()} custom={swipeDirection} variants={variants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="grid grid-cols-7 gap-y-2 h-full content-start">
                        {calendarDays.map((day, idx) => {
                            const { isStart, isEnd, inRange, isHoverRange, isHoverEnd } = getDayStatus(day);
                            const isCurrentMonth = isSameMonth(day, currentDate);
                            const festival = festivalMap.get(format(day, 'yyyy-MM-dd'));
                            
                            // Check for local events that overlap with this specific day
                            const dayEvents = localEvents.filter(e => isSameDay(new Date(e.start), day) || isSameDay(new Date(e.end), day) || isWithinInterval(day, { start: new Date(e.start), end: new Date(e.end) }));
                            
                            const isMenuOpen = activeMenuDate && isSameDay(day, activeMenuDate);

                            const rangeActive = range.start && activeEnd;
                            const isForward = rangeActive && isAfter(activeEnd, range.start);
                            const isBackward = rangeActive && isBefore(activeEnd, range.start);
                            const connectRight = (isStart && isForward) || (isEnd && isBackward) || (isHoverEnd && isBackward);
                            const connectLeft = (isEnd && isForward) || (isStart && isBackward) || (isHoverEnd && isForward);

                            const bridgeClasses = isHoverRange || isHoverEnd ? 'bg-blue-50/50 dark:bg-blue-900/30 border-y border-dashed border-blue-300 dark:border-blue-600' : 'bg-blue-100 dark:bg-blue-800';

                            const onDayClick = () => {
                                if (range.start && !range.end) { handleDateClick(day); return; }
                                if (range.start && range.end && (isSameDay(day, range.start) || isSameDay(day, range.end))) { setActiveMenuDate(day); return; }
                                if (festival || dayEvents.length > 0) { setActiveMenuDate(day); return; }
                                handleDateClick(day); setActiveMenuDate(null);
                            };

                            return (
                                <div key={idx} className="relative flex flex-col justify-start items-center h-12 md:h-14 w-full" onMouseEnter={() => handleDateHover(day)}>
                                    
                                    {inRange && <div className="absolute top-1 w-full h-8 bg-blue-100 dark:bg-blue-800" />}
                                    {isHoverRange && <div className="absolute top-1 w-full h-8 bg-blue-50/50 dark:bg-blue-900/30 border-y border-dashed border-blue-300 dark:border-blue-600" />}
                                    
                                    {connectRight && <div className={`absolute top-1 right-0 w-1/2 h-8 ${bridgeClasses}`} />}
                                    {connectLeft && <div className={`absolute top-1 left-0 w-1/2 h-8 ${bridgeClasses}`} />}

                                    <button
                                        onDoubleClick={() => openSaveModal({ start: day, end: day })}
                                        onClick={onDayClick}
                                        className={`relative z-10 w-8 h-8 mt-1 flex items-center justify-center rounded-full text-sm font-medium transition-all
                                            ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200'}
                                            ${isToday(day) && !isStart && !isEnd && !inRange ? 'ring-2 ring-blue-400 font-bold' : ''}
                                            ${(isStart || isEnd) ? 'bg-blue-600 text-white shadow-lg ring-4 ring-white dark:ring-gray-800 scale-105' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    >
                                        {format(day, 'd')}
                                        {festival && isCurrentMonth && <span className="absolute -top-1 -right-1 text-[10px] pointer-events-none">🎉</span>}
                                    </button>

                                    <div className="flex gap-0.5 mt-1.5 relative z-10 pointer-events-none">
                                        {dayEvents.slice(0,3).map(e => <div key={e.id} className={`w-1.5 h-1.5 rounded-full ${e.color} shadow-sm`} />)}
                                        {dayEvents.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-gray-400 shadow-sm" />}
                                    </div>

                                    <AnimatePresence>
                                        {isMenuOpen && (
                                            <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-full mb-2 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-1 flex flex-col min-w-[170px] no-print">
                                                
                                                {/* Local Events */}
                                                {dayEvents.map(e => (
                                                    <button key={e.id} onClick={() => { openEventModal(e); setActiveMenuDate(null); }} className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200">
                                                        <div className={`w-2 h-2 rounded-full ${e.color}`} /> 
                                                        <span className="truncate max-w-[100px]">{e.title}</span>
                                                    </button>
                                                ))}

                                                {festival && <button onClick={() => { openFestivalModal(festival); setActiveMenuDate(null); }} className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200"><Info size={14} /> Festival Info</button>}
                                                {(!range.start || !range.end) && <button onClick={() => { handleDateClick(day); setActiveMenuDate(null); }} className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200"><MousePointer2 size={14} /> Select Range</button>}
                                                {range.start && range.end && <button onClick={handleTriggerSave} className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200"><Plus size={14} /> Save Range</button>}
                                                
                                                <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
                                                <button onClick={() => { setActiveMenuDate(null); clearRange(); }} className="py-1 mt-1 text-[10px] font-bold text-gray-400 uppercase text-center hover:bg-gray-50 dark:hover:bg-gray-800 rounded">Cancel</button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence>
                    {dayCount > 1 && (
                        <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute -bottom-18 md:-bottom-12 left-1/2 -translate-x-1/2 z-40 no-print">
                            <div className="bg-gray-900 dark:bg-gray-950 text-white text-xs font-bold pl-4 pr-1.5 py-1.5 rounded-full shadow-2xl border border-gray-700/50 flex items-center gap-3 backdrop-blur-md">
                                <span className="tracking-wide">{dayCount} DAYS SELECTED</span>
                                {range.end && <button onClick={handleTriggerSave} className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-full transition-colors text-[10px] tracking-wider uppercase shadow-inner">Save</button>}
                                <button onClick={(e) => { e.stopPropagation(); clearRange(); }} className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"><X size={14} strokeWidth={3} /></button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}