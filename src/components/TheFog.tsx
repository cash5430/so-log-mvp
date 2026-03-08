import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Sparkles } from 'lucide-react';

export function TheFog() {
  const { user } = useAuth();
  const [entryCounts, setEntryCounts] = useState<boolean[]>(Array(7).fill(false));

  useEffect(() => {
    loadRecentEntries();
  }, [user]);

  const loadRecentEntries = async () => {
    if (!user) return;

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const { data } = await supabase
      .from('dream_entries')
      .select('entry_date')
      .eq('user_id', user.id)
      .gte('entry_date', sevenDaysAgo.toISOString().split('T')[0])
      .lte('entry_date', today.toISOString().split('T')[0]);

    if (data) {
      const dates = new Set(data.map((entry) => entry.entry_date));
      const counts = Array(7).fill(false).map((_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - i));
        return dates.has(date.toISOString().split('T')[0]);
      });
      setEntryCounts(counts);
    }
  };

  const completedDays = entryCounts.filter(Boolean).length;
  const isComplete = completedDays === 7;

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-cyan-900/10 border border-white/10 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-serif text-white">The Fog</h2>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-cyan-400">{completedDays}/7</div>
          <div className="text-xs text-gray-400 tracking-wider">天</div>
        </div>
      </div>

      <div className="relative">
        <div className="flex justify-between items-center gap-3 mb-4">
          {entryCounts.map((completed, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div
                className={`w-full aspect-square rounded-full transition-all duration-500 ${
                  completed
                    ? 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50 animate-pulse'
                    : 'bg-black/40 border border-white/10'
                }`}
              >
                {completed && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {['一', '二', '三', '四', '五', '六', '日'][index]}
              </div>
            </div>
          ))}
        </div>

        <div className="h-1 bg-black/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 transition-all duration-700"
            style={{ width: `${(completedDays / 7) * 100}%` }}
          />
        </div>
      </div>

      {isComplete && (
        <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl text-center">
          <p className="text-cyan-400 font-medium">恭喜完成七日記錄</p>
          <p className="text-sm text-gray-400 mt-1">你的夢境微電影正在生成中...</p>
        </div>
      )}

      {!isComplete && completedDays > 0 && (
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">持續紀錄，解鎖更深層的意識地圖</p>
        </div>
      )}
    </div>
  );
}
