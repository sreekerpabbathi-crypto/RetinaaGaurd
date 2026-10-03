import { Patient, ScreeningSession } from '../types';
import { fetchJson } from './api';
import { MOCK_PATIENTS, MOCK_SCREENINGS } from './mockData';

export const patientService = {
  async getAllPatients(searchQuery?: string): Promise<Patient[]> {
    try {
      const q = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
      return await fetchJson<Patient[]>(`/patients${q}`);
    } catch {
      if (!searchQuery) return MOCK_PATIENTS;
      const lower = searchQuery.toLowerCase();
      return MOCK_PATIENTS.filter(
        p => p.name.toLowerCase().includes(lower) || p.id.toLowerCase().includes(lower) || p.district.toLowerCase().includes(lower)
      );
    }
  },

  async getPatientById(id: string): Promise<Patient | undefined> {
    try {
      return await fetchJson<Patient>(`/patients/${id}`);
    } catch {
      return MOCK_PATIENTS.find(p => p.id === id);
    }
  },

  async getPatientScreenings(patientId: string): Promise<ScreeningSession[]> {
    try {
      return await fetchJson<ScreeningSession[]>(`/patients/${patientId}/screenings`);
    } catch {
      return MOCK_SCREENINGS.filter(s => s.patientId === patientId);
    }
  },

  async createPatient(patient: Patient): Promise<Patient> {
    try {
      return await fetchJson<Patient>('/patients', {
        method: 'POST',
        body: JSON.stringify(patient),
      });
    } catch {
      MOCK_PATIENTS.unshift(patient);
      return patient;
    }
  }
};
