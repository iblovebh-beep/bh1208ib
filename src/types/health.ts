export type ScreenId = 'home' | 'activity' | 'sleep' | 'profile';

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  avatarUrl: string;
  stepGoal: number;
  calorieGoal: number;
  sleepGoalHours: number;
  sleepGoalMinutes: number;
  waterGoalMl: number;
  deviceSynced: boolean;
  deviceName: string;
  lastSyncedTime: string;
}

export interface HourlyData {
  hour: string; // e.g. "09시"
  steps: number;
  calories: number;
}

export interface DayActivity {
  day: string; // e.g. "월", "화"
  dateStr: string;
  steps: number;
  calories: number;
  distanceKm: number;
}

export interface WorkoutLog {
  id: string;
  type: string; // '러닝' | '사이클' | '웨이트' | '수영' | '필라테스' | '빠른 걷기'
  icon: string;
  durationMinutes: number;
  caloriesBurned: number;
  timestamp: string;
  heartRateAvg: number;
}

export interface SleepStage {
  name: '깊은 수면' | '렘 수면' | '얕은 수면' | '수면 중 깸';
  durationMinutes: number;
  percentage: number;
  color: string;
}

export interface SleepRecord {
  date: string;
  bedTime: string; // "23:42"
  wakeTime: string; // "07:06"
  totalMinutes: number;
  qualityScore: number;
  stages: SleepStage[];
  restingHeartRate: number;
  respiratoryRate: number; // 14.2회/분
  efficiency: number; // 92%
}
