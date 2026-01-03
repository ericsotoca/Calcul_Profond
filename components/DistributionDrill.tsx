
import React, { useState } from 'react';

interface DistributionDrillProps {
  onFinish: (success: boolean) => void;
}

export const DistributionDrill: React.FC<DistributionDrillProps> = ({ onFinish }) => {
  const [phase, setPhase] = useState<'IDLE' | 'QUESTION' | 'FEEDBACK'>('IDLE');
  const [currentHole, setCurrentHole] = useState('A');
  const [seeds, setSeeds] = useState(12);
  const [userInput, setUserInput] = useState<string>('');
  const [correctAnswer, setCorrectAnswer] = useState<string>('');

  /**
   * Direction de jeu anti-horaire traditionnelle :
   * Camp Sud (Bas)  : A -> B -> C -> D -> E -> F (gauche à droite)
   * Camp Nord (Haut) : f -> e -> d -> c -> b -> a (gauche à droite sur l'écran)
   * 
   * Chemin logique d'incrémentation (index 0 à 11) :
   * 0:A, 1:B, 2:C, 3:D, 4:E, 5:F, 6:f, 7:e, 8:d, 9:c, 10:b, 11:a
   */
  const holeNames = ['A','B','C','D','E','F','f','e','d','c','b','a'];

  const generateExercise = () => {
    // Sélection d'une case de départ (A-F)
    const holes = ['A', 'B', 'C', 'D', 'E', 'F'];
    const startHole = holes[Math.floor(Math.random() * holes.length)];
    
    // Génération du nombre de graines :
    // 90% de chances entre 12 et 25
    // 10% de chances entre 26 et 31 (le "rarement 30")
    const seedCount = Math.random() < 0.9 
      ? Math.floor(Math.random() * 14) + 12  // 12 à 25
      : Math.floor(Math.random() * 6) + 26;  // 26 à 31
    
    const startIndex = holeNames.indexOf(startHole);
    let currentIndex = startIndex;
    
    // Simulation du semis Awalé
    for(let i = 0; i < seedCount; i++) {
        currentIndex = (currentIndex + 1) % 12;
        // Règle Awalé : si le semis fait un tour complet (>= 12 graines), la case d'origine reste vide
        if (currentIndex === startIndex && seedCount >= 12) {
             currentIndex = (currentIndex + 1) % 12;
        }
    }

    setCorrectAnswer(holeNames[currentIndex]);
    setCurrentHole(startHole);
    setSeeds(seedCount);
    setUserInput('');
    setPhase('QUESTION');
  };

  const handleCheck = () => {
    // Vérification insensible à la casse et suppression des espaces superflus
    const isSuccess = userInput.trim().toLowerCase() === correctAnswer.toLowerCase();
    setPhase('FEEDBACK');
    onFinish(isSuccess);
  };

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
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-widest">Case de départ</p>
                <p className="text-5xl font-black text-white mono">{currentHole}</p>
            </div>
            <div className="bg-slate-950 p-6 rounded-2xl text-center border border-slate-800 shadow-inner">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-widest">Nb. de Graines</p>
                <p className="text-5xl font-black text-orange-500 mono">{seeds}</p>
            </div>
          </div>

          <div className="w-full space-y-6">
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2 font-medium">Saisissez la case d'arrivée :</p>
              <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">(Bas: A-F | Haut: f-a)</p>
            </div>
            
            <input 
              type="text" 
              maxLength={1}
              autoFocus
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && userInput.length > 0 && handleCheck()}
              className="w-full h-24 bg-slate-950 border-2 border-orange-500/30 rounded-2xl text-center text-6xl font-black focus:border-orange-500 focus:outline-none transition-all text-white mono"
            />
            
            <button 
              onClick={handleCheck}
              disabled={userInput.length === 0}
              className="w-full py-5 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl font-black text-xl transition-all shadow-lg active:scale-95 uppercase tracking-tighter"
            >
              Vérifier
            </button>
          </div>
        </div>
      )}

      {phase === 'FEEDBACK' && (
        <div className="flex flex-col items-center space-y-6 w-full animate-in fade-in duration-300">
           <div className={`w-full p-8 rounded-3xl text-center border-2 ${userInput.toLowerCase() === correctAnswer.toLowerCase() ? 'bg-green-900/10 border-green-500/50' : 'bg-red-900/10 border-red-500/50'}`}>
                <div className="text-6xl mb-4">{userInput.toLowerCase() === correctAnswer.toLowerCase() ? '🎯' : '⚠️'}</div>
                <h3 className={`text-3xl font-black uppercase mb-2 ${userInput.toLowerCase() === correctAnswer.toLowerCase() ? 'text-green-400' : 'text-red-400'}`}>
                    {userInput.toLowerCase() === correctAnswer.toLowerCase() ? 'Calcul Correct' : 'Erreur de Semis'}
                </h3>
                <div className="flex flex-col space-y-1">
                  <p className="text-slate-400 text-sm">Case d'arrivée attendue :</p>
                  <p className="text-white text-4xl font-black mono">{correctAnswer}</p>
                </div>
           </div>
           
           <button 
            onClick={() => setPhase('IDLE')}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all active:scale-95 uppercase tracking-widest text-sm border border-slate-700 shadow-xl"
          >
            Nouvel exercice
          </button>
        </div>
      )}
    </div>
  );
};
