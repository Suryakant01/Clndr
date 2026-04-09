import { useState, useEffect, useMemo } from 'react';
import { 
  addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, 
  isWithinInterval, isAfter, isBefore, getYear
} from 'date-fns';

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Festival States
  const [festivals, setFestivals] = useState([]);
  const [loadingFestivals, setLoadingFestivals] = useState(true);
  const [selectedFestival, setSelectedFestival] = useState(null);

  // Range & Hover States
  const [range, setRange] = useState({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState(null);
  
  // NEW: State for the "Choice Menu" on festival dates
  const [activeMenuDate, setActiveMenuDate] = useState(null); 

  // Notes State
  const [notes, setNotes] = useState([]);
    const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    
    //images State
    const [customImages, setCustomImages] = useState({});
    useEffect(() => {
    const savedImages = localStorage.getItem('calendar-custom-images');
    if (savedImages) setCustomImages(JSON.parse(savedImages));
}, []);

const updateHeroImage = (monthKey, base64Image) => {
    const newImages = { ...customImages, [monthKey]: base64Image };
    setCustomImages(newImages);
    localStorage.setItem('calendar-custom-images', JSON.stringify(newImages));
};

  // Fetch Festivals
  useEffect(() => {
    const year = getYear(currentDate);
    const fetchFestivals = async () => {
      setLoadingFestivals(true);
      try {
        const apiKey = import.meta.env.VITE_CALENDARIFIC_API_KEY;
        if (!apiKey) return;
        const response = await fetch(`https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=IN&year=${year}`);
        const data = await response.json();
        if (data.response?.holidays) setFestivals(data.response.holidays);
      } catch (error) {
        console.error("Failed to fetch festivals:", error);
      } finally {
        setLoadingFestivals(false);
      }
    };
    fetchFestivals();
  }, [getYear(currentDate)]);

  const festivalMap = useMemo(() => {
    const map = new Map();
    festivals.forEach(f => map.set(f.date.iso.substring(0, 10), f));
    return map;
  }, [festivals]);

  // Load/Save Notes
  useEffect(() => {
    const savedNotes = localStorage.getItem(`calendar-notes-${monthKey}`);
    setNotes(savedNotes ? JSON.parse(savedNotes) : []);
  }, [monthKey]);

  const saveNotes = (newNotes) => {
    setNotes(newNotes);
    localStorage.setItem(`calendar-notes-${monthKey}`, JSON.stringify(newNotes));
  };

  const addNote = (text) => {
    if (!text.trim()) return;
    saveNotes([...notes, { id: Date.now(), text, scratched: false }]);
  };

  // Calendar Logic
  const nextMonth = () => { setCurrentDate(addMonths(currentDate, 1)); setActiveMenuDate(null); };
  const prevMonth = () => { setCurrentDate(subMonths(currentDate, 1)); setActiveMenuDate(null); };
  
  const handleDateClick = (day) => {
    if (!range.start || (range.start && range.end)) {
      setRange({ start: day, end: null });
    } else {
      if (isBefore(day, range.start)) setRange({ start: day, end: range.start });
      else setRange({ ...range, end: day });
      setHoverDate(null);
    }
  };

  const getDayStatus = (day) => {
    const isStart = range.start && isSameDay(day, range.start);
    const isEnd = range.end && isSameDay(day, range.end);
    const inRange = range.start && range.end && isWithinInterval(day, { start: range.start, end: range.end }) && !isStart && !isEnd;
    let isHoverRange = false;
    let isHoverEnd = false;
    if (range.start && !range.end && hoverDate) {
      const activeStart = isBefore(hoverDate, range.start) ? hoverDate : range.start;
      const activeEnd = isBefore(hoverDate, range.start) ? range.start : hoverDate;
      isHoverRange = isWithinInterval(day, { start: activeStart, end: activeEnd }) && !isSameDay(day, range.start) && !isSameDay(day, hoverDate);
      isHoverEnd = isSameDay(day, hoverDate);
    }
    return { isStart, isEnd, inRange, isHoverRange, isHoverEnd };
  };

  return {
    currentDate, range, hoverDate, notes, festivalMap, loadingFestivals,
    selectedFestival, activeMenuDate,customImages, updateHeroImage,
    setActiveMenuDate, // Exported to close/open menu
    addNote, toggleNote: (id) => saveNotes(notes.map(n => n.id === id ? { ...n, scratched: !n.scratched } : n)),
    deleteNote: (id) => saveNotes(notes.filter(n => n.id !== id)),
    openFestivalModal: (f) => setSelectedFestival(f),
    closeFestivalModal: () => setSelectedFestival(null),
    nextMonth, prevMonth, handleDateClick, 
    handleDateHover: (day) => { if (range.start && !range.end) setHoverDate(day); },
    getDayStatus, clearRange: () => { setRange({ start: null, end: null }); setHoverDate(null); },
    calendarDays: eachDayOfInterval({ start: startOfWeek(startOfMonth(currentDate)), end: endOfWeek(endOfMonth(currentDate)) })
  };
}