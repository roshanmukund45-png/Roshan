// FIX: Removed self-referential import which caused type declaration conflicts.

export enum Instrument {
  ROTO = 'Roto',
  DRUM = 'Drum',
  THAP_DHOL = 'Thap-Dhol',
  BASE = 'Base',
  TASHA = 'Tasha',
  OTHER = 'Other',
}

export enum SkillLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export enum FormStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  photo: string;
  instrument: Instrument;
  otherInstrument: string;
  skillLevel: SkillLevel;
  experience: string;
}

export interface Member extends RegistrationFormData {
  id: string;
  verificationToken: string;
  verificationStatus: 'pending' | 'verified';
  isOwner?: boolean;
  isFinanceOfficer?: boolean;
  webAuthnCredentialId?: string;
  payRate?: number; // Pay per event attended
}

export interface JamEvent {
  id: number;
  title: string;
  date: string; // ISO string format
  attendees: string[]; // member ids of those who RSVP'd 'yes'
  checkedInMembers: string[]; // member ids of those present
  paidMembers: string[]; // member ids of those who have been paid for this event
}

export interface Transaction {
    id: string;
    date: string; // ISO string
    description: string;
    amount: number; // Positive for deposits, negative for withdrawals
}

export interface Financials {
    balance: number;
    transactions: Transaction[];
}