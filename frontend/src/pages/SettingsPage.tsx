import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldCheck, Server, Cpu, Database, Save, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const SettingsPage: React.FC = () => {
  const [hubName, setHubName] = useState('District Tele-Ophthalmology Hub (AP-East)');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.85);
  const [enableEdgeCLAHE, setEnableEdgeCLAHE] = useState(true);
  const [autoTriageReferrals, setAutoTriageReferrals] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-navy-950 tracking-tight">System & Telemedicine Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure clinic metadata, edge processing parameters, and AI model pipeline versioning.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Configuration saved successfully.</span>
        </div>
      )}

      <Card title="Telemedicine Clinic & Network Settings">
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Telemedicine Hub Identifier</label>
            <input
              type="text"
              value={hubName}
              onChange={(e) => setHubName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Referral Triage Sensitivity Threshold ({Math.round(confidenceThreshold * 100)}%)
              </label>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Higher sensitivity escalates more borderline cases for doctor review.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-slate-700 mb-1">Edge Device Pre-Processing</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableEdgeCLAHE}
                  onChange={(e) => setEnableEdgeCLAHE(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-slate-700">Enable local CLAHE before bandwidth upload</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoTriageReferrals}
                  onChange={(e) => setAutoTriageReferrals(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-slate-700">Automatically enqueue Level 2+ cases to doctor queue</span>
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Model & System Specifications */}
      <Card title="AI Pipeline Specifications">
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <div className="font-semibold text-navy-950">Active DR Classification Model</div>
              <div className="text-[11px] text-slate-500 font-mono">RetinaGuard EfficientNet-B0 (Exp 1 Checkpoint)</div>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-mono text-[10px] font-bold">
              Active Classifier
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <div className="font-semibold text-navy-950">Classification Scale</div>
              <div className="text-[11px] text-slate-500">ICDR 5-Grade Staging (Level 0 to Level 4)</div>
            </div>
            <span className="text-slate-700 font-mono text-xs">Referable: Level 2+</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <div className="font-semibold text-navy-950">Explainability Method</div>
              <div className="text-[11px] text-slate-500">Grad-CAM (Gradient-weighted Class Activation Mapping)</div>
            </div>
            <span className="text-slate-700 font-mono text-xs">Saliency Matrix</span>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="teal" onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};
