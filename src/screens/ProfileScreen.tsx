import React, { useState } from 'react';
import { ScreenId } from '../types/health';
import { useHealth } from '../context/HealthContext';
import {
  User,
  Settings,
  Target,
  Watch,
  Award,
  Bell,
  RefreshCw,
  Check,
  Edit2,
  Scale,
  Ruler,
  Calendar,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface ProfileScreenProps {
  onNavigate: (screen: ScreenId, transition?: 'none' | 'push') => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const { profile, updateProfile, syncDevice, triggerCelebration } = useHealth();

  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [stepGoalInput, setStepGoalInput] = useState(profile.stepGoal);
  const [calorieGoalInput, setCalorieGoalInput] = useState(profile.calorieGoal);
  const [sleepGoalInput, setSleepGoalInput] = useState(profile.sleepGoalHours);
  const [waterGoalInput, setWaterGoalInput] = useState(profile.waterGoalMl);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState(false);

  // BMI Calculation: weight / (height / 100)^2
  const heightM = profile.height / 100;
  const bmi = parseFloat((profile.weight / (heightM * heightM)).toFixed(1));
  const getBmiStatus = (val: number) => {
    if (val < 18.5) return { text: '저체중', color: 'text-sky-400' };
    if (val < 23) return { text: '정상 체중', color: 'text-emerald-400' };
    if (val < 25) return { text: '과체중', color: 'text-amber-400' };
    return { text: '비만', color: 'text-rose-400' };
  };
  const bmiStatus = getBmiStatus(bmi);

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      stepGoal: Number(stepGoalInput),
      calorieGoal: Number(calorieGoalInput),
      sleepGoalHours: Number(sleepGoalInput),
      waterGoalMl: Number(waterGoalInput),
    });
    setIsEditingGoals(false);
    triggerCelebration();
  };

  const handleSyncClick = () => {
    setIsSyncing(true);
    setTimeout(() => {
      syncDevice();
      setIsSyncing(false);
      setSyncSuccessMessage(true);
      setTimeout(() => setSyncSuccessMessage(false), 3000);
    }, 800);
  };

  const achievements = [
    { title: '1만보 마스터', desc: '주 5회 이상 만보 달성', icon: '🏆', completed: true, color: 'bg-emerald-500/20 text-emerald-300' },
    { title: '수면 수호자', desc: '평균 수면 점수 85점 이상', icon: '🌙', completed: true, color: 'bg-indigo-500/20 text-indigo-300' },
    { title: '수분 풀충전', desc: '일일 물 2,000ml 달성', icon: '💧', completed: true, color: 'bg-sky-500/20 text-sky-300' },
    { title: '칼로리 킬러', desc: '일일 700kcal 이상 소모', icon: '🔥', completed: false, color: 'bg-orange-500/20 text-orange-300' },
  ];

  return (
    <div className="pb-24 px-4 pt-2 max-w-md mx-auto space-y-4">
      {/* Profile Header Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={profile.avatarUrl}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-500/40 shadow-lg"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white">{profile.name} 님</h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                PRO 회원
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              만 {profile.age}세 • {profile.gender === 'female' ? '여성' : '남성'}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile.height} cm</span>
              </div>
              <div className="flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile.weight} kg</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">BMI:</span>
                <span className={`font-bold ${bmiStatus.color}`}>
                  {bmi} ({bmiStatus.text})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target Goals Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">나의 일일 건강 목표</h3>
          </div>
          <button
            onClick={() => setIsEditingGoals(!isEditingGoals)}
            className="py-1 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isEditingGoals ? '취소' : '목표 수정'}</span>
          </button>
        </div>

        {isEditingGoals ? (
          <form onSubmit={handleSaveGoals} className="space-y-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                일일 걸음수 목표 (보)
              </label>
              <input
                type="number"
                step="500"
                value={stepGoalInput}
                onChange={(e) => setStepGoalInput(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                일일 소모 칼로리 목표 (kcal)
              </label>
              <input
                type="number"
                step="50"
                value={calorieGoalInput}
                onChange={(e) => setCalorieGoalInput(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-orange-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  수면 목표 (시간)
                </label>
                <input
                  type="number"
                  min="5"
                  max="12"
                  value={sleepGoalInput}
                  onChange={(e) => setSleepGoalInput(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  수분 섭취 (ml)
                </label>
                <input
                  type="number"
                  step="250"
                  value={waterGoalInput}
                  onChange={(e) => setWaterGoalInput(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>목표 저장 및 적용</span>
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block mb-0.5">걸음수 목표</span>
              <span className="text-base font-bold text-white">
                {profile.stepGoal.toLocaleString()} <span className="text-xs font-normal text-emerald-400">보</span>
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block mb-0.5">칼로리 목표</span>
              <span className="text-base font-bold text-white">
                {profile.calorieGoal.toLocaleString()} <span className="text-xs font-normal text-orange-400">kcal</span>
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block mb-0.5">권장 수면</span>
              <span className="text-base font-bold text-white">
                {profile.sleepGoalHours} <span className="text-xs font-normal text-indigo-400">시간</span>
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block mb-0.5">수분 섭취</span>
              <span className="text-base font-bold text-white">
                {(profile.waterGoalMl / 1000).toFixed(1)} <span className="text-xs font-normal text-sky-400">L</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Connected Device Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Watch className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-white">연동된 스마트 기기</h3>
              <p className="text-[11px] text-slate-400">{profile.deviceName}</p>
            </div>
          </div>
          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? '동기화 중...' : '지금 동기화'}</span>
          </button>
        </div>

        {syncSuccessMessage && (
          <div className="p-2 mb-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-[11px] text-emerald-300 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>최신 건강 센서 데이터가 성공적으로 동기화되었습니다!</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>마지막 동기화 시간</span>
          <span className="font-medium text-slate-300">{profile.lastSyncedTime}</span>
        </div>
      </div>

      {/* Badges / Achievements */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">획득한 건강 배지</h3>
          </div>
          <span className="text-xs text-amber-400 font-bold">3개 완료</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {achievements.map((ach) => (
            <div
              key={ach.title}
              className={`p-3 rounded-2xl border transition-all ${
                ach.completed
                  ? 'bg-slate-800/60 border-slate-700/80'
                  : 'bg-slate-850/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{ach.icon}</span>
                <span className="text-xs font-bold text-white">{ach.title}</span>
              </div>
              <p className="text-[10px] text-slate-400">{ach.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Jump Buttons to other screens */}
      <div className="space-y-2 pt-1">
        <button
          onClick={() => onNavigate('home', 'none')}
          className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-xs font-bold text-slate-300 flex items-center justify-between cursor-pointer transition-colors"
        >
          <span>홈 대시보드로 돌아가기</span>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
};
