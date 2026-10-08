import React, { useState } from 'react';
import { ScreenId } from '../types/health';
import { useHealth } from '../context/HealthContext';
import {
  Footprints,
  Flame,
  Moon,
  Heart,
  Droplets,
  ChevronRight,
  Plus,
  TrendingUp,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { StepModal } from '../components/StepModal';
import { WorkoutModal } from '../components/WorkoutModal';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId, transition?: 'none' | 'push') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const {
    profile,
    todaySteps,
    todayCalories,
    todayDistanceKm,
    todayActiveMinutes,
    todayWaterMl,
    currentHeartRate,
    sleepRecord,
    workouts,
    addSteps,
    addWater,
    addWorkout,
  } = useHealth();

  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);

  const stepProgress = Math.min(100, Math.round((todaySteps / profile.stepGoal) * 100));
  const calorieProgress = Math.min(100, Math.round((todayCalories / profile.calorieGoal) * 100));
  const waterProgress = Math.min(100, Math.round((todayWaterMl / profile.waterGoalMl) * 100));

  const sleepHours = Math.floor(sleepRecord.totalMinutes / 60);
  const sleepMins = sleepRecord.totalMinutes % 60;

  return (
    <div className="pb-24 px-4 pt-2 max-w-md mx-auto space-y-4">
      {/* Daily Vitality Score Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 p-4.5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>오늘의 컨디션 지수</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-white">88점</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                최적의 회복 상태
              </span>
            </div>
            <p className="text-xs text-slate-400">
              규칙적인 수면과 가벼운 유산소 운동으로 신체 리듬이 매우 안정적입니다.
            </p>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400"
                strokeDasharray="88, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <Activity className="w-6 h-6 text-emerald-400 absolute" />
          </div>
        </div>
      </div>

      {/* Target Section 1: 오늘 걸음수 (Navigates to 활동 분석 with push) */}
      <section
        role="button"
        tabIndex={0}
        onClick={() => onNavigate('activity', 'push')}
        onKeyDown={(e) => e.key === 'Enter' && onNavigate('activity', 'push')}
        className="group relative overflow-hidden rounded-3xl bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 p-5 shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.99]"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white tracking-tight">오늘 걸음수</h2>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold">
                  활동
                </span>
              </div>
              <p className="text-xs text-slate-400">목표 {profile.stepGoal.toLocaleString()}보 중</p>
            </div>
          </div>
          <div className="flex items-center text-slate-400 group-hover:text-emerald-400 transition-colors">
            <span className="text-xs mr-1 opacity-80 group-hover:opacity-100">분석 보기</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white tracking-tight">
              {todaySteps.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-emerald-400">걸음</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-400">{stepProgress}% 달성</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden mb-3.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${stepProgress}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/80 mb-3">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-400">거리:</span>
            <span className="font-bold text-white">{todayDistanceKm} km</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 justify-end">
            <span className="text-slate-400">활동 시간:</span>
            <span className="font-bold text-white">{todayActiveMinutes}분</span>
          </div>
        </div>

        {/* Quick add actions */}
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => addSteps(500)}
            className="flex-1 py-1.5 px-2 bg-slate-800/80 hover:bg-emerald-500/20 hover:text-emerald-300 border border-slate-700/60 rounded-xl text-xs text-slate-300 font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>+500보</span>
          </button>
          <button
            type="button"
            onClick={() => addSteps(1000)}
            className="flex-1 py-1.5 px-2 bg-slate-800/80 hover:bg-emerald-500/20 hover:text-emerald-300 border border-slate-700/60 rounded-xl text-xs text-slate-300 font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>+1,000보</span>
          </button>
          <button
            type="button"
            onClick={() => setIsStepModalOpen(true)}
            className="py-1.5 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors active:scale-95"
          >
            <span>직접입력</span>
          </button>
        </div>
      </section>

      {/* Target Section 2: 소모 칼로리 (Navigates to 활동 분석 with push) */}
      <section
        role="button"
        tabIndex={0}
        onClick={() => onNavigate('activity', 'push')}
        onKeyDown={(e) => e.key === 'Enter' && onNavigate('activity', 'push')}
        className="group relative overflow-hidden rounded-3xl bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-orange-500/50 p-5 shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.99]"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-orange-500/15 text-orange-400 border border-orange-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white tracking-tight">소모 칼로리</h2>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-orange-500/20 text-orange-300 font-semibold">
                  에너지
                </span>
              </div>
              <p className="text-xs text-slate-400">목표 {profile.calorieGoal} kcal 중</p>
            </div>
          </div>
          <div className="flex items-center text-slate-400 group-hover:text-orange-400 transition-colors">
            <span className="text-xs mr-1 opacity-80 group-hover:opacity-100">운동 기록</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white tracking-tight">
              {todayCalories.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-orange-400">kcal</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-orange-400">{calorieProgress}% 소모</span>
          </div>
        </div>

        <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden mb-3.5">
          <div
            className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 rounded-full transition-all duration-500"
            style={{ width: `${calorieProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-slate-800/80 mb-3">
          <span className="text-slate-400">오늘 완료한 운동</span>
          <span className="font-bold text-white">{workouts.length}회 기록됨 ({workouts.reduce((acc, w) => acc + w.caloriesBurned, 0)} kcal)</span>
        </div>

        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setIsWorkoutModalOpen(true)}
            className="w-full py-2 px-3 bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 border border-orange-500/40 rounded-xl text-xs text-orange-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-95"
          >
            <Plus className="w-4 h-4 text-orange-400" />
            <span>새로운 운동 기록 추가하기</span>
          </button>
        </div>
      </section>

      {/* Target Section 3: 수면 분석 (Navigates to 수면 리포트 with push) */}
      <section
        role="button"
        tabIndex={0}
        onClick={() => onNavigate('sleep', 'push')}
        onKeyDown={(e) => e.key === 'Enter' && onNavigate('sleep', 'push')}
        className="group relative overflow-hidden rounded-3xl bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 p-5 shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.99]"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white tracking-tight">수면 분석</h2>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold">
                  회복 리포트
                </span>
              </div>
              <p className="text-xs text-slate-400">{sleepRecord.date}</p>
            </div>
          </div>
          <div className="flex items-center text-slate-400 group-hover:text-indigo-400 transition-colors">
            <span className="text-xs mr-1 opacity-80 group-hover:opacity-100">상세 분석</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white tracking-tight">
              {sleepHours}시간 {sleepMins}분
            </span>
            <span className="text-xs font-semibold text-slate-400">수면</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400">수면 점수</span>
            <span className="text-sm font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full">
              {sleepRecord.qualityScore}점
            </span>
          </div>
        </div>

        {/* Sleep Stage Stack Bar */}
        <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-0.5 mb-3">
          {sleepRecord.stages.map((stg) => (
            <div
              key={stg.name}
              style={{ width: `${stg.percentage}%`, backgroundColor: stg.color }}
              title={`${stg.name}: ${stg.percentage}%`}
              className="h-full first:rounded-l-full last:rounded-r-full"
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-400">취침 ~ 기상:</span>
            <span className="font-semibold text-white">
              {sleepRecord.bedTime} ~ {sleepRecord.wakeTime}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 justify-end">
            <span className="text-slate-400">수면 효율:</span>
            <span className="font-bold text-indigo-300">{sleepRecord.efficiency}%</span>
          </div>
        </div>
      </section>

      {/* Secondary Metrics: Heart Rate & Water Intake Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Heart Rate Widget */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold">
              <Heart className="w-4 h-4 animate-ping" />
              <span>실시간 심박수</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl font-black text-white">{currentHeartRate}</span>
            <span className="text-xs text-rose-400 font-medium">BPM</span>
          </div>
          <p className="text-[11px] text-slate-400">
            안정 심박수 60bpm 대비 정상 범위 유지
          </p>
        </div>

        {/* Water Intake Widget */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold">
              <Droplets className="w-4 h-4" />
              <span>수분 섭취</span>
            </div>
            <span className="text-[10px] text-sky-300 font-bold">{waterProgress}%</span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl font-black text-white">
              {(todayWaterMl / 1000).toFixed(1)}
            </span>
            <span className="text-xs text-sky-400 font-medium">/ 2.0L</span>
          </div>
          <button
            type="button"
            onClick={() => addWater(250)}
            className="w-full mt-1 py-1 px-2 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 rounded-xl text-[11px] text-sky-300 font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors active:scale-95"
          >
            <Plus className="w-3 h-3 text-sky-400" />
            <span>+250ml 기록</span>
          </button>
        </div>
      </div>

      {/* Today Wellness Checklist */}
      <div className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800/80">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>오늘의 건강 루틴 달성 현황</span>
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50">
            <span className="text-slate-300">10,000 걸음 걷기</span>
            <span className={todaySteps >= profile.stepGoal ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              {todaySteps >= profile.stepGoal ? '완료 🎉' : `${(profile.stepGoal - todaySteps).toLocaleString()}보 남음`}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50">
            <span className="text-slate-300">물 2,000ml 마시기</span>
            <span className={todayWaterMl >= profile.waterGoalMl ? 'text-sky-400 font-bold' : 'text-slate-400'}>
              {todayWaterMl >= profile.waterGoalMl ? '완료 💧' : `${profile.waterGoalMl - todayWaterMl}ml 남음`}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50">
            <span className="text-slate-300">충분한 숙면 8시간</span>
            <span className="text-indigo-400 font-bold">
              {sleepRecord.totalMinutes >= profile.sleepGoalHours * 60 ? '달성 🌙' : `${sleepHours}시간 ${sleepMins}분`}
            </span>
          </div>
        </div>
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
