
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

  const startExercise = () => {
    const s = Math.floor(Math.random() * 15);
    const n = Math.floor(Math.random() * 15);
    setSudCapture(s);
    setNordCapture(n);
    setCorrectAnswer(48 - s - n);
    setPhase('QUESTION');
  };

  const handleCheck = () => {
    const isSuccess = Number(userInput) === correctAnswer;
    setPhase('FEEDBACK');
    onFinish(isSuccess);
  };

  return (
    <div className="flex flex-col items-center space-y-8 max-w-xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-purple-400 mb-2">Module C : Checksum Challenge</h2>
        <p className="text-slate-400">Vérifiez l'intégrité de votre calcul. Le total doit toujours être de 48.</p>
      </div>

      {phase === 'IDLE' && (
        <button 
          onClick={startExercise}
          className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold text-xl transition-all"
        >
          Lancer le Checksum
        </button>
      )}

      {phase === 'QUESTION' && (
        <div className="bg-slate-800 p-10 rounded-3xl border border-slate-700 shadow-2xl w-full space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 p-6 rounded-2xl text-center">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Captures Sud</p>
                <p className="text-4xl font-black text-white">{sudCapture}</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl text-center">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Captures Nord</p>
                <p className="text-4xl font-black text-white">{nordCapture}</p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <p className="text-slate-300 text-center">Combien de graines reste-t-il sur le plateau ?</p>
            <input 
              type="number"
              autoFocus
              value={userInput}
              onChange={(e) => setUserInput(parseInt(e.target.value) || '')}
              className="w-full max-w-xs h-20 bg-slate-900 border-2 border-purple-500 rounded-2xl text-center text-4xl font-bold focus:outline-none"
            />
            <button 
              onClick={handleCheck}
              className="px-12 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-lg transition-all"
            >
              Calculer
            </button>
          </div>
        </div>
      )}

      {phase === 'FEEDBACK' && (
         <div className="flex flex-col items-center space-y-6">
            <div className={`p-10 rounded-3xl text-center ${Number(userInput) === correctAnswer ? 'bg-green-900/20 border border-green-500' : 'bg-red-900/20 border border-red-500'}`}>
                <h3 className={`text-4xl font-bold mb-4 ${Number(userInput) === correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                    {Number(userInput) === correctAnswer ? 'INTÉGRITÉ OK' : 'ERREUR DE MASSE'}
                </h3>
                <p className="text-slate-300 text-lg mb-2">Votre réponse : <span className="font-bold text-white">{userInput}</span></p>
                <p className="text-slate-300 text-lg">Solution correcte : <span className="font-bold text-white">{correctAnswer}</span></p>
            </div>
            <button 
                onClick={() => { setPhase('IDLE'); setUserInput(''); }}
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-all"
            >
                Nouvel exercice
            </button>
         </div>
      )}
    </div>
  );
};
