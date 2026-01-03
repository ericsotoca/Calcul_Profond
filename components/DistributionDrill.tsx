
import React, { useState, useEffect } from 'react';
import { Board } from './Board';
import { BOARD_PATH, PIT_NAMES_SUD, PIT_NAMES_NORD } from '../constants';

interface DistributionDrillProps {
  onFinish: (success: boolean) => void;
}

export const DistributionDrill: React.FC<DistributionDrillProps> = ({ onFinish }) => {
  const [phase, setPhase] = useState<'IDLE' | 'QUESTION' | 'FEEDBACK'>('IDLE');
  const [startHoleName, setStartHoleName] = useState('A');
  const [seeds, setSeeds] = useState(12);
  const [userInput, setUserInput] = useState<string>('');
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  
  // États pour l'animation de vérification
  const [animStep, setAnimStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPath, setAnimationPath] = useState<number[]>([]);

  // Aide pour obtenir le nom d'une case à partir de son index global (0-11)
  const getPitName = (globalIdx: number) => {
    return globalIdx < 6 ? PIT_NAMES_SUD[globalIdx] : PIT_NAMES_NORD[globalIdx - 6];
  };

  const generateExercise = () => {
    const startGlobalIdx = Math.floor(Math.random() * 6);
    const selectedStartHole = getPitName(startGlobalIdx);
    
    const seedCount = Math.random() < 0.9 
      ? Math.floor(Math.random() * 14) + 12
      : Math.floor(Math.random() * 6) + 26;
    
    const path: number[] = [];
    let currentPathIndex = BOARD_PATH.indexOf(startGlobalIdx);
    
    for (let i = 0; i < seedCount; i++) {
      currentPathIndex = (currentPathIndex + 1) % 12;
      if (BOARD_PATH[currentPathIndex] === startGlobalIdx && seedCount >= 12) {
        currentPathIndex = (currentPathIndex + 1) % 12;
      }
      path.push(BOARD_PATH[currentPathIndex]);
    }

    const finalGlobalIdx = path[path.length - 1];
    setCorrectAnswer(getPitName(finalGlobalIdx));
    setStartHoleName(selectedStartHole);
    setSeeds(seedCount);
    setAnimationPath(path);
    setUserInput('');
    setPhase('QUESTION');
    setAnimStep(-1);
    setIsAnimating(false);
  };

  const handleCheck = () => {
    if (!userInput) return;
    const isSuccess = userInput.toLowerCase() === correctAnswer.toLowerCase();
    setPhase('FEEDBACK');
    onFinish(isSuccess);
  };

  useEffect(() => {
    let timer: any;
    if (isAnimating && animStep < animationPath.length - 1) {
      timer = setTimeout(() => {
        setAnimStep(prev => prev + 1);
      }, 200);
    } else if (animStep === animationPath.length - 1) {
      setIsAnimating(false);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, animStep, animationPath]);

  const startReplay = () => {
    setAnimStep(0);
    setIsAnimating(true);
  };

  const getVisualBoardData = () => {
    const sud = Array(6).fill(0);
    const nord = Array(6).fill(0);
    
    if (animStep >= 0) {
      const currentGlobalIdx = animationPath[animStep];
      const countValue = animStep + 1;
      
      if (currentGlobalIdx < 6) sud[currentGlobalIdx] = countValue;
      else nord[currentGlobalIdx - 6] = countValue;
    }
    
    return { sud, nord };
  };

  const { sud: visSud, nord: visNord } = getVisualBoardData();
  
  const highlightedPits = [];
  if (phase === 'FEEDBACK') {
    const startIdx = PIT_NAMES_SUD.indexOf(startHoleName);
    if (startIdx !== -1) highlightedPits.push(startIdx);
    if (animStep >= 0) {
      highlightedPits.push(animationPath[animStep]);
    }
  }

  return (
    <div className="flex flex-col items-center space-y-6 md:space-y-8 max-w-2xl mx-auto w-full px-4">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-2">Module B : Semis</h2>
        <p className="text-xs md:text-sm text-slate-400 italic">Calculez mentalement la case d'arrivée (sens anti-horaire).</p>
      </div>

      {phase === 'IDLE' && (
        <button 
          onClick={generateExercise}
          className="w-full py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-xl shadow-xl shadow-orange-900/20 transition-all active:scale-95 uppercase tracking-tighter"
        >
          Générer un exercice
        </button>
      )}

      {phase === 'QUESTION' && (
        <div className="bg-slate-900 p-6 md:p-10 rounded-3xl border border-slate-800 shadow-2xl w-full flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-slate-950 p-6 rounded-2xl text-center border border-slate-800 shadow-inner">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-widest">Départ</p>
                <p className="text-4xl md:text-5xl font-black text-white mono">{startHoleName}</p>
            </div>
            <div className="bg-slate-950 p-6 rounded-2xl text-center border border-slate-800 shadow-inner">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-widest">Graines</p>
                <p className="text-4xl md:text-5xl font-black text-orange-500 mono">{seeds}</p>
            </div>
          </div>

          <div className="w-full space-y-6">
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2 font-medium">Sélectionnez la case d'arrivée :</p>
            </div>
            
            <div className="relative w-full">
              <select 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full h-20 md:h-24 bg-slate-950 border-2 border-orange-500/30 rounded-2xl text-center text-4xl md:text-6xl font-black focus:border-orange-500 focus:outline-none transition-all text-white mono appearance-none cursor-pointer block px-4"
              >
                <option value="" disabled className="text-base md:text-lg bg-slate-900 text-slate-500">Choisir...</option>
                <optgroup label="Camp SUD" className="bg-slate-900 text-white">
                  {PIT_NAMES_SUD.map(p => <option key={p} value={p} className="bg-slate-900">{p}</option>)}
                </optgroup>
                <optgroup label="Camp NORD" className="bg-slate-900 text-white">
                  {PIT_NAMES_NORD.map(p => <option key={p} value={p} className="bg-slate-900">{p}</option>)}
                </optgroup>
              </select>
              <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-orange-500/50">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            
            <button 
              onClick={handleCheck}
              disabled={!userInput}
              className="w-full py-5 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl font-black text-xl transition-all shadow-lg active:scale-95 uppercase tracking-tighter"
            >
              Vérifier
            </button>
          </div>
        </div>
      )}

      {phase === 'FEEDBACK' && (
        <div className="flex flex-col items-center space-y-6 w-full animate-in fade-in duration-300 overflow-y-auto pb-10">
           <div className={`w-full p-6 md:p-8 rounded-3xl text-center border-2 ${userInput.toLowerCase() === correctAnswer.toLowerCase() ? 'bg-green-900/10 border-green-500/50' : 'bg-red-900/10 border-red-500/50'}`}>
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <span className="text-4xl">{userInput.toLowerCase() === correctAnswer.toLowerCase() ? '🎯' : '⚠️'}</span>
                  <h3 className={`text-2xl md:text-3xl font-black uppercase ${userInput.toLowerCase() === correctAnswer.toLowerCase() ? 'text-green-400' : 'text-red-400'}`}>
                      {userInput.toLowerCase() === correctAnswer.toLowerCase() ? 'Calcul Correct' : 'Erreur de Semis'}
                  </h3>
                </div>
                
                <p className="text-slate-400 text-sm mb-4">
                  Départ : <span className="font-bold text-white mono">{startHoleName}</span> | Arrivée attendue : <span className="font-bold text-white text-xl mono">{correctAnswer}</span>
                </p>

                <div className="mt-6 p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Animation</span>
                    <button 
                      onClick={startReplay}
                      disabled={isAnimating}
                      className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold uppercase rounded-lg border border-slate-700 transition-all disabled:opacity-50"
                    >
                      {animStep === -1 ? 'Lancer' : 'Rejouer'}
                    </button>
                  </div>
                  
                  <Board 
                    sud={visSud} 
                    nord={visNord} 
                    showValues={animStep >= 0}
                    highlightedPits={highlightedPits}
                  />
                  
                  <div className="h-8 mt-4 flex items-center justify-center">
                    {isAnimating ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                        <div className="text-xs text-orange-400 font-bold uppercase tracking-widest">
                          Graine {animStep + 1} / {seeds}
                        </div>
                      </div>
                    ) : (
                      animStep >= 0 && (
                        <div className="text-[10px] text-green-400 font-bold uppercase tracking-widest">
                          ✓ Arrivée en {correctAnswer}
                        </div>
                      )
                    )}
                  </div>
                </div>
           </div>
           
           <button 
            onClick={() => setPhase('IDLE')}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all active:scale-95 uppercase tracking-widest text-sm border border-slate-700 shadow-xl"
          >
            Nouveau Semis
          </button>
        </div>
      )}
    </div>
  );
};
