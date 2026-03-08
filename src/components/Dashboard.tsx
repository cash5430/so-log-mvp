import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { JournalEntry } from './JournalEntry';
import { AnalysisDisplay } from './AnalysisDisplay';
import { TheFog } from './TheFog';
import { Sparkles, LogOut, Settings, BookOpen, Brain } from 'lucide-react';

interface DashboardProps {
  onSettings: () => void;
}

export function Dashboard({ onSettings }: DashboardProps) {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'journal' | 'analysis'>('journal');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEntryCreated = () => {
    setRefreshKey((prev) => prev + 1);
    setActiveTab('analysis');
  };

  return (
    <div className="min-h-screen bg-black">
      <nav className="backdrop-blur-xl bg-black/80 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-cyan-400" />
              <h1 className="text-3xl font-serif text-white">SO: Log</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onSettings}
                className="p-2 hover:bg-white/5 rounded-lg transition"
                title="個人設定"
              >
                <Settings className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
              <button
                onClick={() => signOut()}
                className="p-2 hover:bg-white/5 rounded-lg transition"
                title="登出"
              >
                <LogOut className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <TheFog key={refreshKey} />
        </div>

        <div className="mb-8">
          <div className="flex gap-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-2 w-fit">
            <button
              onClick={() => setActiveTab('journal')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${
                activeTab === 'journal'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">記錄</span>
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${
                activeTab === 'analysis'
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Brain className="w-5 h-5" />
              <span className="font-medium">解析</span>
            </button>
          </div>
        </div>

        <div>
          {activeTab === 'journal' ? (
            <JournalEntry onEntryCreated={handleEntryCreated} />
          ) : (
            <AnalysisDisplay key={refreshKey} />
          )}
        </div>
      </div>

      <footer className="border-t border-white/10 mt-24">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p className="mb-2">SIGN OUT 宇宙生態系</p>
            <p className="text-xs">潛意識的映照之境</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
