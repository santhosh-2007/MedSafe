import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, CheckCircle2, ChevronRight, X, Sparkles } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  actionPath: string;
  buttonText: string;
}

export const GuidedDemoTour: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const steps: TourStep[] = [
    {
      title: '1. Clinical Safety Dashboard Overview',
      description: 'Explore ward review KPIs, high-priority safety alerts, and average risk identification time.',
      actionPath: '/dashboard',
      buttonText: 'View Ward Dashboard'
    },
    {
      title: '2. Dedicated Demo Patient Review (DEMO-001)',
      description: 'Select DEMO-001 to view longitudinal records, active medications, documented allergies, and safety risks.',
      actionPath: '/patients/DEMO-001',
      buttonText: 'Open Patient DEMO-001'
    },
    {
      title: '3. Examine Evidence & Confidence',
      description: 'Inspect traceable evidence, rule match logic, system confidence (91%), and potential harm disclaimers.',
      actionPath: '/patients/DEMO-001',
      buttonText: 'Inspect Evidence Drawer'
    },
    {
      title: '4. Perform Clinician Review Workflow',
      description: 'Mark the alert as reviewed, select a clinical action outcome, and log the event in the audit system.',
      actionPath: '/patients/DEMO-001',
      buttonText: 'Test Review Action'
    },
    {
      title: '5. Baseline vs MEDSAFE Side-by-Side',
      description: 'Compare raw chronological medical records against MEDSAFE prioritized decision support summaries.',
      actionPath: '/baseline',
      buttonText: 'Open Baseline Benchmark'
    },
    {
      title: '6. Measured Evaluation Results',
      description: 'Review empirical evaluation metrics: 84.7% time reduction, precision, recall, F1, and error analysis.',
      actionPath: '/evaluation',
      buttonText: 'View Evaluation Dashboard'
    },
    {
      title: '7. Edge Cases & Failure Scenarios',
      description: 'Review 5 handled clinical edge cases (missing allergy, conflicting records, unknown drugs, duplicates).',
      actionPath: '/failure-cases',
      buttonText: 'View Failure Cases'
    }
  ];

  const step = steps[currentStep];

  const handleNext = () => {
    navigate(step.actionPath);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-slate-900 text-white rounded-2xl p-5 shadow-2xl border border-medical-500/30 animate-bounce-short">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center space-x-2 text-medical-400">
          <Sparkles size={18} />
          <h4 className="font-bold text-sm text-white">3-Minute Product Demonstration Tour</h4>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X size={16} />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-medical-300 font-semibold mb-1">
          <span>STEP {currentStep + 1} OF {steps.length}</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3">
          <div
            className="bg-medical-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <h5 className="font-bold text-base text-white mb-1">{step.title}</h5>
        <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="text-xs text-slate-400 hover:text-white disabled:opacity-30"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          className="bg-medical-600 hover:bg-medical-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center shadow-lg transition"
        >
          <span>{step.buttonText}</span>
          <ChevronRight size={14} className="ml-1" />
        </button>
      </div>
    </div>
  );
};
