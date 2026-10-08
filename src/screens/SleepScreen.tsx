import React, { useState } from 'react';
import { ScreenId } from '../types/health';
import { useHealth } from '../context/HealthContext';
import {
  Moon,
  Sparkles,
  Clock,
  Heart,
  Wind,
  ShieldCheck,
  Edit3,
  Volume2,
  VolumeX,
  Check,
  ChevronRight,
  Smile,
} from 'lucide-react';

interface SleepScreenProps {
  onNavigate: (screen: ScreenId, transition?: 'none' | 'push') => void;
}

export const SleepScreen: React.FC<SleepScreenProps> = () => {
  const { sleepRecord, weeklySleep, profile, updateSleep } = useHealth();

  const [isEditingTime, setIsEditingTime] = useState(false);
  const [bedTimeInput, setBedTimeInput] = useState(sleepRecord.bedTime);
  const [wakeTimeInput, setWakeTimeInput] = useState(sleepRecord.wakeTime);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [selectedSound, setSelectedSound] = useState<'rain' | 'forest' | 'waves'>('rain');

  const sleepHours = Math.floor(sleepRecord.totalMinutes / 60);
  const sleepMins = sleepRecord.totalMinutes % 60;
  const targetMinutes = profile.sleepGoalHours * 60 + profile.sleepGoalMinutes;
  const progressPercent = Math.min(100, Math.round((sleepRecord.totalMinutes / targetMinutes) * 100));

  const handleSaveTimes = (e: React.FormEvent) => {
    e.preventDefault();
    updateSleep(bedTimeInput, wakeTimeInput);
    setIsEditingTime(false);
  };

  return (
    <div className="pb-24 px-4 pt-2 max-w-md mx-auto space-y-4">
      {/* Sleep Hero Score Card */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Moon className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">어젯밤 수면 리포트</h2>
              <p className="text-xs text-slate-400">{sleepRecord.date}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditingTime(!isEditingTime)}
            className="py-1 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isEditingTime ? '닫기' : '기록 수정'}</span>
          </button>
        </div>

        {/* Time Editor Inline */}
        {isEditingTime && (
          <form
            onSubmit={handleSaveTimes}
            className="mb-4 p-3.5 rounded-2xl bg-slate-800/80 border border-indigo-500/40 space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                  취침 시간
                </label>
                <input
                  type="time"
                  value={bedTimeInput}
                  onChange={(e) => setBedTimeInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                  기상 시간
                </label>
                <input
                  type="time"
                  value={wakeTimeInput}
                  onChange={(e) => setWakeTimeInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>수면 시간 저장 & 분석 갱신</span>
            </button>
          </form>
        )}

        <div className="flex items-center justify-between py-2">
          <div>
            <span className="text-xs text-slate-400 block mb-1">총 수면 시간</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white">
                {sleepHours}시간 {sleepMins}분
              </span>
            </div>
            <p className="text-xs text-indigo-300 mt-1">
              목표 {profile.sleepGoalHours}시간 대비 {progressPercent}% 달성
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block mb-1">수면 회복 점수</span>
            <div className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/40">
              <span className="text-2xl font-black text-indigo-300">{sleepRecord.qualityScore}</span>
              <span className="text-xs text-indigo-400 ml-0.5">점</span>
            </div>
            <span className="text-[11px] text-emerald-400 block mt-1 font-semibold">
              매우 우수한 회복도
            </span>
          </div>
        </div>

        {/* Schedule interval */}
        <div className="mt-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-300">
              취침 <strong className="text-white">{sleepRecord.bedTime}</strong> → 기상{' '}
              <strong className="text-white">{sleepRecord.wakeTime}</strong>
            </span>
          </div>
          <span className="text-slate-400">수면 효율 {sleepRecord.efficiency}%</span>
        </div>
      </div>

      {/* Sleep Stages Detailed Breakdown */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-white">수면 단계별 상세 분석</h3>
          </div>
          <span className="text-xs text-slate-400">총 4개 주기 순환</span>
        </div>

        {/* Visual Stage Bar */}
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
          {sleepRecord.stages.map((stg) => (
            <div
              key={stg.name}
              style={{ width: `${stg.percentage}%`, backgroundColor: stg.color }}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
            />
          ))}
        </div>

        {/* Stage List */}
        <div className="grid grid-cols-2 gap-2.5">
          {sleepRecord.stages.map((stg) => {
            const hours = Math.floor(stg.durationMinutes / 60);
            const mins = stg.durationMinutes % 60;
            return (
              <div
                key={stg.name}
                className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: stg.color }}
                  />
                  <span className="text-xs font-bold text-slate-200">{stg.name}</span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-sm font-black text-white">
                    {hours > 0 ? `${hours}시간 ` : ''}{mins}분
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{stg.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-400 bg-slate-800/30 p-2.5 rounded-xl border border-slate-800">
          💡 깊은 수면(25%)과 렘 수면(24%)의 비율이 이상적 권장 수치(각각 20% 이상)를 모두 충족하여 뇌와 신체의 피로가 효과적으로 해소되었습니다.
        </p>
      </div>

      {/* Vital Sleep Metrics: Heart Rate & Respiration */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold mb-1">
            <Heart className="w-4 h-4" />
            <span>수면 중 심박수</span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl font-black text-white">{sleepRecord.restingHeartRate}</span>
            <span className="text-xs text-slate-400">bpm</span>
          </div>
          <span className="text-[11px] text-emerald-400">안정적 저심박 유지</span>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold mb-1">
            <Wind className="w-4 h-4" />
            <span>수면 호흡수</span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl font-black text-white">{sleepRecord.respiratoryRate}</span>
            <span className="text-xs text-slate-400">회/분</span>
          </div>
          <span className="text-[11px] text-emerald-400">무호흡 이상 없음</span>
        </div>
      </div>

      {/* Weekly Sleep Consistency Trend */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>주간 수면 규칙성</span>
          </h3>
          <span className="text-xs text-slate-400">평균 7.3시간</span>
        </div>

        <div className="h-32 flex items-end justify-between gap-2 pt-4 pb-1">
          {weeklySleep.map((day) => {
            const heightPercent = Math.min(100, Math.round((day.hours / 9) * 100));
            const isGood = day.hours >= 7.0;
            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[24px] rounded-t-lg transition-all ${
                    isGood
                      ? 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                      : 'bg-slate-700'
                  }`}
                  title={`${day.hours}시간 (${day.score}점)`}
                />
                <span className="text-[10px] text-slate-400">{day.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sleep Ambient Sound Tool */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400">
              {isPlayingSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </span>
            <div>
              <h3 className="font-bold text-sm text-white">숙면 앰비언트 사운드</h3>
              <p className="text-[11px] text-slate-400">빠른 입면을 돕는 백색소음 시뮬레이터</p>
            </div>
          </div>
          <button
            onClick={() => setIsPlayingSound(!isPlayingSound)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isPlayingSound
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-900/50'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isPlayingSound ? '정지 ⏹' : '재생 ▶'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'rain', label: '🌧 따뜻한 빗소리' },
            { id: 'forest', label: '🌲 고요한 숲' },
            { id: 'waves', label: '🌊 밤바다 파도' },
          ].map((snd) => (
            <button
              key={snd.id}
              onClick={() => {
                setSelectedSound(snd.id as any);
                setIsPlayingSound(true);
              }}
              className={`py-2 px-1 text-[11px] rounded-xl border text-center transition-colors cursor-pointer ${
                selectedSound === snd.id
                  ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300 font-bold'
                  : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white'
              }`}
            >
              {snd.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
