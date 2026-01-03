
export const PIT_NAMES_SUD = ['A', 'B', 'C', 'D', 'E', 'F'];
export const PIT_NAMES_NORD = ['a', 'b', 'c', 'd', 'e', 'f'];

export const INITIAL_POSITION: number[] = Array(12).fill(4);

export const COLORS = {
  empty: 'bg-slate-700 text-slate-400',
  low: 'bg-blue-600 text-white',
  mid: 'bg-orange-500 text-white',
  high: 'bg-red-600 text-white', // Krous
};

export const getPitColor = (count: number) => {
  if (count === 0) return COLORS.empty;
  if (count <= 4) return COLORS.low;
  if (count <= 8) return COLORS.mid;
  return COLORS.high;
};

// Maps 0-11 index to counter-clockwise board path
// South A-F: 0,1,2,3,4,5
// North a-f: 6,7,8,9,10,11
// Actual Awale path: A->B->C->D->E->F -> f->e->d->c->b->a
export const BOARD_PATH = [0, 1, 2, 3, 4, 5, 11, 10, 9, 8, 7, 6];
