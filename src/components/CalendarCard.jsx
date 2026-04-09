import { useState } from 'react';
import { StickyNote, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroImage from './HeroImage';
import NotesSection from './NotesSection';
import CalendarGrid from './CalendarGrid';
import FestivalModal from './FestivalModal';
import { useCalendar } from '../hooks/useCalendar';

export default function CalendarCard() {
  const calendarProps = useCalendar();
  const [showNotes, setShowNotes] = useState(false); // Mobile toggle state

  return (
    <>
      <div className="max-w-5xl w-full mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* 1. Spiral Binding */}
        <div className="spiral-binding bg-gray-100 border-b border-gray-300 relative z-30 shrink-0" />
        
        {/* 2. Hero Image (Visual Anchor) */}
        <div className="w-full relative z-10 shrink-0">
          <HeroImage 
            currentDate={calendarProps.currentDate} 
            customImages={calendarProps.customImages} 
            updateHeroImage={calendarProps.updateHeroImage} 
          />
        </div>

        {/* 3. FLIP CONTENT AREA */}
        <div className="relative flex flex-col md:flex-row md:h-[500px] min-h-0 perspective-1000">
          
          {/* DESKTOP VIEW: Side-by-Side (Visible only on md+) */}
          <div className="hidden md:flex w-full h-full">
            <div className="w-1/3 bg-gray-50/80 p-8 border-r border-gray-200">
              <NotesSection {...calendarProps} />
            </div>
            <div className="w-2/3 p-8 bg-white">
              <CalendarGrid {...calendarProps} />
            </div>
          </div>

          {/* MOBILE VIEW: Animated Flip (Hidden on md+) */}
          <div className="md:hidden relative w-full h-[450px]">
            <AnimatePresence mode="wait">
              {!showNotes ? (
                /* FRONT SIDE: Calendar */
                <motion.div
                  key="calendar-side"
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 90, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 p-6 bg-white flex flex-col"
                >
                  <CalendarGrid {...calendarProps} />
                </motion.div>
              ) : (
                /* BACK SIDE: Notes */
                <motion.div
                  key="notes-side"
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 90, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 p-6 bg-gray-50 flex flex-col"
                >
                  <NotesSection {...calendarProps} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE TOGGLE BUTTON (Floating Action Button) */}
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="md:hidden absolute bottom-1 right-4 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform"
        >
          {showNotes ? <CalendarIcon size={24} /> : <StickyNote size={24} />}
          
          {/* Subtle Notification Badge for notes count */}
          {!showNotes && calendarProps.notes.length > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 border-2 border-white rounded-full text-[10px] flex items-center justify-center font-bold">
              {calendarProps.notes.length}
            </span>
          )}
        </button>
      </div>

      <FestivalModal 
        festival={calendarProps.selectedFestival} 
        onClose={calendarProps.closeFestivalModal} 
      />
    </>
  );
}