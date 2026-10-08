import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserProfile, HourlyData, DayActivity, WorkoutLog, SleepRecord } from '../types/health';

interface HealthContextType {
  profile: UserProfile;
  todaySteps: number;
  todayCalories: number;
  todayDistanceKm: number;
  todayActiveMinutes: number;
  todayWaterMl: number;
  currentHeartRate: number;
  hourlyData: HourlyData[];
  weeklyActivity: DayActivity[];
  workouts: WorkoutLog[];
  sleepRecord: SleepRecord;
  weeklySleep: { day: string; hours: number; score: number }[];
  addSteps: (amount: number) => void;
  addWater: (amountMl: number) => void;
  resetWater: () => void;
  addWorkout: (type: string, durationMinutes: number, calories: number, heartRate: number) => void;
  updateSleep: (bedTime: string, wakeTime: string) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  syncDevice: () => void;
  triggerCelebration: () => void;
}

const defaultProfile: UserProfile = {
  name: '민서',
  age: 28,
  gender: 'female',
  height: 167,
  weight: 54,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  stepGoal: 10000,
  calorieGoal: 650,
  sleepGoalHours: 8,
  sleepGoalMinutes: 0,
  waterGoalMl: 2000,
  deviceSynced: true,
  deviceName: 'Galaxy Watch 6 Pro',
  lastSyncedTime: '방금 전',
};

const defaultHourly: HourlyData[] = [
  { hour: '07:00', steps: 420, calories: 35 },
  { hour: '09:00', steps: 1650, calories: 110 },
  { hour: '11:00', steps: 940, calories: 65 },
  { hour: '13:00', steps: 1820, calories: 125 },
  { hour: '15:00', steps: 1120, calories: 80 },
  { hour: '17:00', steps: 1470, calories: 95 },
  { hour: '19:00', steps: 1000, calories: 70 },
];

const defaultWeekly: DayActivity[] = [
  { day: '월', dateStr: '10.02', steps: 9820, calories: 620, distanceKm: 6.8 },
  { day: '화', dateStr: '10.03', steps: 11450, calories: 710, distanceKm: 8.1 },
  { day: '수', dateStr: '10.04', steps: 8300, calories: 540, distanceKm: 5.7 },
  { day: '목', dateStr: '10.05', steps: 10240, calories: 660, distanceKm: 7.2 },
  { day: '금', dateStr: '10.06', steps: 12150, calories: 780, distanceKm: 8.6 },
  { day: '토', dateStr: '10.07', steps: 8420, calories: 575, distanceKm: 5.9 },
  { day: '일', dateStr: '10.08', steps: 0, calories: 0, distanceKm: 0 },
];

const defaultWorkouts: WorkoutLog[] = [
  {
    id: 'w-1',
    type: '아침 조깅',
    icon: '🏃‍♀️',
    durationMinutes: 32,
    caloriesBurned: 245,
    timestamp: '오전 07:40',
    heartRateAvg: 142,
  },
  {
    id: 'w-2',
    type: '퇴근길 파워워킹',
    icon: '🚶‍♀️',
    durationMinutes: 25,
    caloriesBurned: 130,
    timestamp: '오후 18:15',
    heartRateAvg: 118,
  },
];

const defaultSleep: SleepRecord = {
  date: '어젯밤 (10월 6일 ~ 7일)',
  bedTime: '23:42',
  wakeTime: '07:06',
  totalMinutes: 444, // 7시간 24분
  qualityScore: 88,
  restingHeartRate: 58,
  respiratoryRate: 14.5,
  efficiency: 92,
  stages: [
    { name: '깊은 수면', durationMinutes: 110, percentage: 25, color: '#38bdf8' },
    { name: '렘 수면', durationMinutes: 105, percentage: 24, color: '#a855f7' },
    { name: '얕은 수면', durationMinutes: 195, percentage: 44, color: '#6366f1' },
    { name: '수면 중 깸', durationMinutes: 34, percentage: 7, color: '#f43f5e' },
  ],
};

