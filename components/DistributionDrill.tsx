
import React, { useState } from 'react';
// Fixed typo: Board_PATH -> BOARD_PATH to match exported constant in constants.ts
import { BOARD_PATH } from '../constants';

interface DistributionDrillProps {
  onFinish: (success: boolean) => void;
}

export const DistributionDrill: React.FC<DistributionDrillProps> = ({ onFinish }) => {
  const [phase, setPhase] = useState<'IDLE' | 'QUESTION' | 'FEEDBACK'>('IDLE');
  const [currentHole, setCurrentHole] = useState('A');
  const [seeds, setSeeds] = useState(12);
  const [userInput, setUserInput] = useState<string>('');
  const [correctAnswer, setCorrectAnswer] = useState<string>('');

  const generateExercise = () => {
    const holes = ['A', 'B', 'C', 'D', 'E', 'F'];
    const startHole = holes[Math.floor(Math.random() * holes.length)];
    const seedCount = Math.floor(Math.random() * 20) + 12; // 12 to 32 seeds
    
    // Logic for ending hole
    const startIndex = holes.indexOf(startHole);
    // In Awale, if seeds >= 12, the starting hole is skipped
    let totalPositions = 12;
    let effectiveSeeds = seedCount;
    let currentIndex = startIndex;
    
    // Simulate distribution
    for(let i=0; i<seedCount; i++) {
        currentIndex = (currentIndex + 1) % 12;
        if (currentIndex === startIndex && seedCount >= 12) {
             currentIndex = (currentIndex + 1) % 12; // Skip start hole
        }
    }

    const holeNames = ['A','B','C','D','E','F','f','e','d','c','b','a'];
    setCorrectAnswer(holeNames[currentIndex]);
    setCurrentHole(startHole);
    setSeeds(seedCount);
    setPhase('QUESTION');
  };

  const handleCheck = () => {
    const isSuccess = userInput.toLowerCase() === correctAnswer.toLowerCase();
    setPhase('FEEDBACK');
    onFinish(isSuccess);
  };

  return (
    <div className="flex flex-col items-center space-y-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-orange-400 mb-2">Module B : Distribution Drill</h2>
        <p className="text-slate-400">Maîtrisez le "modulo" et la cinétique des graines. Calculez la case d'arrivée d'un semis.</p>
      </div>

      {phase === 'IDLE' && (
        <button 
          onClick={generateExercise}
          className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold text-xl transition-all"
        >
          Générer un Drill
        </button>
      )}

      {phase === 'QUESTION' && (
        <div className="bg-slate-800 p-10 rounded-3xl border border-slate-700 shadow-2xl w-full flex flex-col items-center space-y-6">
          <div className="text-center space-y-2">
            <p className="text-slate-400 uppercase tracking-widest text-sm">Case de départ</p>
            <p className="text-6xl font-black text-white mono">{currentHole}</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-slate-400 uppercase tracking-widest text-sm">Graines à semer</p>
            <p className="text-6xl font-black text-orange-500 mono">{seeds}</p>
          </div>

          <div className="w-full pt-8 flex flex-col items-center space-y-4">
            <p className="text-slate-300">Quelle est la case d'arrivée ? (A-F ou a-f)</p>
            <input 
              type="text" 
              maxLength={1}
              autoFocus
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-24 h-24 bg-slate-900 border-2 border-orange-500 rounded-2xl text-center text-4xl font-bold focus:outline-none uppercase"
            />
            <button 
              onClick={handleCheck}
              className="px-12 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-lg transition-all"
            >
              Vérifier
            </button>
          </div>
        </div>
      )}

      {phase === 'FEEDBACK' && (
        <div className="flex flex-col items-center space-y-6">
           <div className={`p-8 rounded-2xl text-center ${userInput.toLowerCase() === correctAnswer.toLowerCase() ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'}`}>
                <h3 className={`text-4xl font-bold mb-2 ${userInput.toLowerCase() === correctAnswer.toLowerCase() ? 'text-green-400' : 'text-red-400'}`}>
                    {userInput.toLowerCase() === correctAnswer.toLowerCase() ? 'EXCELLENT' : 'ERREUR'}
                </h3>
                <p className="text-slate-300 text-xl">
                    La case d'arrivée était : <span className="font-bold text-white mono">{correctAnswer}</span>
                </p>
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
