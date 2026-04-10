import { useState } from 'react';
import { StickyNote, Calendar as CalendarIcon, Download, Upload, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroImage from './HeroImage';
import NotesSection from './NotesSection';
import CalendarGrid from './CalendarGrid';
import FestivalModal from './FestivalModal';
import YearView from './YearView';
import SaveEventModal from './SaveEventModal';
import EventDetailModal from './EventDetailModal';
import { useCalendar } from '../hooks/useCalendar';

export default function CalendarCard() {
  const calendarProps = useCalendar();
  const [showNotes, setShowNotes] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className="max-w-5xl w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl print-only-border overflow-hidden flex flex-col relative transition-colors duration-300">
        
        {/* Settings Menu */}
        <div className="absolute top-4 right-4 z-50 no-print">
            <button onClick={() => setShowSettings(!showSettings)} className="p-2 bg-white/20 backdrop-blur-md rounded-full shadow-lg text-white hover:bg-white/40">
                <Settings size={20} />
            </button>
            <AnimatePresence>
                {showSettings && (
                    <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="absolute right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl p-2 w-48 flex flex-col gap-1 border border-gray-100 dark:border-gray-700">
                        <label className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer text-gray-700 dark:text-gray-300">
                            <Upload size={16}/> Import Backup
                            <input type="file" className="hidden" accept=".json" onChange={(e) => { /* Import logic */ setShowSettings(false); }} />
                        </label>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* 1. Spiral Binding */}
        <div className="spiral-binding border-b border-gray-300 dark:border-gray-700 relative z-30 shrink-0" />
        
        {/* 2. Hero Image */}
        <div className="w-full relative z-10 shrink-0">
          <HeroImage currentDate={calendarProps.currentDate} heroImage={calendarProps.heroImage} updateHeroImage={calendarProps.updateHeroImage} />
        </div>

        {/* 3. FLIP CONTENT AREA */}
        <div className="relative flex flex-col md:flex-row md:h-[550px] min-h-0 perspective-1000 bg-white dark:bg-gray-800">
          <div className="hidden md:flex w-full h-full">
            <div className="w-1/3 bg-gray-50/80 dark:bg-gray-900/50 p-8 border-r border-gray-200 dark:border-gray-700 no-print">
              <NotesSection {...calendarProps} />
            </div>
            <div className="w-2/3 p-8">
                <AnimatePresence mode="wait">
                    {calendarProps.viewMode === 'year' ? <YearView key="year" {...calendarProps} /> : <CalendarGrid key="month" {...calendarProps} />}
                </AnimatePresence>
            </div>
          </div>

          <div className="md:hidden relative w-full h-[550px] no-print">
            <AnimatePresence mode="wait">
              {!showNotes ? (
                <motion.div key="cal" initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: 90, opacity: 0 }} className="absolute inset-0 p-6 flex flex-col">
                    {calendarProps.viewMode === 'year' ? <YearView {...calendarProps} /> : <CalendarGrid {...calendarProps} />}
                </motion.div>
              ) : (
                <motion.div key="notes" initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: 90, opacity: 0 }} className="absolute inset-0 p-6 bg-gray-50 dark:bg-gray-900 flex flex-col">
                  <NotesSection {...calendarProps} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button onClick={() => setShowNotes(!showNotes)} className="md:hidden no-print absolute bottom-4 right-4 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform">
          {showNotes ? <CalendarIcon size={24} /> : <StickyNote size={24} />}
          {!showNotes && calendarProps.notes.length > 0 && <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 border-2 border-white rounded-full text-[10px] flex items-center justify-center font-bold">{calendarProps.notes.length}</span>}
        </button>
      </div>

      {/* Modals */}
      <FestivalModal festival={calendarProps.selectedFestival} onClose={calendarProps.closeFestivalModal} />
      <SaveEventModal 
        range={calendarProps.saveRangeData} 
        onClose={calendarProps.closeSaveModal} 
        onSave={(data) => {
            calendarProps.addEvent(data);
            calendarProps.clearRange();
            calendarProps.closeSaveModal();
        }} 
      />
      <EventDetailModal 
        event={calendarProps.viewEventData} 
        onClose={calendarProps.closeEventModal} 
        onDelete={calendarProps.deleteEvent}
          />
          
    </>
  );
}