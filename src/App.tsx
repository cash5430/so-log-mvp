import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { ProfileSetup } from './components/ProfileSetup';
import { Dashboard } from './components/Dashboard';
import { supabase } from './lib/supabase';

function AppContent() {
  const { user, loading } = useAuth();
  const [profileComplete, setProfileComplete] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    checkProfile();
  }, [user]);

  const checkProfile = async () => {
    if (!user) {
      setCheckingProfile(false);
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('name, birthday, zodiac_sign, blood_type, mbti_type')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      const isComplete = !!(
        data.name &&
        data.birthday &&
        data.zodiac_sign &&
        data.blood_type &&
        data.mbti_type
      );
      setProfileComplete(isComplete);
    }
    setCheckingProfile(false);
  };

  if (loading || checkingProfile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (!profileComplete || showSettings) {
    return (
      <ProfileSetup
        onComplete={() => {
          setProfileComplete(true);
          setShowSettings(false);
        }}
      />
    );
  }

  return <Dashboard onSettings={() => setShowSettings(true)} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
