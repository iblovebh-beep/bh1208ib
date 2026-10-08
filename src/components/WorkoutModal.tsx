import React, { useState } from 'react';
import { X, Flame, Clock, Heart, Plus } from 'lucide-react';

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: string, durationMinutes: number, calories: number, heartRate: number) => void;
}

const workoutPresets = [
  { name: '야외 러닝', icon: '🏃‍♂️', defaultDuration: 30, calPerMin: 9.5, defaultBpm: 148 },
  { name: '실내 사이클', icon: '🚴‍♀️', defaultDuration: 40, calPerMin: 8.0, defaultBpm: 135 },
  { name: '웨이트 트레이닝', icon: '🏋️‍♂️', defaultDuration: 50, calPerMin: 6.5, defaultBpm: 125 },
  { name: '인터벌 걷기', icon: '🚶‍♂️', defaultDuration: 35, calPerMin: 4.8, defaultBpm: 112 },
  { name: '요가 & 스트레칭', icon: '🧘‍♀️', defaultDuration: 30, calPerMin: 3.5, defaultBpm: 98 },
  { name: '수영 (자유형)', icon: '🏊‍♂️', defaultDuration: 45, calPerMin: 9.0, defaultBpm: 140 },
];

export const WorkoutModal: React.FC<WorkoutModalProps> = ({ isOpen, onClose, onSave }) => {
  const [selectedPreset, setSelectedPreset] = useState(workoutPresets[0]);
  const [duration, setDuration] = useState<number>(30);
  const [customCalories, setCustomCalories] = useState<number | null>(null);
  const [heartRate, setHeartRate] = useState<number>(140);

  if (!isOpen) return null;

  const calculatedCalories = customCalories !== null 
    ? customCalories 
    : Math.round(duration * selectedPreset.calPerMin);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(selectedPreset.name, duration, calculatedCalories, heartRate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <Flame className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-base">운동 기록 추가</h3>
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
              운동 종목 선택
            </label>
            <div className="grid grid-cols-3 gap-2">
              {workoutPresets.map((preset) => {
                const isSelected = selectedPreset.name === preset.name;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(preset);
                      setHeartRate(preset.defaultBpm);
                      setCustomCalories(null);
                    }}
                    className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-center border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/15 text-orange-300 font-semibold shadow-lg shadow-orange-950/40'
                        : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl">{preset.icon}</span>
                    <span className="text-[11px] leading-tight line-clamp-1">{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-400" /> 운동 시간
              </span>
              <span className="font-bold text-orange-400">{duration}분</span>
            </div>
            <input
              type="range"
              min="5"
              max="180"
              step="5"
              value={duration}
              onChange={(e) => {
                setDuration(Number(e.target.value));
                setCustomCalories(null);
              }}
              className="w-full accent-orange-500 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex gap-1.5 mt-2">
              {[15, 30, 45, 60, 90].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    setDuration(mins);
                    setCustomCalories(null);
                  }}
                  className={`flex-1 py-1 text-[11px] rounded-lg border transition-colors ${
                    duration === mins
                      ? 'bg-orange-500 text-white border-orange-400 font-bold'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {mins}분
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
              <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>예상 소모</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white">{calculatedCalories}</span>
                <span className="text-xs text-orange-400">kcal</span>
              </div>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
              <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>평균 심박수</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="80"
                  max="200"
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-sm font-bold text-white focus:outline-none focus:border-rose-400"
                />
                <span className="text-xs text-rose-400">bpm</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold rounded-2xl shadow-lg shadow-orange-900/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>운동 저장 및 칼로리 반영</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
