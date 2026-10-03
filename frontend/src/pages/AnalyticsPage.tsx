import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Activity,
  Cpu,
  Sliders,
  PieChart as PieIcon,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { Card } from '../components/common/Card';
import { Tabs } from '../components/common/Tabs';
import { Button } from '../components/common/Button';
import { MetricCard } from '../components/common/MetricCard';
import { analyticsService } from '../services/analyticsService';
import {
  AnalyticsOverview,
  DistrictSimulationInput,
  DistrictSimulationResult
} from '../types';

export const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('screening');
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);

  // Simulation State
  const [simInputs, setSimInputs] = useState<DistrictSimulationInput>({
    annualTargetPopulation: 25000,
    workingDaysPerYear: 260,
    screeningCentersCount: 8,
    camerasPerCenter: 1,
    aiProcessingTimeSeconds: 3.5,
    ophthalmologistsCount: 2,
    doctorReviewTimeMinutes: 2.0,
    telemedicineBandwidthMbps: 10.0,
    referralTriageRate: 0.22,
  });

  const [simResult, setSimResult] = useState<DistrictSimulationResult | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await analyticsService.getOverview();
      setOverview(data);
      const res = await analyticsService.simulateDistrictCapacity(simInputs);
      setSimResult(res);
    };
    load();
  }, []);

  const handleRunSimulation = async () => {
    const res = await analyticsService.simulateDistrictCapacity(simInputs);
    setSimResult(res);
  };

  const handleResetSimulation = async () => {
    const defaults: DistrictSimulationInput = {
      annualTargetPopulation: 25000,
      workingDaysPerYear: 260,
      screeningCentersCount: 8,
      camerasPerCenter: 1,
      aiProcessingTimeSeconds: 3.5,
      ophthalmologistsCount: 2,
      doctorReviewTimeMinutes: 2.0,
      telemedicineBandwidthMbps: 10.0,
      referralTriageRate: 0.22,
    };
    setSimInputs(defaults);
    const res = await analyticsService.simulateDistrictCapacity(defaults);
    setSimResult(res);
  };

  const tabs = [
    { id: 'screening', label: 'Screening Analytics', icon: <PieIcon className="w-4 h-4" /> },
    { id: 'performance', label: 'Model Performance (Research Benchmarks)', icon: <Cpu className="w-4 h-4" /> },
    { id: 'capacity', label: 'District Capacity Simulator', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
          Epidemiology, Model Evaluation & Capacity Simulation
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Population screening metrics, diagnostic model validation scaffolding, and rural operational simulation.
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="segmented" />

      {/* TAB 1: Screening Analytics */}
      {activeTab === 'screening' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Total Screened"
              value={overview?.summary.totalScreenings.toLocaleString() || '1,420'}
              subValue="Diabetic cohort"
              variant="teal"
            />
            <MetricCard
              label="Referral Triage Rate"
              value={`${overview?.summary.referralRatePercent || 21.9}%`}
              subValue="Level 2+ requiring doctor review"
              variant="amber"
            />
            <MetricCard
              label="Mean AI Confidence"
              value={`${overview?.summary.averageAiConfidencePercent || 93.4}%`}
              subValue="Across 5 ICDR classes"
              variant="emerald"
            />
            <MetricCard
              label="Turnaround Time"
              value={`${overview?.summary.meanTurnaroundTimeHours || 3.2} hrs`}
              subValue="Upload to doctor sign-off"
              variant="default"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Quality Distribution */}
            <Card
              title="Image Quality Distribution"
              subtitle="Good clarity vs borderline enhancement vs ungradable captures"
            >
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={overview?.qualityDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {(overview?.qualityDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* DR Severity Distribution */}
            <Card
              title="DR Severity Distribution (ICDR Scale)"
              subtitle="Population breakdown across Grade 0 to Grade 4"
            >
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overview?.drSeverityDistribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="grade" tick={{ fontSize: 10, fill: '#64748B' }} angle={-15} textAnchor="end" />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="count" name="Patient Count" fill="#0D9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: Model Performance Scaffolding */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-950 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold">Research Benchmark Environment (Placeholder Scaffolding)</div>
              <p>
                In accordance with project guidelines, medical performance metrics are not fabricated. Once the PyTorch model pipeline is trained and evaluated on Messidor-2 / EyePACS test sets, live AUROC, sensitivity, specificity, and confusion matrices will populate here.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Sensitivity (Recall)</span>
              <div className="text-lg font-mono font-bold text-slate-400">Pending Eval</div>
              <div className="text-[10px] text-slate-400">Target: ≥90.0%</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Specificity</span>
              <div className="text-lg font-mono font-bold text-slate-400">Pending Eval</div>
              <div className="text-[10px] text-slate-400">Target: ≥85.0%</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Precision (PPV)</span>
              <div className="text-lg font-mono font-bold text-slate-400">Pending Eval</div>
              <div className="text-[10px] text-slate-400">Referable cohort</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">F1-Score</span>
              <div className="text-lg font-mono font-bold text-slate-400">Pending Eval</div>
              <div className="text-[10px] text-slate-400">Macro average</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">AUROC</span>
              <div className="text-lg font-mono font-bold text-slate-400">Pending Eval</div>
              <div className="text-[10px] text-slate-400">ROC Area under curve</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Confusion Matrix Placeholder */}
            <Card
              title="Multi-Class Confusion Matrix (5x5 ICDR)"
              subtitle="Scaffold for actual test cohort predictions vs expert ground truth"
            >
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <div className="inline-block p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-500">
                  [Level 0 .. Level 4] Confusion Matrix Grid — Populated upon ML test evaluation
                </div>
                <p className="text-[11px] text-slate-400">
                  Ready to bind with PyTorch evaluation outputs in `ml/eval.py`.
                </p>
              </div>
            </Card>

            {/* Model Comparison / Ablation Study */}
            <Card
              title="Ablation & Model Benchmark Comparison"
              subtitle="EfficientNet-B0 active checkpoint vs baseline and planned architectures"
            >
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-navy-950">Baseline ResNet-50 (Pretrained)</span>
                    <div className="text-[10px] text-slate-400">224x224 input • Standard CLAHE reference</div>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Research Baseline</span>
                </div>

                <div className="p-3 bg-teal-50/50 rounded-lg border border-teal-200/80 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-navy-950">RetinaGuard EfficientNet-B0 (Exp 1 Best)</span>
                    <div className="text-[10px] text-teal-700 font-medium">224x224 input • 5-Class ICDR • Active Endpoint</div>
                  </div>
                  <span className="text-xs font-mono text-teal-800 font-bold bg-teal-100/70 px-2 py-0.5 rounded border border-teal-300/60">Active Model</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-navy-950">EfficientNet-B4 + Lesion Attention (Planned)</span>
                    <div className="text-[10px] text-slate-400">380x380 input • Focal loss • High-res research</div>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Future Benchmark</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 3: District Capacity Simulation */}
      {activeTab === 'capacity' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Simulation Parameter Inputs (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <Card
                title="District Telemedicine Parameters"
                subtitle="Configure rural health center capacity and human-in-the-loop resources"
                headerAction={
                  <Button variant="ghost" size="sm" onClick={handleResetSimulation} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
                    Reset
                  </Button>
                }
              >
                <div className="space-y-3.5 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Annual Target Diabetic Population:</span>
                      <span className="font-mono text-teal-700">{simInputs.annualTargetPopulation.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max="100000"
                      step="5000"
                      value={simInputs.annualTargetPopulation}
                      onChange={(e) => setSimInputs({ ...simInputs, annualTargetPopulation: Number(e.target.value) })}
                      className="w-full accent-teal-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Screening Centers (Primary Health Centers):</span>
                      <span className="font-mono text-teal-700">{simInputs.screeningCentersCount} Centers</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={simInputs.screeningCentersCount}
                      onChange={(e) => setSimInputs({ ...simInputs, screeningCentersCount: Number(e.target.value) })}
                      className="w-full accent-teal-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Cameras per Center:</span>
                      <span className="font-mono text-teal-700">{simInputs.camerasPerCenter} Camera</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="1"
                      value={simInputs.camerasPerCenter}
                      onChange={(e) => setSimInputs({ ...simInputs, camerasPerCenter: Number(e.target.value) })}
                      className="w-full accent-teal-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Tele-Ophthalmologists (Readers):</span>
                      <span className="font-mono text-teal-700">{simInputs.ophthalmologistsCount} Specialists</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={simInputs.ophthalmologistsCount}
                      onChange={(e) => setSimInputs({ ...simInputs, ophthalmologistsCount: Number(e.target.value) })}
                      className="w-full accent-teal-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Doctor Review Time per Case:</span>
                      <span className="font-mono text-teal-700">{simInputs.doctorReviewTimeMinutes} min</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="5.0"
                      step="0.5"
                      value={simInputs.doctorReviewTimeMinutes}
                      onChange={(e) => setSimInputs({ ...simInputs, doctorReviewTimeMinutes: Number(e.target.value) })}
                      className="w-full accent-teal-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Telemedicine Bandwidth:</span>
                      <span className="font-mono text-teal-700">{simInputs.telemedicineBandwidthMbps} Mbps</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="1"
                      value={simInputs.telemedicineBandwidthMbps}
                      onChange={(e) => setSimInputs({ ...simInputs, telemedicineBandwidthMbps: Number(e.target.value) })}
                      className="w-full accent-teal-600"
                    />
                  </div>

                  <div className="pt-2">
                    <Button variant="teal" className="w-full" onClick={handleRunSimulation} leftIcon={<Play className="w-4 h-4" />}>
                      Recalculate District Capacity
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Simulation Results & Operational Bottleneck Analysis (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {simResult && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Daily Throughput</span>
                      <div className="text-xl font-bold font-mono text-navy-950 mt-1">
                        {simResult.dailyScreeningCapacity} pts/day
                      </div>
                      <div className="text-[10px] text-slate-500">Across {simInputs.screeningCentersCount} health centers</div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Annual Coverage</span>
                      <div className="text-xl font-bold font-mono text-teal-700 mt-1">
                        {simResult.screeningCoveragePercent}%
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {simResult.annualScreeningCapacity.toLocaleString()} patients/yr
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Doctor Utilization</span>
                      <div className={`text-xl font-bold font-mono mt-1 ${simResult.ophthalmologistUtilizationPercent > 85 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {simResult.ophthalmologistUtilizationPercent}%
                      </div>
                      <div className="text-[10px] text-slate-500">Reading workload</div>
                    </div>
                  </div>

                  {/* Bottleneck Warning Box */}
                  <div
                    className={`p-4 rounded-xl border space-y-2 ${
                      simResult.bottleneck === 'None'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50 border-amber-200 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {simResult.bottleneck === 'None' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      )}
                      <span>Operational Bottleneck: {simResult.bottleneck}</span>
                    </div>
                    <div className="text-xs">
                      Average queue backlog: <span className="font-bold">{simResult.averageReviewQueueSize} cases</span> • Estimated turnaround: <span className="font-bold">{simResult.estimatedTurnaroundHours} hours</span>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <Card title="Program Optimization Recommendations">
                    <ul className="space-y-2 text-xs text-slate-700">
                      {simResult.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
