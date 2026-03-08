import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Brain, Sparkles } from 'lucide-react';

interface DreamEntry {
  id: string;
  dream_content: string;
  hexagram: string | null;
  tarot_card: string | null;
  analysis: string | null;
  entry_date: string;
  stress_level: number | null;
  energy_level: number | null;
}

export function AnalysisDisplay() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DreamEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;

    setLoading(true);
    const { data } = await supabase
      .from('dream_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })
      .limit(5);

    if (data) {
      setEntries(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-cyan-900/10 border border-white/10 rounded-3xl p-12 text-center">
        <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">尚無夢境紀錄</p>
        <p className="text-sm text-gray-500 mt-2">開始記錄你的第一個夢境</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="backdrop-blur-xl bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-serif text-white">潛意識解析</h3>
            </div>
            <div className="text-sm text-gray-400">
              {new Date(entry.entry_date).toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">夢境片段</h4>
              <p className="text-gray-300 leading-relaxed italic">「{entry.dream_content}」</p>
            </div>

            {(entry.hexagram || entry.tarot_card) && (
              <div className="flex gap-4 py-4 border-y border-white/10">
                {entry.hexagram && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                    <span className="text-cyan-400 text-sm">{entry.hexagram}</span>
                  </div>
                )}
                {entry.tarot_card && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span className="text-purple-400 text-sm">{entry.tarot_card}</span>
                  </div>
                )}
              </div>
            )}

            {entry.analysis ? (
              <div className="bg-black/40 rounded-xl p-6 border border-white/5">
                <p className="text-gray-300 leading-loose whitespace-pre-line">{entry.analysis}</p>
              </div>
            ) : (
              <div className="bg-black/40 rounded-xl p-6 border border-white/5 text-center">
                <p className="text-gray-500">解析處理中...</p>
              </div>
            )}

            {entry.stress_level !== null && entry.energy_level !== null && (
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">壓力</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-4 rounded-sm ${
                          i < entry.stress_level! ? 'bg-red-500' : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">精力</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-4 rounded-sm ${
                          i < entry.energy_level! ? 'bg-green-500' : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
