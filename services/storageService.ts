import { Member, JamEvent, Financials } from '../types';

const MEMBERS_STORAGE_KEY = 'heramb-musical-group-members';
const EVENTS_STORAGE_KEY = 'heramb-musical-group-events';
const LOGO_STORAGE_KEY = 'heramb-musical-group-logo';
const FINANCIALS_STORAGE_KEY = 'heramb-musical-group-financials';

export const loadMembers = (): Member[] => {
  try {
    const savedMembers = localStorage.getItem(MEMBERS_STORAGE_KEY);
    return savedMembers ? JSON.parse(savedMembers) : [];
  } catch (error) {
    console.error("Failed to load members from localStorage", error);
    return [];
  }
};

export const saveMembers = (members: Member[]): void => {
  try {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
  } catch (error) {
    console.error("Failed to save members to localStorage", error);
  }
};

export const loadEvents = (): JamEvent[] => {
  try {
    const savedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
    return savedEvents ? JSON.parse(savedEvents) : [];
  } catch (error) {
    console.error("Failed to load events from localStorage", error);
    return [];
  }
};

export const saveEvents = (events: JamEvent[]): void => {
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch (error)
    {
    console.error("Failed to save events to localStorage", error);
  }
};

export const loadLogo = (): string | null => {
  try {
    return localStorage.getItem(LOGO_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to load logo from localStorage", error);
    return null;
  }
};

export const saveLogo = (logo: string): void => {
  try {
    localStorage.setItem(LOGO_STORAGE_KEY, logo);
  } catch (error) {
    console.error("Failed to save logo to localStorage", error);
  }
};

export const loadFinancials = (): Financials | null => {
    try {
        const savedFinancials = localStorage.getItem(FINANCIALS_STORAGE_KEY);
        return savedFinancials ? JSON.parse(savedFinancials) : null;
    } catch (error) {
        console.error("Failed to load financials from localStorage", error);
        return null;
    }
};

export const saveFinancials = (financials: Financials): void => {
    try {
        localStorage.setItem(FINANCIALS_STORAGE_KEY, JSON.stringify(financials));
    } catch (error) {
        console.error("Failed to save financials to localStorage", error);
    }
};
