import React from 'react';
import { ScreenId } from '../types/health';
import { Home, Flame, Moon, User } from 'lucide-react';

interface NavigationProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId, transition?: 'none' | 'push') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  const navItems: { id: ScreenId; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'home',
      label: '홈 대시보드',
      icon: <Home className="w-5 h-5" />,
      color: 'text-emerald-400',
    },
    {
      id: 'activity',
      label: '활동 분석',
      icon: <Flame className="w-5 h-5" />,
      color: 'text-orange-400',
    },
    {
      id: 'sleep',
      label: '수면 리포트',
      icon: <Moon className="w-5 h-5" />,
      color: 'text-indigo-400',
    },
    {
      id: 'profile',
      label: '내 프로필',
      icon: <User className="w-5 h-5" />,
      color: 'text-sky-400',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/80 max-w-md mx-auto shadow-2xl safe-area-bottom">
      <div className="grid grid-cols-4 px-2 py-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-path={item.id}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.id, 'none');
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div
                className={`relative flex items-center justify-center p-1 rounded-lg transition-transform ${
                  isActive ? `${item.color} scale-110` : 'text-slate-400'
                }`}
              >
                {item.icon}
                {isActive && (
                  <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                )}
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'text-white' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};
