import React from 'react';
import { ScreenId } from '../types/health';
import { useHealth } from '../context/HealthContext';
import { Bell, Watch } from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId, transition?: 'none' | 'push') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate }) => {
  const { profile } = useHealth();

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home':
        return {
          badge: 'LIVE HEALTH',
          title: '홈 대시보드',
          subtitle: `안녕하세요, ${profile.name}님!`,
        };
      case 'activity':
        return {
          badge: 'ACTIVITY REPORT',
          title: '활동 분석',
          subtitle: '오늘의 걸음과 소모 칼로리 기록',
        };
      case 'sleep':
        return {
          badge: 'SLEEP QUALITY',
          title: '수면 리포트',
          subtitle: '어젯밤 수면 주기와 회복 점수',
        };
      case 'profile':
        return {
          badge: 'MY ACCOUNT',
          title: '내 프로필',
          subtitle: '개인 건강 설정 및 기기 연동',
        };
    }
  };

  const info = getScreenTitle();

  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/60 px-4 py-3.5 max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
              {info.badge}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            {info.title}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">{info.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {profile.deviceSynced && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <Watch className="w-3.5 h-3.5 text-emerald-400" />
              <span>동기화됨</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => onNavigate('profile', 'push')}
            className="relative p-0.5 rounded-full ring-2 ring-emerald-500/50 hover:ring-emerald-400 transition-all cursor-pointer group active:scale-95"
            aria-label="내 프로필 이동"
            title="내 프로필 이동"
          >
            <img
              src={profile.avatarUrl}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover group-hover:brightness-110 transition-all"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </button>
        </div>
      </div>
    </header>
  );
};
