import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  Filter,
  CheckCircle2,
  Clock,
  Eye,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Check,
  X,
  Edit3
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { ImageZoomViewer } from '../components/common/ImageZoomViewer';
import { reviewService } from '../services/reviewService';
import { ScreeningSession, ClinicalReview, DRGrade } from '../types';

interface ReviewQueuePageProps {
  onOpenScreeningWorkspace: (screeningId: string) => void;
}

export const ReviewQueuePage: React.FC<ReviewQueuePageProps> = ({
  onOpenScreeningWorkspace,
}) => {
  const [queue, setQueue] = useState<ScreeningSession[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeReviewSession, setActiveReviewSession] = useState<ScreeningSession | null>(null);
  const [reviewGrade, setReviewGrade] = useState<DRGrade>(2);
  const [reviewNotes, setNotes] = useState('');
  const [isAdjudicating, setIsAdjudicating] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await reviewService.getReviewQueue(statusFilter);
      setQueue(data);
    };
    load();
  }, [statusFilter]);

  const handleOpenQuickReview = (session: ScreeningSession) => {
    setActiveReviewSession(session);
    setReviewGrade(session.classification?.grade ?? 2);
    setNotes(session.review.clinicalNotes || '');
  };

  const handleSaveAdjudication = async (status: 'CONFIRMED' | 'MODIFIED') => {
    if (!activeReviewSession) return;
    setIsAdjudicating(true);
    try {
      const updatedReview: ClinicalReview = {
        status,
        reviewerName: 'Dr. S. K. Venkat (Tele-Ophthalmologist)',
        reviewedAt: new Date().toISOString(),
        assignedGrade: reviewGrade,
        referralDecision: reviewGrade >= 2 ? 'TELE_OPHTHALMOLOGY' : 'ROUTINE_MONITORING',
        clinicalNotes: reviewNotes || 'Adjudicated via Tele-Review Queue.',
      };
      await reviewService.adjudicateReview(activeReviewSession.id, updatedReview);
      setQueue(
        queue.map((s) => (s.id === activeReviewSession.id ? { ...s, review: updatedReview } : s))
      );
      setActiveReviewSession(null);
    } finally {
      setIsAdjudicating(false);
    }
  };

  const pendingCount = queue.filter((s) => s.review.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
            Human-in-the-Loop Clinical Review Queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ophthalmologist triage queue for cases meeting Referable DR (Level 2+) or borderline image quality.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-100 p-1 rounded-xl border border-slate-200">
          {['ALL', 'PENDING', 'CONFIRMED', 'MODIFIED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === tab
                  ? 'bg-white text-navy-950 shadow-sm'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              {tab === 'PENDING' ? `Pending (${pendingCount})` : tab}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto -mx-5 -my-2">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-5">Session / Patient</th>
                <th className="py-3.5 px-5">Eye</th>
                <th className="py-3.5 px-5">AI Staging</th>
                <th className="py-3.5 px-5">Referable Status</th>
                <th className="py-3.5 px-5">AI Confidence</th>
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-5">Review Status</th>
                <th className="py-3.5 px-5 text-right">Adjudication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queue.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <div className="font-bold text-navy-950 text-sm">No cases awaiting review.</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      All screenings have been evaluated or no pending cases match the current filter.
                    </div>
                  </td>
                </tr>
              ) : (
                queue.map((s) => {
                const grade = s.classification?.grade ?? 0;
                const isRef = grade >= 2;
                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-navy-950">{s.patientName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {s.id} • {s.patientId}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-navy-950 font-mono">{s.eye}</td>
                    <td className="py-3.5 px-5">
                      <span className="font-bold text-navy-950">Level {grade}</span>
                      <div className="text-[10px] text-slate-500 truncate max-w-[130px]">
                        {s.classification?.gradeName}
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <StatusBadge status={isRef ? 'REFERABLE' : 'NON-REFERABLE'} size="sm" />
                    </td>
                    <td className="py-3.5 px-5 font-mono font-bold text-teal-800">
                      {((s.classification?.confidence || 0.9) * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 text-[11px] font-mono">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-5">
                      <StatusBadge
                        status={s.review.status === 'PENDING' ? 'PENDING REVIEW' : s.review.status}
                        size="sm"
                      />
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenQuickReview(s)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-navy-950 hover:bg-navy-900 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                        <span>Quick Review</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Adjudication Modal */}
      {activeReviewSession && (
        <Modal
          isOpen={true}
          onClose={() => setActiveReviewSession(null)}
          title={`Clinical Adjudication: ${activeReviewSession.patientName}`}
          subtitle={`Session ${activeReviewSession.id} • Eye: ${activeReviewSession.eye}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full aspect-square max-h-[260px] bg-black rounded-xl overflow-hidden border border-slate-300 mx-auto">
                <img
                  src={activeReviewSession.imageUrl || '/assets/samples/sample_dr2_fundus.svg'}
                  alt="Fundus"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400">AI Finding</div>
                  <div className="font-bold text-navy-950 text-sm mt-0.5">
                    Level {activeReviewSession.classification?.grade} — {activeReviewSession.classification?.gradeName}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Confidence: {((activeReviewSession.classification?.confidence || 0.9) * 100).toFixed(1)}%
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Assign Final Confirmed Clinical DR Grade:
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[0, 1, 2, 3, 4].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setReviewGrade(g as DRGrade)}
                        className={`py-1.5 text-center rounded-lg border text-xs font-bold transition-all ${
                          reviewGrade === g
                            ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Lvl {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Review Notes:</label>
                  <textarea
                    rows={3}
                    value={reviewNotes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter clinical findings or referral triage instructions..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setActiveReviewSession(null)}>
                Cancel
              </Button>
              <Button
                variant="teal"
                size="sm"
                isLoading={isAdjudicating}
                onClick={() => handleSaveAdjudication('CONFIRMED')}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Sign Off & Confirm Staging
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
