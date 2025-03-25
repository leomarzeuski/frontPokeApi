import { Pokemon } from '../pokemon/models';

export interface TypeEffectiveness {
    strongAgainst: string[];
    weakAgainst: string[];
    resistantTo: string[];
    immuneTo: string[];
    primaryType: string;
    secondaryType: string | null;
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

export interface ComparisonRequest {
    pokemonIds: number[];
    includeTypeEffectiveness: boolean;
    includeStatComparison: boolean;
    includeAbilities: boolean;
    includeSprites: boolean;
}