export interface VerboseEffect {
    effect: string;
    short_effect: string;
    language: {
      name: string;
      url: string;
    };
  }
  
  export interface MoveMetaData {
    category: {
      name: string;
      url: string;
    };
    drain: number;
    healing: number;
    max_hits: number | null;
    max_turns: number | null;
    min_hits: number | null;
    min_turns: number | null;
    stat_chance: number;
  }
  
  export interface Move {
    id: number;
    name: string;
    accuracy: number | null;
    effect_chance: number | null;
    pp: number;
    priority: number;
    power: number | null;
    damage_class: {
      name: string;
      url: string;
    };
    effect_entries: VerboseEffect[];
    meta: MoveMetaData; 
    type: {
      name: string;
      url: string;
    };
    target: {
      name: string;
      url: string;
    };
  }
  
  export interface MoveResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
      name: string;
      url: string;
    }[];
  }