
import React, { useState, useEffect } from 'react';
import { FlashScan } from './components/FlashScan';
import { DistributionDrill } from './components/DistributionDrill';
import { ChecksumChallenge } from './components/ChecksumChallenge';
import { UserProfile, UserRank, ModuleType } from './types';
import { getAIRecommendation } from './services/geminiService';

const STORAGE_KEY = 'mental_matrix_profile';

const INITIAL_PROFILE: UserProfile = {
  id: 'user-1',
  pseudo: 'GrandMaster-X',
  rank: UserRank.ADEPTE,
  xp: 1250,
  stats: {
    sessionsTotal: 0,
    trainingTime: 0,
    successRate: 0,
    bootTime: 5.0,
    flashScan: { attempts: 0, successes: 0, bestTime: 5.0 },
    distribution: { attempts: 0, successes: 0 },
    checksum: { attempts: 0, successes: 0 }
  },
  recommendation: 'Analysez vos statistiques pour recevoir une recommandation personnalisée.'
};

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>('DASHBOARD');
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [isUpdatingAI, setIsUpdatingAI] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }
  }, []);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const updateStats = (module: ModuleType, success: boolean, time?: number) => {
    setProfile(prev => {
      const next = { ...prev };
      next.stats.sessionsTotal += 1;
      
      if (module === 'FLASH_SCAN') {
        next.stats.flashScan.attempts += 1;
        if (success) {
          next.stats.flashScan.successes += 1;
          if (time && time < next.stats.flashScan.bestTime) {
            next.stats.flashScan.bestTime = time;
            next.stats.bootTime = time;
          }
          next.xp += 25;
        }
      } else if (module === 'DISTRIBUTION') {
        next.stats.distribution.attempts += 1;
        if (success) {
          next.stats.distribution.successes += 1;
          next.xp += 40;
        }
      } else if (module === 'CHECKSUM') {
        next.stats.checksum.attempts += 1;
        if (success) {
          next.stats.checksum.successes += 1;
          next.xp += 20;
        }
      }

      // Update success rate
      const totalAttempts = next.stats.flashScan.attempts + next.stats.distribution.attempts + next.stats.checksum.attempts;
      const totalSuccess = next.stats.flashScan.successes + next.stats.distribution.successes + next.stats.checksum.successes;
      next.stats.successRate = totalAttempts > 0 ? Number(((totalSuccess / totalAttempts) * 100).toFixed(1)) : 0;

      // Update Rank based on XP
      if (next.xp > 5000) next.rank = UserRank.MAITRE;
      else if (next.xp > 2500) next.rank = UserRank.EXPERT;
      else if (next.xp > 1000) next.rank = UserRank.ADEPTE;
      else if (next.xp > 300) next.rank = UserRank.APPRENTI;

      return next;
    });
  };

  const handleAIAdvice = async () => {
    setIsUpdatingAI(true);
    const advice = await getAIRecommendation(profile);
    setProfile(prev => ({ ...prev, recommendation: advice }));
    setIsUpdatingAI(false);
  };

  const navItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: '📊' },
    { id: 'FLASH_SCAN', label: 'Flash', icon: '📸' },
    { id: 'DISTRIBUTION', label: 'Semis', icon: '🔄' },
    { id: 'CHECKSUM', label: 'Check', icon: '🎯' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 pb-24 md:p-8 md:pb-8 flex flex-col">
      {/* Header - Desktop & Tablet */}
      <header className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg shadow-blue-500/20">
            🧠
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white">Mental Matrix</h1>
            <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-widest">Awalé Visualization</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-1 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as ModuleType)}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 ${activeModule === item.id ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-3 bg-slate-900 px-4 py-2 md:px-6 md:py-3 rounded-2xl border border-slate-800 shadow-xl">
           <div className="text-right">
             <p className="text-[10px] text-slate-500 font-bold uppercase">{profile.rank}</p>
             <p className="text-sm font-bold text-blue-400">{profile.xp} XP</p>
           </div>
           <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-800 rounded-full border-2 border-blue-500 flex items-center justify-center text-xl overflow-hidden shadow-inner">
              <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${profile.pseudo}`} alt="Avatar" className="w-full h-full object-cover" />
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full flex-grow">
        {activeModule === 'DASHBOARD' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <section className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl">
                <h3 className="text-lg md:text-xl font-bold mb-6 flex items-center space-x-2">
                  <span>🚀</span> <span>Statistiques de Performance</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  {[
                    { label: 'Sessions', value: profile.stats.sessionsTotal, color: 'text-white' },
                    { label: 'Précision', value: `${profile.stats.successRate}%`, color: 'text-green-400' },
                    { label: 'Boot Time', value: `${profile.stats.bootTime.toFixed(1)}s`, color: 'text-blue-400' },
                    { label: 'Niveau', value: profile.rank, color: 'text-purple-400' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-slate-950 p-4 md:p-6 rounded-2xl border border-slate-800 shadow-inner">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">{stat.label}</p>
                      <p className={`text-xl md:text-3xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl">
                <h3 className="text-lg md:text-xl font-bold mb-6 flex items-center space-x-2">
                  <span>🔍</span> <span>Détail par Module</span>
                </h3>
                <div className="space-y-6">
                  {[
                    { label: 'Flash-Scan', current: profile.stats.flashScan.successes, total: profile.stats.flashScan.attempts, color: 'bg-blue-500' },
                    { label: 'Distribution', current: profile.stats.distribution.successes, total: profile.stats.distribution.attempts, color: 'bg-orange-500' },
                    { label: 'Checksum', current: profile.stats.checksum.successes, total: profile.stats.checksum.attempts, color: 'bg-purple-500' },
                  ].map(mod => (
                    <div key={mod.label} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-400 uppercase tracking-widest">{mod.label}</span>
                        <span>{mod.current}/{mod.total} ({mod.total > 0 ? ((mod.current/mod.total)*100).toFixed(0) : 0}%)</span>
                      </div>
                      <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-[1px]">
                        <div 
                          className={`h-full ${mod.color} rounded-full transition-all duration-1000 shadow-sm`} 
                          style={{ width: `${mod.total > 0 ? (mod.current / mod.total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6 md:space-y-8">
              <section className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center space-x-2">
                  <span>✨</span> <span>Conseil du Coach</span>
                </h3>
                <div className="bg-slate-950 p-4 md:p-6 rounded-2xl border border-slate-800 mb-6 italic text-slate-400 text-sm md:text-base leading-relaxed">
                  "{profile.recommendation}"
                </div>
                <button 
                  onClick={handleAIAdvice}
                  disabled={isUpdatingAI}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center space-x-2 active:scale-95"
                >
                  {isUpdatingAI ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Analyse...</span>
                    </>
                  ) : (
                    <>
                      <span>🔄</span>
                      <span>Nouvelle recommandation</span>
                    </>
                  )}
                </button>
              </section>
            </div>
          </div>
        )}

        {activeModule === 'FLASH_SCAN' && (
          <FlashScan onFinish={(success, time) => updateStats('FLASH_SCAN', success, time)} />
        )}

        {activeModule === 'DISTRIBUTION' && (
          <DistributionDrill onFinish={(success) => updateStats('DISTRIBUTION', success)} />
        )}

        {activeModule === 'CHECKSUM' && (
          <ChecksumChallenge onFinish={(success) => updateStats('CHECKSUM', success)} />
        )}
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 flex justify-around items-center p-2 pb-6 md:hidden z-50 shadow-2xl">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id as ModuleType)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${activeModule === item.id ? 'text-blue-400 bg-blue-400/10' : 'text-slate-500'}`}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase">{item.label}</span>
          </button>
        ))}
      </nav>

      <footer className="hidden md:block fixed bottom-0 left-0 w-full p-4 text-center text-slate-600 text-[10px] bg-slate-950/80 backdrop-blur-md">
        Basé sur les protocoles de "Awalé : Le Calcul Profond - Tome 4" | Données sauvegardées localement.
      </footer>
    </div>
  );
};

export default App;
