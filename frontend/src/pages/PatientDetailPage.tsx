import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Eye, Calendar, FileText, Activity, ShieldAlert, Award } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { patientService } from '../services/patientService';
import { Patient, ScreeningSession } from '../types';

interface PatientDetailPageProps {
  patientId: string;
  onBack: () => void;
  onStartScreening: (patientId: string) => void;
}

export const PatientDetailPage: React.FC<PatientDetailPageProps> = ({
  patientId,
  onBack,
  onStartScreening,
}) => {
  const [patient, setPatient] = useState<Patient | undefined>();
  const [screenings, setScreenings] = useState<ScreeningSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const p = await patientService.getPatientById(patientId);
        const s = await patientService.getPatientScreenings(patientId);
        setPatient(p);
        setScreenings(s);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [patientId]);

  if (!patient) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-slate-500">Patient profile not found.</p>
        <Button variant="outline" size="sm" onClick={onBack}>
          Back to Registry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-navy-950 flex items-center gap-2">
              <span>{patient.name}</span>
              <span className="text-xs font-mono font-normal text-slate-400">({patient.id})</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{patient.district}</p>
          </div>
        </div>

        <Button
          variant="teal"
          size="sm"
          leftIcon={<Eye className="w-4 h-4" />}
          onClick={() => onStartScreening(patient.id)}
        >
          {screenings.length === 0 ? '+ Add Fundus Image' : 'Initiate New Screening'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient Profile Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card title="Demographic & Clinical Profile">
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Age & Gender:</span>
                <span className="font-semibold">{patient.age} yrs • {patient.gender}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Contact:</span>
                <span className="font-mono">{patient.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Diabetes Subtype:</span>
                <span className="font-semibold text-navy-950">{patient.diabetesType}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Duration:</span>
                <span className="font-semibold">{patient.diabetesDurationYears} years</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">HbA1c (%):</span>
                <span className="font-mono font-bold text-rose-700">{patient.hba1c ? `${patient.hba1c}%` : 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Hypertension:</span>
                <span className="font-semibold">{patient.hasHypertension ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Registered On:</span>
                <span className="font-mono">{patient.registeredAt}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Screening History Timeline (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card title={`Screening Sessions (${screenings.length})`}>
            {screenings.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                  <Eye className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-navy-950">Fundus Image Awaiting Capture</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    This patient is registered, but no retinal photograph has been uploaded yet. You can capture and upload the image to perform AI screening.
                  </p>
                </div>
                <Button
                  variant="teal"
                  size="sm"
                  leftIcon={<Eye className="w-4 h-4" />}
                  onClick={() => onStartScreening(patient.id)}
                >
                  + Add Fundus Image & Begin Screening
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {screenings.map((s) => {
                  const grade = s.classification?.grade ?? 0;
                  const isReferable = grade >= 2;
                  return (
                    <div
                      key={s.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-navy-950 text-xs">{s.id}</span>
                          <span className="text-xs text-slate-500">
                            • {new Date(s.createdAt).toLocaleDateString()}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-bold">
                            Eye: {s.eye === 'OD' ? 'Right Eye (OD)' : s.eye === 'OS' ? 'Left Eye (OS)' : 'Not Specified'}
                          </span>
                        </div>
                        <StatusBadge status={isReferable ? 'REFERABLE' : 'NON-REFERABLE'} size="sm" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                          <span className="text-slate-400 text-[10px] uppercase font-semibold">AI Staging</span>
                          <div className="font-bold text-navy-950 mt-0.5">
                            Level {grade} — {s.classification?.gradeName}
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                          <span className="text-slate-400 text-[10px] uppercase font-semibold">Image Quality</span>
                          <div className="font-bold text-emerald-700 mt-0.5">
                            {s.quality?.state || 'GOOD'} ({((s.quality?.overallScore || 0.9) * 100).toFixed(0)}%)
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                          <span className="text-slate-400 text-[10px] uppercase font-semibold">Doctor Review</span>
                          <div className="font-bold text-slate-800 mt-0.5">
                            {s.review.status}
                          </div>
                        </div>
                      </div>

                      {s.review.clinicalNotes && (
                        <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 italic">
                          "{s.review.clinicalNotes}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
