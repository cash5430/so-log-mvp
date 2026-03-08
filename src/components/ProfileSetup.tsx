import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Calendar, Heart, Brain } from 'lucide-react';

interface Profile {
  name: string;
  birthday: string;
  zodiac_sign: string;
  blood_type: string;
  mbti_type: string;
}

const ZODIAC_SIGNS = ['牡羊座', '金牛座', '雙子座', '巨蟹座', '獅子座', '處女座', '天秤座', '天蠍座', '射手座', '摩羯座', '水瓶座', '雙魚座'];
const BLOOD_TYPES = ['A', 'B', 'O', 'AB'];
const MBTI_TYPES = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];

interface ProfileSetupProps {
  onComplete: () => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    name: '',
    birthday: '',
    zodiac_sign: '',
    blood_type: '',
    mbti_type: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setProfile({
        name: data.name || '',
        birthday: data.birthday || '',
        zodiac_sign: data.zodiac_sign || '',
        blood_type: data.blood_type || '',
        mbti_type: data.mbti_type || '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);

      if (error) throw error;
      onComplete();
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-white mb-4">個人化設定</h1>
          <p className="text-gray-400 tracking-wide">建立你的潛意識檔案</p>
        </div>

        <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 border border-white/10 rounded-3xl p-10 shadow-2xl space-y-8">

          <div className="space-y-6">
            <div className="flex items-center gap-3 text-cyan-400 mb-4">
              <User className="w-5 h-5" />
              <h2 className="text-xl font-medium">基本資料</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">姓名</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition"
                placeholder="你的名字"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">生日</label>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <input
                  type="date"
                  value={profile.birthday}
                  onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 text-purple-400 mb-4">
              <Heart className="w-5 h-5" />
              <h2 className="text-xl font-medium">西方玄學屬性</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">星座</label>
                <select
                  value={profile.zodiac_sign}
                  onChange={(e) => setProfile({ ...profile, zodiac_sign: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
                  required
                >
                  <option value="">選擇星座</option>
                  {ZODIAC_SIGNS.map((sign) => (
                    <option key={sign} value={sign}>{sign}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">血型</label>
                <select
                  value={profile.blood_type}
                  onChange={(e) => setProfile({ ...profile, blood_type: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
                  required
                >
                  <option value="">選擇血型</option>
                  {BLOOD_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 text-blue-400 mb-4">
              <Brain className="w-5 h-5" />
              <h2 className="text-xl font-medium">性格類型</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">MBTI 人格</label>
              <select
                value={profile.mbti_type}
                onChange={(e) => setProfile({ ...profile, mbti_type: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                required
              >
                <option value="">選擇 MBTI</option>
                {MBTI_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-medium py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-cyan-500/20"
          >
            {loading ? '儲存中...' : '完成設定'}
          </button>
        </form>
      </div>
    </div>
  );
}
