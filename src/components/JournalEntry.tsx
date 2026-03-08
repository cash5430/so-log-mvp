import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { BookOpen, Droplets, Zap, Coffee } from 'lucide-react';

interface JournalEntryProps {
  onEntryCreated: () => void;
}

const STIMULANTS = [
  { id: 'coffee', label: '咖啡', icon: Coffee },
  { id: 'alcohol', label: '酒精', icon: Droplets },
  { id: 'spicy', label: '重口味', icon: Zap },
];

export function JournalEntry({ onEntryCreated }: JournalEntryProps) {
  const { user } = useAuth();
  const [dreamContent, setDreamContent] = useState('');
  const [stressLevel, setStressLevel] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [selectedStimulants, setSelectedStimulants] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const toggleStimulant = (stimulant: string) => {
    setSelectedStimulants((prev) =>
      prev.includes(stimulant)
        ? prev.filter((s) => s !== stimulant)
        : [...prev, stimulant]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setAnalyzing(true);

    try {
      const profile = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      const entryData = {
        user_id: user.id,
        dream_content: dreamContent,
        stress_level: stressLevel,
        energy_level: energyLevel,
        stimulants: selectedStimulants,
        entry_date: new Date().toISOString().split('T')[0],
      };

      const { data: entry, error: insertError } = await supabase
        .from('dream_entries')
        .insert(entryData)
        .select()
        .single();

      if (insertError) throw insertError;

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-dream`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entryId: entry.id,
          dreamContent: dreamContent,
          stressLevel: stressLevel,
          energyLevel: energyLevel,
          stimulants: selectedStimulants,
          profile: profile.data,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      setDreamContent('');
      setStressLevel(5);
      setEnergyLevel(5);
      setSelectedStimulants([]);
      onEntryCreated();
    } catch (err) {
      console.error('Error creating entry:', err);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="backdrop-blur-xl bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-serif text-white">夢境紀錄</h2>
        </div>

        <textarea
          value={dreamContent}
          onChange={(e) => setDreamContent(e.target.value)}
          className="w-full h-64 bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition resize-none"
          placeholder="在此記錄你的夢境片段... 描述你所見、所感、所想。"
          required
        />
      </div>

      <div className="backdrop-blur-xl bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-cyan-900/10 border border-white/10 rounded-3xl p-8 space-y-8">
        <div>
          <label className="block text-lg font-medium text-gray-300 mb-4">壓力指數</label>
          <div className="space-y-3">
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>平靜</span>
              <span className="text-cyan-400 text-xl font-bold">{stressLevel}</span>
              <span>高壓</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-300 mb-4">精力值</label>
          <div className="space-y-3">
            <input
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>疲憊</span>
              <span className="text-purple-400 text-xl font-bold">{energyLevel}</span>
              <span>充沛</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-300 mb-4">今日刺激物</label>
          <div className="flex flex-wrap gap-4">
            {STIMULANTS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => toggleStimulant(id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition ${
                  selectedStimulants.includes(id)
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    : 'bg-black/40 border-white/10 text-gray-400 hover:border-cyan-500/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !dreamContent.trim()}
        className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-medium py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-cyan-500/20"
      >
        {analyzing ? '解析中...' : loading ? '儲存中...' : '提交並解析'}
      </button>
    </form>
  );
}
