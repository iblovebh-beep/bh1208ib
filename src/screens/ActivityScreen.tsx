import React, { useState } from 'react';
import { ScreenId } from '../types/health';
import { useHealth } from '../context/HealthContext';
import {
  Footprints,
  Flame,
  Plus,
  TrendingUp,
  Award,
  Zap,
  Timer,
  Compass,
  ArrowUpRight,
  Activity as ActivityIcon,
} from 'lucide-react';
import { StepModal } from '../components/StepModal';
import { WorkoutModal } from '../components/WorkoutModal';

interface ActivityScreenProps {
  onNavigate: (screen: ScreenId, transition?: 'none' | 'push') => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = () => {
  const {
    profile,
    todaySteps,
    todayCalories,
    todayDistanceKm,
    todayActiveMinutes,
    hourlyData,
    weeklyActivity,
    workouts,
    addSteps,
    addWorkout,
  } = useHealth();

  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'day' | 'week'>('day');

  const maxHourlySteps = Math.max(...hourlyData.map((d) => d.steps), 2000);
  const maxWeeklySteps = Math.max(...weeklyActivity.map((d) => d.steps), 12000);

  const stepProgress = Math.min(100, Math.round((todaySteps / profile.stepGoal) * 100));
  const calorieProgress = Math.min(100, Math.round((todayCalories / profile.calorieGoal) * 100));

  return (
    <div className="pb-24 px-4 pt-2 max-w-md mx-auto space-y-4">
      {/* Activity Overview Card */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <Footprints className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">일일 활동 요약</h2>
              <p className="text-xs text-slate-400">실시간 걸음수 및 칼로리 통계</p>
            </div>
          </div>
          <div className="flex bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/60 text-xs">
            <button
              onClick={() => setActiveTab('day')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'day'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              오늘
            </button>
            <button
              onClick={() => setActiveTab('week')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'week'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              주간
            </button>
          </div>
        </div>

        {/* Dual Hero Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>오늘 걸음</span>
              <span className="text-emerald-400 font-bold">{stepProgress}%</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">{todaySteps.toLocaleString()}</span>
              <span className="text-xs text-slate-400">보</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-slate-700/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${stepProgress}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>소모 칼로리</span>
              <span className="text-orange-400 font-bold">{calorieProgress}%</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">{todayCalories.toLocaleString()}</span>
              <span className="text-xs text-slate-400">kcal</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-slate-700/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${calorieProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3 Metrics Row */}
        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800/80">
          <div className="p-2 rounded-xl bg-slate-800/30">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" /> 이동 거리
            </div>
            <span className="text-sm font-bold text-white">{todayDistanceKm} km</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/30">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <Timer className="w-3.5 h-3.5 text-amber-400" /> 활동 시간
            </div>
            <span className="text-sm font-bold text-white">{todayActiveMinutes} 분</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/30">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <Zap className="w-3.5 h-3.5 text-orange-400" /> 오른 층수
            </div>
            <span className="text-sm font-bold text-white">{Math.round(todaySteps / 450)} 층</span>
          </div>
        </div>
      </div>

      {/* Hourly / Weekly Chart Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">
              {activeTab === 'day' ? '시간대별 걸음 분포' : '최근 7일간 활동 추이'}
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {activeTab === 'day' ? '시간당 피크 1,820보' : '평균 10,010보/일'}
          </span>
        </div>

        {activeTab === 'day' ? (
          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-1">
            {hourlyData.map((item, idx) => {
              const heightPercent = Math.max(12, Math.round((item.steps / maxHourlySteps) * 100));
              const isPeak = item.steps > 1500;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="relative w-full flex justify-center items-end h-full">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-[10px] text-white px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                      {item.steps}보
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                        isPeak
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md shadow-emerald-900/50'
                          : 'bg-slate-800 group-hover:bg-slate-700'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 tracking-tight whitespace-nowrap">
                    {item.hour}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-1">
            {weeklyActivity.map((day, idx) => {
              const heightPercent = day.steps === 0 ? 8 : Math.max(12, Math.round((day.steps / maxWeeklySteps) * 100));
              const isGoalMet = day.steps >= profile.stepGoal;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="relative w-full flex justify-center items-end h-full">
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-[10px] text-white px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                      {day.steps.toLocaleString()}보
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                        isGoalMet
                          ? 'bg-gradient-to-t from-emerald-600 to-teal-400'
                          : 'bg-slate-800 group-hover:bg-slate-700'
                      }`}
                    />
                  </div>
                  <div className="text-center">
                    <span className={`text-[11px] block font-semibold ${isGoalMet ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {day.day}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-400" />
            <span>목표 달성 구간</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-slate-800" />
            <span>일반 활동</span>
          </div>
        </div>
      </div>

      {/* Workouts History Section */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-sm text-white">오늘의 운동 기록 ({workouts.length})</h3>
          </div>
          <button
            onClick={() => setIsWorkoutModalOpen(true)}
            className="py-1 px-2.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-xl text-xs font-bold border border-orange-500/40 flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>운동 추가</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {workouts.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  {log.icon}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">{log.type}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>{log.timestamp}</span>
                    <span>•</span>
                    <span>{log.durationMinutes}분 소요</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-orange-400">
                  +{log.caloriesBurned} <span className="text-xs font-normal">kcal</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  심박 {log.heartRateAvg} bpm
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={() => setIsStepModalOpen(true)}
          className="py-3 px-4 bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-bold rounded-2xl flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer active:scale-95"
        >
          <Footprints className="w-4 h-4 text-emerald-400" />
          <span>걸음수 수동 입력</span>
        </button>

        <button
          onClick={() => setIsWorkoutModalOpen(true)}
          className="py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer shadow-lg shadow-orange-950/40 active:scale-95"
        >
          <Flame className="w-4 h-4" />
          <span>새 운동 기록</span>
        </button>
      </div>

      {/* Modals */}
      <StepModal
        isOpen={isStepModalOpen}
        onClose={() => setIsStepModalOpen(false)}
        onAdd={addSteps}
      />
      <WorkoutModal
        isOpen={isWorkoutModalOpen}
        onClose={() => setIsWorkoutModalOpen(false)}
        onSave={addWorkout}
      />
    </div>
  );
};
