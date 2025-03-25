// Types for Pokemon AI features

// Recommendation System Types
export interface RecommendationRequest {
    pokemonName?: string;
    pokemonId?: number;
    limit?: number;
    preferredTypes?: string[];
    includeEvolutions?: boolean;
    similarityStrategy?: 'type' | 'stats' | 'balanced';
  }
  
  export interface SimilarityScore {
    pokemon: Pokemon;
    score: number;
    scoreBreakdown: Record<string, number>;
  }
  
  export interface RecommendationResult {
    basePokemon: Pokemon;
    similarPokemon: Pokemon[];
    explanations: Record<number, string>;
    matchReasons: string[];
    averageSimilarityScore: number;
  }
  
  // Content Generation Types
  export interface GenerationRequest {
    contentType: 'story' | 'strategy' | 'pokedex';
    pokemonName?: string;
    pokemonId?: number;
    teamMembers?: string[];
    teamIds?: number[];
    targetAudience?: string;
    language?: string;
    tone?: string;
    maxLength?: number;
    format?: 'text' | 'markdown' | 'html';
    includeImagePrompt?: boolean;
  }
  
  export interface ContentMetadata {
    targetAudience?: string;
    wordCount?: number;
    language?: string;
    tags?: string[];
    format?: string;
    tone?: string;
  }
  
  export interface GeneratedContent {
    id: string;
    title: string;
    content: string;
    contentType: string;
    featuredPokemon?: Pokemon;
    featuredTeam?: Pokemon[];
    generatedDate: string;
    imagePrompt?: string;
    metadata: ContentMetadata;
  }
  
  // Pokemon Comparison Types
  export interface ComparisonRequest {
    pokemonIds: number[];
    includeTypeEffectiveness?: boolean;
    includeStatComparison?: boolean;
    includeAbilities?: boolean;
    includeSprites?: boolean;
  }
  
  export interface TypeEffectiveness {
    strongAgainst: string[];
    weakAgainst: string[];
    resistantTo: string[];
    immuneTo: string[];
    primaryType: string;
    secondaryType?: string;
  }
  
  export interface StatComparison {
    height: Record<number, number>;
    weight: Record<number, number>;
    baseExperience: Record<number, number>;
    highest: Record<string, number>;
    lowest: Record<string, number>;
    normalizedValues: {
      height: Record<number, number>;
      weight: Record<number, number>;
      baseExperience: Record<number, number>;
    };
  }
  
  export interface PokemonComparison {
    pokemons: Pokemon[];
    typeEffectiveness: Record<number, TypeEffectiveness>;
    statComparison: StatComparison;
    abilities: Record<number, string[]>;
    spriteUrls: Record<number, string>;
  }
  
  // Basic Pokemon Types (simplified)
  export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    baseExperience: number;
    types: PokemonType[];
    sprites: {
      frontDefault: string;
      backDefault?: string;
      frontShiny?: string;
      backShiny?: string;
    };
    abilities: Ability[];
  }
  
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
    isHidden: boolean;
    slot: number;
  }