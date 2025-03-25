export interface Generation {
    id: number;
    name: string;
    abilities: { name: string; url: string }[];
    main_region: {
      name: string;
      url: string;
    };
    moves: { name: string; url: string }[];
    pokemon_species: { name: string; url: string }[];
    types: { name: string; url: string }[];
    version_groups: { name: string; url: string }[];
  }
  
  export interface GenerationResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
      name: string;
      url: string;
    }[];
  }