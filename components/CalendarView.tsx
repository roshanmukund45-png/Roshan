import React, { useState } from 'react';
import { JamEvent } from '../types';

interface CalendarViewProps {
  events: JamEvent[];
  onSelectDate: (date: string) => void;
  onSelectEvent: (event: JamEvent) => void;
}

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);

const CalendarView: React.FC<CalendarViewProps> = ({ events, onSelectDate, onSelectEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const today = new Date();

  const eventsByDate: { [key: string]: JamEvent[] } = events.reduce((acc, event) => {
    const eventDate = new Date(event.date).toISOString().split('T')[0];
    if (!acc[eventDate]) {
      acc[eventDate] = [];
    }
    acc[eventDate].push(event);
    return acc;
  }, {} as { [key: string]: JamEvent[] });

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  }

  const renderDays = () => {
    const days = [];
    // Pad start of month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`pad-start-${i}`} className="border-r border-b border-brand-brown/30"></div>);
    }
    // Render actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const dateString = dayDate.toISOString().split('T')[0];
      const isToday = dayDate.toDateString() === today.toDateString();
      const dayEvents = eventsByDate[dateString] || [];

      days.push(
        <div key={i} onClick={() => onSelectDate(dateString)} className="relative border-r border-b border-brand-brown/30 p-2 min-h-[120px] flex flex-col cursor-pointer hover:bg-brand-dark/80 transition-colors duration-200 group">
          <time dateTime={dateString} className={`font-bold ${isToday ? 'bg-brand-gold text-brand-dark rounded-full flex items-center justify-center w-8 h-8' : 'text-brand-cream'}`}>{i}</time>
          <div className="mt-1 space-y-1 overflow-y-auto">
              {dayEvents.map(event => (
                  <button key={event.id} onClick={(e) => { e.stopPropagation(); onSelectEvent(event); }} className="w-full text-left text-xs bg-brand-brown/80 text-white p-1 rounded hover:bg-brand-brown">
                      {event.title}
                  </button>
              ))}
          </div>
          <div className="absolute top-1 right-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold">+ Add</div>
        </div>
      );
    }
    return days;
  };
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full max-w-4xl bg-brand-dark/50 backdrop-blur-md rounded-xl shadow-2xl p-4 sm:p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <div className="flex items-center gap-2">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-brand-brown/70 transition-colors"><ChevronLeftIcon className="w-6 h-6" /></button>
                <button onClick={goToToday} className="font-bold text-sm bg-brand-brown/70 text-brand-cream py-1 px-3 rounded-lg hover:bg-brand-brown transition-colors">Today</button>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-brand-brown/70 transition-colors"><ChevronRightIcon className="w-6 h-6" /></button>
            </div>
        </div>
        <div className="grid grid-cols-7 border-t border-l border-brand-brown/30">
            {weekdays.map(day => (
                <div key={day} className="text-center font-bold text-brand-gold p-2 border-r border-b border-brand-brown/30 bg-brand-dark/70">{day}</div>
            ))}
            {renderDays()}
        </div>
    </div>
  );
};

export default CalendarView;