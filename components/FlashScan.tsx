
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Board } from './Board';
import { Position } from '../types';

interface FlashScanProps {
  onFinish: (success: boolean, time: number) => void;
}

export const FlashScan: React.FC<FlashScanProps> = ({ onFinish }) => {
  const [phase, setPhase] = useState<'IDLE' | 'VIEWING' | 'INPUT' | 'FEEDBACK'>('IDLE');
  const [position, setPosition] = useState<Position | null>(null);
  const [userInput, setUserInput] = useState<number[]>(Array(12).fill(0));
  const [viewTime, setViewTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const generatePosition = useCallback(() => {
    // Generate values between 0 and 12 (Krou included)
    const sud = Array.from({ length: 6 }, () => {
      const r = Math.random();
      if (r < 0.2) return 0;
      if (r < 0.8) return Math.floor(Math.random() * 6) + 1;
      return Math.floor(Math.random() * 6) + 7;
    });
    const nord = Array.from({ length: 6 }, () => {
      const r = Math.random();
      if (r < 0.2) return 0;
      if (r < 0.8) return Math.floor(Math.random() * 6) + 1;
      return Math.floor(Math.random() * 6) + 7;
    });
    return {
      sud,
      nord,
      metadata: {
        complexity: 2,
        total: sud.reduce((a, b) => a + b, 0) + nord.reduce((a, b) => a + b, 0),
        timestamp: Date.now()
      }
    };
  }, []);

  const startExercise = () => {
    setPosition(generatePosition());
    setPhase('VIEWING');
    setTimeLeft(viewTime);
  };

  useEffect(() => {
    let timer: any;
    if (phase === 'VIEWING' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (phase === 'VIEWING' && timeLeft === 0) {
      setPhase('INPUT');
      setUserInput(Array(12).fill(0));
      // Focus on first input after a small delay for mobile keyboards
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  const handleSubmit = () => {
    if (!position) return;
    const correct = [...position.sud, ...position.nord];
    const isSuccess = userInput.every((val, i) => val === correct[i]);
    setPhase('FEEDBACK');
    onFinish(isSuccess, viewTime);
  };

  const updateInputValue = (index: number, val: string) => {
    const next = [...userInput];
    const numVal = parseInt(val);
    next[index] = isNaN(numVal) ? 0 : numVal;
    setUserInput(next);
  };

  return (
    <div className="flex flex-col items-center space-y-6 md:space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto w-full">
      <div className="text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">Module A : Flash-Scan</h2>
        <p className="text-xs md:text-sm text-slate-400">Observez le plateau puis restituez les valeurs de mémoire.</p>
      </div>

      {phase === 'IDLE' && (
        <div className="flex flex-col items-center space-y-6 w-full px-4">
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 w-full text-center">
            <span className="text-sm text-slate-300 block mb-4 font-semibold uppercase tracking-widest">Temps d'exposition</span>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 5, 10].map(t => (
                <button 
                  key={t}
                  onClick={() => setViewTime(t)}
                  className={`py-3 rounded-xl transition-all font-bold text-lg ${viewTime === t ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
                >
                  {t}s
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={startExercise}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xl shadow-xl shadow-blue-900/30 transition-all transform hover:scale-105 active:scale-95 uppercase tracking-tighter"
          >
            Commencer
          </button>
        </div>
      )}

      {phase === 'VIEWING' && position && (
        <div className="flex flex-col items-center space-y-6 w-full px-2">
          <div className="w-full max-w-md h-3 bg-slate-800 rounded-full overflow-hidden p-[2px]">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              style={{ width: `${(timeLeft / viewTime) * 100}%` }}
            />
          </div>
          <Board sud={position.sud} nord={position.nord} />
          <div className="text-5xl font-black mono text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">{timeLeft}s</div>
        </div>
      )}

      {phase === 'INPUT' && (
        <div className="flex flex-col items-center space-y-6 w-full px-2">
          <div className="bg-slate-900 p-4 md:p-8 rounded-3xl border border-slate-700 shadow-2xl w-full">
            <div className="grid grid-cols-6 gap-2 md:gap-4 mb-4 md:mb-6">
              {userInput.slice(6).reverse().map((val, i) => (
                <input
                  key={`n-${5-i}`}
                  type="tel"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={val || ''}
                  onChange={(e) => updateInputValue(11 - i, e.target.value)}
                  className="w-full aspect-square bg-slate-950 border-2 border-slate-700 rounded-lg md:rounded-xl text-center text-xl md:text-2xl font-bold focus:border-blue-500 focus:outline-none focus:ring-4 ring-blue-500/20"
                />
              ))}
            </div>
            <div className="grid grid-cols-6 gap-2 md:gap-4">
              {userInput.slice(0, 6).map((val, i) => (
                <input
                  key={`s-${i}`}
                  ref={i === 0 ? firstInputRef : null}
                  type="tel"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={val || ''}
                  onChange={(e) => updateInputValue(i, e.target.value)}
                  className="w-full aspect-square bg-slate-950 border-2 border-slate-700 rounded-lg md:rounded-xl text-center text-xl md:text-2xl font-bold focus:border-blue-500 focus:outline-none focus:ring-4 ring-blue-500/20"
                />
              ))}
            </div>
          </div>
          <button 
            onClick={handleSubmit}
            className="w-full py-5 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black text-xl transition-all shadow-xl shadow-green-900/20 active:scale-95 uppercase tracking-tighter"
          >
            Valider
          </button>
        </div>
      )}

      {phase === 'FEEDBACK' && position && (
        <div className="flex flex-col items-center space-y-6 w-full px-2 overflow-y-auto pb-8">
          <div className="text-center">
            {userInput.every((v, i) => v === [...position.sud, ...position.nord][i]) ? (
              <div className="text-green-400">
                <div className="text-5xl mb-2">🏆</div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">Excellent !</h3>
              </div>
            ) : (
              <div className="text-red-400">
                <div className="text-5xl mb-2">❌</div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">Inexact</h3>
              </div>
            )}
          </div>
          
          <div className="w-full space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block text-center">Position réelle</span>
              <Board sud={position.sud} nord={position.nord} />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block text-center">Votre restitution</span>
              <Board sud={userInput.slice(0, 6)} nord={userInput.slice(6)} />
            </div>
          </div>

          <button 
            onClick={() => setPhase('IDLE')}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all active:scale-95 uppercase tracking-widest text-sm"
          >
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
};
