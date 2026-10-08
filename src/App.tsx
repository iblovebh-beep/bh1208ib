/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenId } from './types/health';
import { HealthProvider } from './context/HealthContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeScreen } from './screens/HomeScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { SleepScreen } from './screens/SleepScreen';
import { ProfileScreen } from './screens/ProfileScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [transitionMode, setTransitionMode] = useState<'none' | 'push'>('none');

  const handleNavigate = (nextScreen: ScreenId, transition: 'none' | 'push' = 'none') => {
    if (nextScreen === currentScreen) return;
    setTransitionMode(transition);
    setCurrentScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <HealthProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
        {/* Top Header with Profile quick link button */}
        <Header currentScreen={currentScreen} onNavigate={handleNavigate} />

        {/* Main Content Area */}
        <main
          key={currentScreen}
          className={`flex-1 w-full max-w-md mx-auto ${
            transitionMode === 'push' ? 'animate-slide-push' : ''
          }`}
        >
          {currentScreen === 'home' && <HomeScreen onNavigate={handleNavigate} />}
          {currentScreen === 'activity' && <ActivityScreen onNavigate={handleNavigate} />}
          {currentScreen === 'sleep' && <SleepScreen onNavigate={handleNavigate} />}
          {currentScreen === 'profile' && <ProfileScreen onNavigate={handleNavigate} />}
        </main>

        {/* Persistent Bottom Nav Bar */}
        <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} />
      </div>
    </HealthProvider>
  );
}
