
import React from 'react';
import { getPitColor, PIT_NAMES_SUD, PIT_NAMES_NORD } from '../constants';

interface BoardProps {
  sud: number[];
  nord: number[];
  showValues?: boolean;
  highlightedPits?: number[]; // index 0-5 for sud, 6-11 for nord
  onPitClick?: (side: 'SUD' | 'NORD', index: number) => void;
}

export const Board: React.FC<BoardProps> = ({ 
  sud, 
  nord, 
  showValues = true, 
  highlightedPits = [], 
  onPitClick 
}) => {
  const renderPit = (side: 'SUD' | 'NORD', index: number, value: number, name: string) => {
    const globalIdx = side === 'SUD' ? index : index + 6;
    const isHighlighted = highlightedPits.includes(globalIdx);
    
    return (
      <div 
        key={`${side}-${index}`}
        onClick={() => onPitClick?.(side, index)}
        className={`
          flex flex-col items-center justify-center 
          w-full aspect-[3/4] md:aspect-auto md:w-24 md:h-32 
          rounded-lg md:rounded-xl border-2 transition-all cursor-pointer select-none active:scale-95
          ${getPitColor(value)}
          ${isHighlighted ? 'ring-4 ring-yellow-400 border-yellow-400 scale-105 z-10 shadow-lg' : 'border-transparent'}
        `}
      >
        <span className="text-[8px] md:text-xs opacity-50 mb-1 font-bold">{name}</span>
        <span className="text-lg md:text-4xl font-bold mono">
          {showValues ? value : '?'}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-slate-800 p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-2xl border border-slate-700 w-full max-w-2xl mx-auto overflow-hidden">
      {/* North Row (Top) */}
      <div className="grid grid-cols-6 gap-2 md:gap-3 mb-4 md:mb-6">
        {nord.slice().reverse().map((val, i) => renderPit('NORD', 5 - i, val, PIT_NAMES_NORD[5 - i]))}
      </div>
      {/* South Row (Bottom) */}
      <div className="grid grid-cols-6 gap-2 md:gap-3">
        {sud.map((val, i) => renderPit('SUD', i, val, PIT_NAMES_SUD[i]))}
      </div>
    </div>
  );
};
