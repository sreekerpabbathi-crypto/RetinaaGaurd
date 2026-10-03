import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  UserPlus,
  Eye,
  ArrowUpRight,
  Filter,
  ChevronRight,
  Calendar,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileImage,
  Info,
  X,
  Phone,
  MapPin
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { StatusBadge } from '../components/common/StatusBadge';
import { patientService } from '../services/patientService';
import { Patient } from '../types';

interface PatientsPageProps {
  onSelectPatient: (patientId: string) => void;
  onNewScreeningForPatient: (patientId: string) => void;
}

export const PatientsPage: React.FC<PatientsPageProps> = ({
  onSelectPatient,
  onNewScreeningForPatient,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // New patient modal state
  const [newPatientId, setNewPatientId] = useState('');
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState<number | ''>('');
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newPhone, setNewPhone] = useState('');
  const [newDistrict, setNewDistrict] = useState('Kurnool Rural Sub-District');
  const [newDiabetesType, setNewDiabetesType] = useState<'Type 1' | 'Type 2' | 'Gestational' | 'Pre-diabetic'>('Type 2');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string>('');
  const [regError, setRegError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPatients = async () => {
    try {
      const data = await patientService.getAllPatients(search);
      setPatients(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [search]);

  const handleOpenRegisterModal = () => {
    setNewPatientId(`PT-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setNewName('');
    setNewAge('');
    setNewGender('Male');
    setNewPhone('');
    setNewDistrict('Kurnool Rural Sub-District');
    setNewDiabetesType('Type 2');
    setAttachedImage(null);
    setAttachedFileName('');
    setRegError(null);
    setIsRegisterModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFileName(file.name);
      setAttachedImage(URL.createObjectURL(file));
    }
  };

  const handleSavePatient = async (startScreeningImmediately: boolean) => {
    setRegError(null);
    if (!newPatientId.trim()) {
      setRegError('Patient ID is required');
      return;
    }
    if (!newName.trim()) {
      setRegError('Patient name is required');
      return;
    }
    if (newAge === '' || Number(newAge) < 1 || Number(newAge) > 120) {
      setRegError('Please enter a valid age');
      return;
    }

    const p: Patient = {
      id: newPatientId,
      name: newName,
      age: Number(newAge),
      gender: newGender,
      phone: newPhone || 'N/A',
      district: newDistrict,
      diabetesType: newDiabetesType,
      diabetesDurationYears: 5,
      hba1c: undefined,
      hasHypertension: false,
      lastScreeningDate: undefined,
      lastDrGrade: undefined,
      isReferralActive: false,
      screeningsCount: 0,
      registeredAt: new Date().toISOString().split('T')[0]
    };

    try {
      await patientService.createPatient(p);
      await loadPatients();
      setIsRegisterModalOpen(false);

      if (startScreeningImmediately) {
        onNewScreeningForPatient(p.id);
      }
    } catch (err: any) {
      setRegError(err.message || 'Failed to register patient');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header with Register New Patient Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
            Patient Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered diabetic patients, past screening history, and pending retinal photographs.
          </p>
        </div>

        <Button
          variant="teal"
          size="md"
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={handleOpenRegisterModal}
        >
          + Register New Patient
        </Button>
      </div>

      <Card>
        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by patient ID, name, or primary health center..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-xs text-slate-900 placeholder:text-slate-400 transition-colors"
            />
          </div>
        </div>

        {/* Patients Table or Empty State */}
        {patients.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <UserPlus className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-navy-950">No patients registered yet.</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Register your first patient using the button above. You can upload their fundus camera photograph immediately or add it later.
              </p>
            </div>
            <Button
              variant="teal"
              size="sm"
              onClick={handleOpenRegisterModal}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Register First Patient
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 -mb-5">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/90 text-slate-500 font-semibold border-y border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-5 font-semibold">Patient ID</th>
                  <th className="py-3 px-5 font-semibold">Name & Demographics</th>
                  <th className="py-3 px-5 font-semibold">Diabetes Diagnosis</th>
                  <th className="py-3 px-5 font-semibold">Screening Status / DR Stage</th>
                  <th className="py-3 px-5 font-semibold">Last Screened</th>
                  <th className="py-3 px-5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((p) => {
                  const hasPriorScreen = p.lastDrGrade !== undefined;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => onSelectPatient(p.id)}
                      className="hover:bg-teal-50/20 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-5 font-mono font-semibold text-navy-950">{p.id}</td>
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900 group-hover:text-teal-900 transition-colors">{p.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {p.age} yrs • {p.gender} • {p.district}
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-medium text-slate-800">{p.diabetesType}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {p.diabetesDurationYears}y duration • Phone: {p.phone}
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        {hasPriorScreen ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-navy-950">Level {p.lastDrGrade}</span>
                            <StatusBadge status={p.isReferralActive ? 'REFERABLE' : 'NON-REFERABLE'} size="sm" />
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            <Camera className="w-3 h-3 text-amber-600" />
                            <span>Awaiting Image</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-slate-500 font-mono text-[11px]">
                        {p.lastScreeningDate || 'Not yet screened'}
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPatient(p.id);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                        >
                          Profile
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNewScreeningForPatient(p.id);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          {hasPriorScreen ? (
                            <>
                              <Eye className="w-3 h-3 text-teal-600" />
                              <span>Screen</span>
                            </>
                          ) : (
                            <>
                              <Camera className="w-3 h-3 text-teal-600" />
                              <span>Add Image</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Register New Patient Modal */}
      {isRegisterModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsRegisterModalOpen(false)}
          title="Register New Patient"
          subtitle="Enter demographic details. You can upload their fundus photograph now or add it later."
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            {regError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Patient ID <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={newPatientId}
                  onChange={(e) => setNewPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/40 focus:bg-white font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smt. Kamala Devi"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/40 focus:bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Age (Years) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 52"
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/40 focus:bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Gender <span className="text-rose-600">*</span>
                </label>
                <select
                  value={newGender}
                  onChange={(e) => setNewGender(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/40 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 98450 12345"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/40 focus:bg-white font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Screening Center / District <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={newDistrict}
                  onChange={(e) => setNewDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/40 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
                />
              </div>
            </div>

            {/* Fundus Image Upload Section in Modal */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-navy-950 flex items-center justify-between">
                <span>Fundus Camera Photograph (Optional)</span>
                {attachedImage && (
                  <button
                    type="button"
                    onClick={() => { setAttachedImage(null); setAttachedFileName(''); }}
                    className="text-rose-600 text-[11px] font-semibold hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              {attachedImage ? (
                <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-black flex-shrink-0">
                    <img src={attachedImage} alt="Attached" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-navy-950 truncate max-w-[240px]">{attachedFileName}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Image Attached for Screening</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-500">
                    If you have the fundus camera image right now, attach it below. Otherwise, you can register the patient and upload the image later.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm"
                    >
                      <FileImage className="w-3.5 h-3.5 text-slate-500" />
                      <span>Select Fundus Image</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.svg"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <span className="text-[11px] text-slate-400 italic">or image can be added later</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRegisterModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSavePatient(false)}
              >
                Save Patient (Add Image Later)
              </Button>
              <Button
                variant="teal"
                size="sm"
                onClick={() => handleSavePatient(true)}
              >
                Save & Start Screening Now →
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
