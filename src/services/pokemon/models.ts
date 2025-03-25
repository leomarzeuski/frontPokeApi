export interface PokemonType {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }
  
  export interface Ability {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }
  
  export interface Sprites {
    front_default: string;
    back_default: string;
    front_shiny: string;
    back_shiny: string;
  }
  
  export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    types: PokemonType[];
    sprites: Sprites;
    abilities: Ability[];
  }
  
  export interface PokemonResult {
    name: string;
    url: string;
  }
  
  export interface PokemonResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonResult[];
  }
  
  export interface FlavorTextEntry {
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version: {
      name: string;
      url: string;
    };
  }
  
  export interface Genus {
    genus: string;
    language: {
      name: string;
      url: string;
    };
  }
  
  export interface PokemonSpecies {
    id: number;
    name: string;
    is_baby: boolean;
    is_legendary: boolean;
    is_mythical: boolean;
    evolution_chain: {
      url: string;
    };
    color: {
      name: string;
      url: string;
    };
    flavor_text_entries: FlavorTextEntry[];
    genera: Genus[];
    generation: {
      name: string;
      url: string;
    };
    growth_rate: {
      name: string;
      url: string;
    };
    habitat: {
      name: string;
      url: string;
    } | null;
  }
  
  export interface EvolutionDetail {
    trigger: {
      name: string;
      url: string;
    };
    min_level: number | null;
    min_happiness: number | null;
    min_beauty: number | null;
    min_affection: number | null;
    needs_overworld_rain: boolean;
    time_of_day: string;
    item: {
      name: string;
      url: string;
    } | null;
  }
  
  export interface ChainLink {
    is_baby: boolean;
    species: {
      name: string;
      url: string;
    };
    evolution_details: EvolutionDetail[];
    evolves_to: ChainLink[];
  }
  
  export interface EvolutionChain {
    id: number;
    chain: ChainLink;
  }
  
  export interface TypeRelations {
    double_damage_from: { name: string; url: string }[];
    double_damage_to: { name: string; url: string }[];
    half_damage_from: { name: string; url: string }[];
    half_damage_to: { name: string; url: string }[];
    no_damage_from: { name: string; url: string }[];
    no_damage_to: { name: string; url: string }[];
  }
  
  export interface TypePokemon {
    pokemon: {
      name: string;
      url: string;
    };
    slot: number;
  }
  
  export interface PokemonType {
    id: number;
    name: string;
    damage_relations: TypeRelations;
    pokemon: TypePokemon[];
  }