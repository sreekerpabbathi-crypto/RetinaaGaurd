import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Eye,
  Clock,
  ArrowRight,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Search,
  ChevronRight,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { patientService } from '../services/patientService';
import { screeningService } from '../services/screeningService';
import { Patient, ScreeningSession } from '../types';

interface DashboardPageProps {
  onNavigate: (route: string) => void;
  onOpenScreeningSession?: (screeningId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenScreeningSession,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [screenings, setScreenings] = useState<ScreeningSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [patientsData, screeningsData] = await Promise.all([
          patientService.getAllPatients(),
          screeningService.getAllScreenings(),
        ]);
        setPatients(patientsData);
        setScreenings(screeningsData);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Find cases pending doctor review (genuine data only)
  const pendingReviews = screenings.filter((s) => s.review?.status === 'PENDING');

  // Match patients with their latest screening outcome
  const getPatientLatestStatus = (patient: Patient): { label: string; status: 'GOOD' | 'REFERABLE' | 'NON-REFERABLE' | 'PENDING REVIEW' | 'UNGRADABLE' | 'BORDERLINE'; isAwaitingImage: boolean } => {
    const patientScreenings = screenings.filter((s) => s.patientId === patient.id);
    if (patientScreenings.length === 0) {
      return { label: 'Awaiting Image', status: 'BORDERLINE', isAwaitingImage: true };
    }
    const latest = patientScreenings[0];
    if (latest.review?.status === 'PENDING') {
      return { label: 'Awaiting Clinical Review', status: 'PENDING REVIEW', isAwaitingImage: false };
    }
    if (latest.classification) {
      if (latest.classification.referable) {
        return { label: `Referable DR (Level ${latest.classification.grade})`, status: 'REFERABLE', isAwaitingImage: false };
      }
      return { label: 'No DR Detected', status: 'NON-REFERABLE', isAwaitingImage: false };
    }
    if (latest.quality?.state === 'UNGRADABLE') {
      return { label: 'Ungradable (Recapture Needed)', status: 'UNGRADABLE', isAwaitingImage: true };
    }
    return { label: 'Analysis Complete', status: 'GOOD', isAwaitingImage: false };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-12">
      {/* 1. Clinical Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img src="/retinaguard-logo.png" alt="RetinaGuard" className="h-8 w-auto object-contain" />
          <div className="h-4 w-[1px] bg-slate-300 hidden sm:block" />
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200/80 px-2.5 py-1 rounded-md">
            Diabetic Retinopathy Screening
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-xs text-slate-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-navy-950">Primary Health Center #04</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Staff: Technician</span>
          </div>
        </div>
      </div>

      {/* 2. Welcome Section */}
      <div className="bg-navy-950 border border-navy-850 rounded-2xl p-6 sm:p-7 text-white shadow-card-subtle relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-1.5">
          <div className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
            Clinical Triage Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {getGreeting()} 👋
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed pt-0.5">
            Screen a patient and get an AI-assisted retinal assessment in minutes.
          </p>
        </div>
        <div className="absolute right-2 top-0 bottom-0 w-72 opacity-10 pointer-events-none flex items-center justify-center p-4">
          <img src="/retinaguard-icon-dark.png" alt="" className="w-48 h-auto object-contain" />
        </div>
      </div>

      {/* 3. Primary Action: SCREEN NEW PATIENT */}
      <div className="bg-white rounded-2xl border border-teal-600/30 shadow-card-subtle p-6 sm:p-7 transition-all hover:border-teal-500/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/70 text-teal-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Primary Screening Action</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy-950 tracking-tight">
              Screen New Patient
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Enter patient information, upload a fundus camera photograph, validate image quality, and receive an instant AI-assisted diabetic retinopathy assessment.
            </p>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={() => onNavigate('screening')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>+ Screen New Patient</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Recent Patients Section (Real Data, Clean Table, Proper Empty States) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy-950">Recent Patients</h2>
            <p className="text-xs text-slate-500">
              Patients registered at this center and their latest screening status.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('patients')}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            View All Patients
          </Button>
        </div>

        {patients.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <UserPlus className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-navy-950">No patients yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Register your first patient to begin screening and capturing retinal images.
              </p>
            </div>
            <Button
              variant="teal"
              size="sm"
              onClick={() => onNavigate('screening')}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              + Register First Patient
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-6">Patient</th>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6">Screening Status / Result</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patients.slice(0, 6).map((patient) => {
                    const statusInfo = getPatientLatestStatus(patient);
                    return (
                      <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-navy-950 text-sm">{patient.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {patient.id} • {patient.age} yrs • {patient.gender} • {patient.district}
                          </div>
                        </td>

                        <td className="py-4 px-6 text-slate-600 font-mono text-[11px]">
                          {patient.lastScreeningDate || patient.registeredAt || 'Today'}
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <StatusBadge status={statusInfo.status} size="sm" />
                            <span className="text-xs font-medium text-slate-700">
                              {statusInfo.label}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-right">
                          {statusInfo.isAwaitingImage ? (
                            <button
                              onClick={() => onNavigate('screening')}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors inline-flex items-center gap-1.5"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>Add Image</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onNavigate('screening')}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-1"
                            >
                              <span>View Result</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 5. Cases Awaiting Clinical Review (Human-in-the-Loop Triage) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-navy-950">Cases Awaiting Clinical Review</h2>
            {pendingReviews.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                {pendingReviews.length} pending
              </span>
            )}
          </div>
          {pendingReviews.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('review')}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Open Review Queue
            </Button>
          )}
        </div>

        {pendingReviews.length === 0 ? (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
            <p className="font-medium text-slate-700">No cases currently awaiting review.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              All processed screenings have been reviewed or are up to date.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingReviews.slice(0, 3).map((session) => {
              const grade = session.classification?.grade ?? 0;
              const isReferable = grade >= 2;
              return (
                <div
                  key={session.id}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-navy-950 text-sm">{session.patientName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {session.patientId} • Eye: {session.eye}
                      </div>
                    </div>
                    <StatusBadge status={isReferable ? 'REFERABLE' : 'NON-REFERABLE'} size="sm" />
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
                    <div className="text-slate-500 text-[10px] uppercase font-semibold">AI Staging</div>
                    <div className="font-bold text-navy-950 mt-0.5">
                      Level {grade} — {session.classification?.gradeName || 'Pending'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => onNavigate('review')}
                      className="px-2.5 py-1 text-xs font-semibold text-teal-800 bg-teal-100 hover:bg-teal-200 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Medical Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-500 leading-relaxed">
        <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-700">Notice for Healthcare Workers: </span>
          RetinaGuard is an AI-assisted diabetic retinopathy screening decision-support system. It does not provide definitive medical diagnoses or replace an in-person clinical examination by a qualified ophthalmologist.
        </div>
      </div>
    </div>
  );
};
