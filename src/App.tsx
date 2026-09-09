import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/onboarding/SplashScreen';
import { Onboarding } from './components/onboarding/Onboarding';
import { Navigation } from './components/navigation/Navigation';
import { HomeDashboard } from './components/home/HomeDashboard';
import { MoneyManagerView } from './components/money/MoneyManagerView';
import { LostAndFoundView } from './components/lostfound/LostAndFoundView';
import { StudentVerification } from './components/auth/StudentVerification';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProfileView } from './components/profile/ProfileView';
import { PWAInstallPrompt } from './components/pwa/PWAInstallPrompt';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

const MainContent: React.FC = () => {
  const { splashDone, hasSeenOnboarding, activeTab } = useApp();

  // 1. Show Splash Screen first
  if (!splashDone) {
    return <SplashScreen />;
  }

  // 2. Show 3-page Onboarding if first-time user
  if (!hasSeenOnboarding) {
    return <Onboarding />;
  }

  // 3. Render Current View inside Responsive Navigation
  return (
    <Navigation>
      <OfflineIndicator />
      {activeTab === 'home' && <HomeDashboard />}
      {activeTab === 'money' && <MoneyManagerView />}
      {(activeTab === 'lost-found' || activeTab === 'lostfound') && <LostAndFoundView />}
      {(activeTab === 'verify' || activeTab === 'verification') && <StudentVerification />}
      {activeTab === 'admin' && <AdminDashboard />}
      {activeTab === 'profile' && <ProfileView />}
      <PWAInstallPrompt />
    </Navigation>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
