
export type PlayerSide = 'SUD' | 'NORD';

export interface Position {
  sud: number[]; // 6 holes
  nord: number[]; // 6 holes
  metadata: {
    complexity: number;
    total: number;
    timestamp: number;
  };
}

export enum UserRank {
  NOVICE = 'NOVICE',
  APPRENTI = 'APPRENTI',
  ADEPTE = 'ADEPTE',
  EXPERT = 'EXPERT',
  MAITRE = 'MAÎTRE'
}

export interface UserStats {
  sessionsTotal: number;
  trainingTime: number; // in minutes
  successRate: number;
  bootTime: number; // in seconds
  flashScan: { attempts: number; successes: number; bestTime: number };
  distribution: { attempts: number; successes: number };
  checksum: { attempts: number; successes: number };
}

export interface UserProfile {
  id: string;
  pseudo: string;
  rank: UserRank;
  xp: number;
  stats: UserStats;
  recommendation: string;
}

export type ModuleType = 'FLASH_SCAN' | 'DISTRIBUTION' | 'CHECKSUM' | 'DASHBOARD';
