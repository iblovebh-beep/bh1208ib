import React, { useState } from 'react';
import { X, Footprints, Plus } from 'lucide-react';

interface StepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (steps: number) => void;
}

export const StepModal: React.FC<StepModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [customSteps, setCustomSteps] = useState<number>(1000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSteps > 0) {
      onAdd(customSteps);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Footprints className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-base">걸음수 직접 추가</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-2 block">
              추가할 걸음수
            </label>
            <div className="relative">
              <input
                type="number"
                min="50"
                step="50"
                max="50000"
                value={customSteps}
                onChange={(e) => setCustomSteps(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-2xl font-black text-emerald-400 focus:outline-none focus:border-emerald-400 text-center"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">
                걸음
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[500, 1000, 2000, 5000].map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => setCustomSteps(step)}
                className={`py-2 text-xs rounded-xl border transition-all ${
                  customSteps === step
                    ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                +{step.toLocaleString()}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            약 {Math.round(customSteps * 0.045)} kcal 소모 및 {(customSteps * 0.00072).toFixed(2)} km 이동으로 자동 환산됩니다.
          </p>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-2xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>오늘 걸음수에 반영</span>
          </button>
        </form>
      </div>
    </div>
  );
};
