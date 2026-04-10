import { useState, useEffect, useMemo } from 'react';
import { 
  addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, 
  isWithinInterval, isAfter, isBefore, getYear, setMonth
} from 'date-fns';
import { saveImageToDB, getImageFromDB } from '../utils/db';

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); 
  
  const [festivals, setFestivals] = useState([]);
  const [loadingFestivals, setLoadingFestivals] = useState(true);
  
  // Modal States
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [saveRangeData, setSaveRangeData] = useState(null); // { start, end }
  const [viewEventData, setViewEventData] = useState(null); // event object

  const [range, setRange] = useState({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState(null);
  const [activeMenuDate, setActiveMenuDate] = useState(null); 

  const [notes, setNotes] = useState([]);
  const [localEvents, setLocalEvents] = useState([]);
  const [heroImage, setHeroImage] = useState(null);

  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

  // Fetch Festivals
  useEffect(() => {
    const year = getYear(currentDate);
    const fetchFestivals = async () => {
      setLoadingFestivals(true);
      try {
        const apiKey = import.meta.env.VITE_CALENDARIFIC_API_KEY;
        if (!apiKey) { setLoadingFestivals(false); return; }
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

  // Load Data
  useEffect(() => {
    const savedNotes = localStorage.getItem(`clndr-notes-${monthKey}`);
    setNotes(savedNotes ? JSON.parse(savedNotes) : []);
    
    const savedEvents = localStorage.getItem('clndr-events');
    if (savedEvents) setLocalEvents(JSON.parse(savedEvents));

    getImageFromDB(monthKey).then(img => setHeroImage(img || null));
  }, [monthKey]);

  const saveNotes = (newNotes) => {
    setNotes(newNotes);
    localStorage.setItem(`clndr-notes-${monthKey}`, JSON.stringify(newNotes));
  };

  const addEvent = (event) => {
    const updated = [...localEvents, { id: Date.now(), ...event }];
    setLocalEvents(updated);
    localStorage.setItem('clndr-events', JSON.stringify(updated));
  };

  const deleteEvent = (id) => {
    const updated = localEvents.filter(e => e.id !== id);
    setLocalEvents(updated);
    localStorage.setItem('clndr-events', JSON.stringify(updated));
    setViewEventData(null); // Close modal on delete
  };

  const updateHeroImage = async (base64Image) => {
    await saveImageToDB(monthKey, base64Image);
    setHeroImage(base64Image);
  };

  const clearRange = () => { setRange({ start: null, end: null }); setHoverDate(null); };
  const nextMonth = () => { setCurrentDate(addMonths(currentDate, 1)); setActiveMenuDate(null); clearRange(); };
  const prevMonth = () => { setCurrentDate(subMonths(currentDate, 1)); setActiveMenuDate(null); clearRange(); };
  const jumpToMonth = (m) => { setCurrentDate(setMonth(currentDate, m)); setViewMode('month'); };

  const handleDateClick = (day) => {
    if (!range.start || (range.start && range.end)) setRange({ start: day, end: null });
    else {
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
    currentDate, range, hoverDate, notes, festivalMap, loadingFestivals, localEvents,
    selectedFestival, activeMenuDate, heroImage, viewMode,
    saveRangeData, viewEventData,
    setNotes: saveNotes, setViewMode, jumpToMonth,
    updateHeroImage, setActiveMenuDate, clearRange,
    addEvent, deleteEvent,
    addNote: (text) => saveNotes([...notes, { id: Date.now(), text, scratched: false }]),
    toggleNote: (id) => saveNotes(notes.map(n => n.id === id ? { ...n, scratched: !n.scratched } : n)),
    deleteNote: (id) => saveNotes(notes.filter(n => n.id !== id)),
    openFestivalModal: (f) => setSelectedFestival(f),
    closeFestivalModal: () => setSelectedFestival(null),
    openSaveModal: (r) => setSaveRangeData(r),
    closeSaveModal: () => setSaveRangeData(null),
    openEventModal: (e) => setViewEventData(e),
    closeEventModal: () => setViewEventData(null),
    nextMonth, prevMonth, handleDateClick, 
    handleDateHover: (day) => { if (range.start && !range.end) setHoverDate(day); },
    getDayStatus,
    calendarDays: eachDayOfInterval({ start: startOfWeek(startOfMonth(currentDate)), end: endOfWeek(endOfMonth(currentDate)) })
  };
}