const defaultWeeklySleep = [
  { day: '월', hours: 7.2, score: 84 },
  { day: '화', hours: 7.8, score: 91 },
  { day: '수', hours: 6.5, score: 76 },
  { day: '목', hours: 7.4, score: 86 },
  { day: '금', hours: 8.1, score: 93 },
  { day: '토', hours: 7.4, score: 88 },
  { day: '일', hours: 7.0, score: 82 },
];

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('vitalfit_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [todaySteps, setTodaySteps] = useState<number>(() => {
    const saved = localStorage.getItem('vitalfit_steps');
    return saved ? parseInt(saved, 10) : 8420;
  });

  const [todayCalories, setTodayCalories] = useState<number>(() => {
    const saved = localStorage.getItem('vitalfit_calories');
    return saved ? parseInt(saved, 10) : 575;
  });

  const [todayWaterMl, setTodayWaterMl] = useState<number>(() => {
    const saved = localStorage.getItem('vitalfit_water');
    return saved ? parseInt(saved, 10) : 1500;
  });

  const [hourlyData, setHourlyData] = useState<HourlyData[]>(defaultHourly);
  const [weeklyActivity, setWeeklyActivity] = useState<DayActivity[]>(defaultWeekly);
  const [workouts, setWorkouts] = useState<WorkoutLog[]>(defaultWorkouts);
  const [sleepRecord, setSleepRecord] = useState<SleepRecord>(defaultSleep);
  const [weeklySleep] = useState(defaultWeeklySleep);
  const [currentHeartRate, setCurrentHeartRate] = useState<number>(72);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('vitalfit_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('vitalfit_steps', todaySteps.toString());
  }, [todaySteps]);

  useEffect(() => {
    localStorage.setItem('vitalfit_calories', todayCalories.toString());
  }, [todayCalories]);

  useEffect(() => {
    localStorage.setItem('vitalfit_water', todayWaterMl.toString());
  }, [todayWaterMl]);

  // Subtle realistic heart rate fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeartRate((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next >= 66 && next <= 84 ? next : 72;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#38bdf8', '#f59e0b', '#ec4899'],
      });
    } catch {
      // ignore
    }
  };

  const addSteps = (amount: number) => {
    setTodaySteps((prev) => {
      const next = prev + amount;
      if (prev < profile.stepGoal && next >= profile.stepGoal) {
        triggerCelebration();
      }
      return next;
    });

    // Approximate calories per step: ~0.045 kcal
    const addedCal = Math.round(amount * 0.045);
    setTodayCalories((prev) => prev + addedCal);

    // Update hourly
    setHourlyData((prev) => {
      const now = new Date();
      const currentHourStr = `${String(now.getHours()).padStart(2, '0')}:00`;
      const copy = [...prev];
      const existing = copy.find((h) => h.hour === currentHourStr);
      if (existing) {
        existing.steps += amount;
        existing.calories += addedCal;
      } else {
        copy.push({ hour: currentHourStr, steps: amount, calories: addedCal });
      }
      return copy;
    });
  };

  const addWater = (amountMl: number) => {
    setTodayWaterMl((prev) => {
      const next = Math.max(0, prev + amountMl);
      if (prev < profile.waterGoalMl && next >= profile.waterGoalMl) {
        triggerCelebration();
      }
      return next;
    });
  };

  const resetWater = () => {
    setTodayWaterMl(0);
  };

  const addWorkout = (type: string, durationMinutes: number, calories: number, heartRate: number) => {
    let icon = '🏃';
    if (type.includes('사이클') || type.includes('자전거')) icon = '🚴';
    if (type.includes('웨이트') || type.includes('헬스')) icon = '🏋️';
    if (type.includes('수영')) icon = '🏊';
    if (type.includes('필라테스') || type.includes('요가')) icon = '🧘';
    if (type.includes('걷기') || type.includes('워킹')) icon = '🚶';

    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const period = hours < 12 ? '오전' : '오후';
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    const timeStr = `${period} ${displayHour}:${minutes}`;

    const newLog: WorkoutLog = {
      id: `w-${Date.now()}`,
      type,
      icon,
      durationMinutes,
      caloriesBurned: calories,
      timestamp: timeStr,
      heartRateAvg: heartRate,
    };

    setWorkouts((prev) => [newLog, ...prev]);
    setTodayCalories((prev) => prev + calories);
    
    // Add estimated steps for walking/running
    if (type.includes('러닝') || type.includes('조깅')) {
      addSteps(Math.round(durationMinutes * 140));
    } else if (type.includes('걷기') || type.includes('워킹')) {
      addSteps(Math.round(durationMinutes * 100));
    }
    triggerCelebration();
  };

  const updateSleep = (bedTime: string, wakeTime: string) => {
    // calculate minutes
    const [bH, bM] = bedTime.split(':').map(Number);
    const [wH, wM] = wakeTime.split(':').map(Number);
    let startMin = bH * 60 + bM;
    let endMin = wH * 60 + wM;
    if (endMin < startMin) {
      endMin += 24 * 60; // crossed midnight
    }
    const diffMin = endMin - startMin;
    const deepMin = Math.round(diffMin * 0.24);
    const remMin = Math.round(diffMin * 0.23);
    const lightMin = Math.round(diffMin * 0.46);
    const awakeMin = Math.max(10, diffMin - (deepMin + remMin + lightMin));

    const targetMinutes = profile.sleepGoalHours * 60 + profile.sleepGoalMinutes;
    const ratio = Math.min(1.2, diffMin / (targetMinutes || 480));
    const score = Math.min(99, Math.round(75 + ratio * 20));

    setSleepRecord({
      date: '어젯밤 (수동 조정)',
      bedTime,
      wakeTime,
      totalMinutes: diffMin,
      qualityScore: score,
      restingHeartRate: 60,
      respiratoryRate: 14.8,
      efficiency: 91,
      stages: [
        { name: '깊은 수면', durationMinutes: deepMin, percentage: 24, color: '#38bdf8' },
        { name: '렘 수면', durationMinutes: remMin, percentage: 23, color: '#a855f7' },
        { name: '얕은 수면', durationMinutes: lightMin, percentage: 46, color: '#6366f1' },
        { name: '수면 중 깸', durationMinutes: awakeMin, percentage: 7, color: '#f43f5e' },
      ],
    });
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const syncDevice = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} 동기화 완료`;
    setProfile((prev) => ({
      ...prev,
      deviceSynced: true,
      lastSyncedTime: timeStr,
    }));
  };

  const todayDistanceKm = parseFloat((todaySteps * 0.00072).toFixed(2));
  const todayActiveMinutes = Math.round(todaySteps / 110) + workouts.reduce((acc, w) => acc + w.durationMinutes, 0);

  return (
    <HealthContext.Provider
      value={{
        profile,
        todaySteps,
        todayCalories,
        todayDistanceKm,
        todayActiveMinutes,
        todayWaterMl,
        currentHeartRate,
        hourlyData,
        weeklyActivity,
        workouts,
        sleepRecord,
        weeklySleep,
        addSteps,
        addWater,
        resetWater,
        addWorkout,
        updateSleep,
        updateProfile,
        syncDevice,
        triggerCelebration,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
