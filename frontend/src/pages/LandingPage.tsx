import React from 'react';
import { Eye, ArrowRight } from 'lucide-react';
import { BackgroundCircles } from '../components/common/BackgroundCircles';

interface LandingPageProps {
  onStartScreening: () => void;
  onNavigate?: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartScreening }) => {
  return (
    <div className="relative min-h-screen w-full bg-navy-950 text-slate-100 flex flex-col items-center justify-center overflow-hidden selection:bg-teal-500/30 selection:text-teal-200">
      {/* Subtle Top Clinical Header */}
      <header className="absolute top-0 left-0 right-0 z-20 h-16 px-6 sm:px-8 flex items-center justify-between border-b border-navy-900/60 bg-navy-950/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <img
            src="/retinaguard-logo-dark.png"
            alt="RetinaGuard"
            className="h-8 sm:h-9 w-auto object-contain"
          />
        </div>

        <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider hidden sm:block">
          Tele-Retina Decision Support
        </div>
      </header>

      {/* Hero Section with Animated BackgroundCircles */}
      <main className="relative z-10 w-full flex-1 flex items-center justify-center px-4 sm:px-6">
        <BackgroundCircles className="py-16 sm:py-24">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            {/* Small subtle branding */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/25 bg-navy-900/90 text-slate-300 text-xs font-medium shadow-sm backdrop-blur-md">
              <img
                src="/retinaguard-icon-dark.png"
                alt=""
                className="h-3.5 w-auto object-contain"
              />
              <span>RetinaGuard</span>
            </div>

            {/* Main headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-sans leading-[1.15]">
              AI-Assisted Diabetic Retinopathy Screening
            </h1>

            {/* Very short supporting text */}
            <p className="text-base sm:text-lg text-slate-300/90 font-normal max-w-lg mx-auto">
              Screen fundus images. Support faster referral.
            </p>

            {/* One CTA */}
            <div className="pt-3 flex justify-center">
              <button
                onClick={onStartScreening}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold bg-teal-500 hover:bg-teal-400 text-navy-950 transition-all duration-150 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/35 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-navy-950 font-sans cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Start Screening</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </BackgroundCircles>
      </main>
    </div>
  );
};

export default LandingPage;
