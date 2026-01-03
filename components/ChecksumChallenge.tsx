
import React, { useState } from 'react';

interface ChecksumChallengeProps {
  onFinish: (success: boolean) => void;
}

export const ChecksumChallenge: React.FC<ChecksumChallengeProps> = ({ onFinish }) => {
  const [phase, setPhase] = useState<'IDLE' | 'QUESTION' | 'FEEDBACK'>('IDLE');
  const [sudCapture, setSudCapture] = useState(0);
  const [nordCapture, setNordCapture] = useState(0);
  const [userInput, setUserInput] = useState<number | ''>('');
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const propositions = Array.from({ length: 49 }, (_, i) => i);

  const startExercise = () => {
    const s = Math.floor(Math.random() * 20);
    const n = Math.floor(Math.random() * 20);
    setSudCapture(s);
    setNordCapture(n);
    setCorrectAnswer(48 - s - n);
    setUserInput('');
    setPhase('QUESTION');
  };

  const handleCheck = () => {
    if (userInput === '') return;
    const isSuccess = Number(userInput) === correctAnswer;
    setPhase('FEEDBACK');
    onFinish(isSuccess);
  };

  return (
    <div className="flex flex-col items-center space-y-6 md:space-y-8 max-w-2xl mx-auto w-full px-4">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-400 mb-2">Module C : Checksum</h2>
        <p className="text-xs md:text-sm text-slate-400 italic">Vérifiez l'intégrité de la masse. Total = 48 graines.</p>
      </div>

      {phase === 'IDLE' && (
        <button 
          onClick={startExercise}
          className="w-full py-5 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black text-xl shadow-xl shadow-purple-900/20 transition-all active:scale-95 uppercase tracking-tighter"
        >
          Lancer le Checksum
        </button>
      )}

      {phase === 'QUESTION' && (
        <div className="bg-slate-900 p-6 md:p-10 rounded-3xl border border-slate-800 shadow-2xl w-full flex flex-col items-center space-y-8 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-slate-950 p-6 rounded-2xl text-center border border-slate-800 shadow-inner">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-widest">Sud Captures</p>
                <p className="text-4xl md:text-5xl font-black text-white mono">{sudCapture}</p>
            </div>
            <div className="bg-slate-950 p-6 rounded-2xl text-center border border-slate-800 shadow-inner">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-widest">Nord Captures</p>
                <p className="text-4xl md:text-5xl font-black text-white mono">{nordCapture}</p>
            </div>
          </div>

          <div className="w-full space-y-6">
            <div className="text-center">
              <p className="text-slate-300 text-sm font-medium">Nombre de graines restantes ?</p>
            </div>
            
            <div className="relative w-full">
              <select 
                value={userInput}
                onChange={(e) => setUserInput(parseInt(e.target.value))}
                className="w-full h-20 md:h-24 bg-slate-950 border-2 border-purple-500/30 rounded-2xl text-center text-4xl md:text-6xl font-black focus:border-purple-500 focus:outline-none transition-all text-white mono appearance-none cursor-pointer block px-4"
              >
                <option value="" disabled className="text-base md:text-lg bg-slate-900 text-slate-500">Sélectionner...</option>
                {propositions.map(p => (
                  <option key={p} value={p} className="bg-slate-900 text-white">{p}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-purple-500/50">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            
            <button 
              onClick={handleCheck}
              disabled={userInput === ''}
              className="w-full py-5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl font-black text-xl transition-all shadow-lg active:scale-95 uppercase tracking-tighter"
            >
              Valider le Checksum
            </button>
          </div>
        </div>
      )}

      {phase === 'FEEDBACK' && (
         <div className="flex flex-col items-center space-y-6 w-full animate-in fade-in duration-300 overflow-y-auto pb-10">
            <div className={`w-full p-8 md:p-12 rounded-3xl text-center border-2 ${Number(userInput) === correctAnswer ? 'bg-green-900/10 border-green-500/50' : 'bg-red-900/10 border-red-500/50'}`}>
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <span className="text-5xl">{Number(userInput) === correctAnswer ? '✅' : '🚨'}</span>
                  <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${Number(userInput) === correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                      {Number(userInput) === correctAnswer ? 'Intégrité OK' : 'Erreur'}
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Réponse</p>
                    <p className="text-2xl md:text-3xl font-black text-white mono">{userInput}</p>
                  </div>
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Solution</p>
                    <p className="text-2xl md:text-3xl font-black text-purple-400 mono">{correctAnswer}</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/50">
                   <p className="text-xs md:text-sm text-slate-400 font-medium">
                     Calcul : 48 - ({sudCapture} + {nordCapture}) = {correctAnswer}
                   </p>
                </div>
            </div>
            
            <button 
                onClick={() => { setPhase('IDLE'); setUserInput(''); }}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all active:scale-95 uppercase tracking-widest text-sm border border-slate-700 shadow-xl"
            >
                Nouvel exercice
            </button>
         </div>
      )}
    </div>
  );
};
