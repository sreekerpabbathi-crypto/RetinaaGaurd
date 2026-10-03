import { DRGrade } from './screening';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  district: string;
  diabetesType: 'Type 1' | 'Type 2' | 'Gestational' | 'Pre-diabetic';
  diabetesDurationYears: number;
  hba1c?: number;
  hasHypertension: boolean;
  lastScreeningDate?: string;
  lastDrGrade?: DRGrade;
  isReferralActive: boolean;
  screeningsCount: number;
  registeredAt: string;
}
