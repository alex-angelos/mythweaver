/* ======================================================
   CORE ENTITIES
====================================================== */

export interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  backstory?: string;
  motivation?: string;
  ambition?: string;
  fear?: string;
  stats?: Record<string, number>;
}

/* ======================================================
   GAME FLOW
====================================================== */

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

/* ======================================================
   SKILL CHECK (CONTRATO BACKEND)
====================================================== */

export interface SkillCheckOption {
  skill: string;
  attribute?: string;
}

export interface SkillCheck {
  prompt: string;
  difficultyClass: number;
  options: SkillCheckOption[];
}

/* ======================================================
   GAME RESPONSE (API /playTurn)
====================================================== */

export interface GameResponse {
  narrative: string;
  skillCheck?: SkillCheck;
  effects?: {
    emotion?: string;
    flags?: Record<string, boolean>;
    inventoryChanges?: {
      action: 'add' | 'remove';
      name: string;
      condition?: string;
    }[];
  };
  worldEvent?: any; // frontend NÃO interpreta
}

/* ======================================================
   APP STATE
====================================================== */

export enum AppStage {
  AUTH = 'AUTH',
  CHARACTER_SELECTION = 'CHARACTER_SELECTION',
  GAME = 'GAME',
  CHARACTER_DETAILS = 'CHARACTER_DETAILS'
}
