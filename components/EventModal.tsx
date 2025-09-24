import React, { useState, useEffect } from 'react';
import { JamEvent } from '../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: JamEvent;
  selectedDate?: string;
  onCreate: (title: string, dateTime: string) => void;
  onUpdate: (event: JamEvent) => void;
  onDelete: (eventId: number) => void;
}

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event, selectedDate, onCreate, onUpdate, onDelete }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('18:00'); // Default time

  const isEditMode = event !== undefined;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && event) {
        const eventDate = new Date(event.date);
        setTitle(event.title);
        setDate(eventDate.toISOString().split('T')[0]);
        setTime(eventDate.toTimeString().substring(0, 5));
      } else if (selectedDate) {
        setTitle('');
        setDate(selectedDate);
        setTime('18:00');
      } else {
        const today = new Date();
        setTitle('');
        setDate(today.toISOString().split('T')[0]);
        setTime('18:00');
      }
    }
  }, [isOpen, event, isEditMode, selectedDate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) {
        alert('Please fill out all fields.');
        return;
    }

    // Combine date and time into a single ISO string
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const combinedDate = new Date(year, month - 1, day, hours, minutes);

    if (isEditMode && event) {
        onUpdate({ ...event, title, date: combinedDate.toISOString() });
    } else {
        onCreate(title, combinedDate.toISOString());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-brand-dark border border-brand-brown rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-white">
              {isEditMode ? 'Edit Event' : 'Create Event'}
            </h2>
            {isEditMode && (
                <button type="button" onClick={() => onDelete(event.id)} className="p-2 text-brand-cream/70 hover:text-red-400 transition-colors" aria-label="Delete event" title="Delete Event">
                    <TrashIcon className="w-5 h-5" />
                </button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-brand-cream">Event Title</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full bg-brand-dark/70 border border-brand-brown rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label htmlFor="date" className="block text-sm font-medium text-brand-cream">Date</label>
                  <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full bg-brand-dark/70 border border-brand-brown rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold" />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-brand-cream">Time</label>
                  <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} required className="mt-1 block w-full bg-brand-dark/70 border border-brand-brown rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold" />
                </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onClose} className="bg-brand-brown/70 text-brand-cream font-bold py-2 px-6 rounded-lg hover:bg-brand-brown transition-colors duration-300">
              Cancel
            </button>
            <button type="submit" className="bg-brand-gold text-brand-dark font-bold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
              {isEditMode ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
