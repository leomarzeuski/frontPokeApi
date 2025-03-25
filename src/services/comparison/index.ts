import api from "../api";
import { Pokemon } from "../pokemon/models";
import { ComparisonRequest, PokemonComparison } from "./models";

export const comparePokemons = async (ids: number[]): Promise<Pokemon[]> => {
    try {
        const response = await api.get("/api/pokemon/compare", {
            params: { ids: ids.join(",") }
        });
        return response.data;
    } catch (error) {
        console.error("Error comparing Pokémon:", error);
        throw error;
    }
};

export const getDetailedComparison = async (ids: number[]): Promise<PokemonComparison> => {
    try {
        const response = await api.get("/api/pokemon/compare/detailed", {
            params: { ids: ids.join(",") }
        });
        return response.data;
    } catch (error) {
        console.error("Error getting detailed comparison:", error);
        throw error;
    }
};

export const getDetailedComparisonWithOptions = async (request: ComparisonRequest): Promise<PokemonComparison> => {
    try {
        const response = await api.post("/api/pokemon/compare/detailed", request);
        return response.data;
    } catch (error) {
        console.error("Error getting detailed comparison with options:", error);
        throw error;
    }
};

export const getTypeEffectivenessLabel = (effectiveness: number): string => {
    if (effectiveness === 0) return "No effect";
    if (effectiveness === 0.25) return "Very weak";
    if (effectiveness === 0.5) return "Not very effective";
    if (effectiveness === 1) return "Normal";
    if (effectiveness === 2) return "Super effective";
    if (effectiveness === 4) return "Extremely effective";
    return "Unknown";
};

export const getTypeColor = (type: string): string => {
    const typeColors: Record<string, string> = {
        normal: "#A8A878",
        fire: "#F08030",
        water: "#6890F0",
        electric: "#F8D030",
        grass: "#78C850",
        ice: "#98D8D8",
        fighting: "#C03028",
        poison: "#A040A0",
        ground: "#E0C068",
        flying: "#A890F0",
        psychic: "#F85888",
        bug: "#A8B820",
        rock: "#B8A038",
        ghost: "#705898",
        dragon: "#7038F8",
        dark: "#705848",
        steel: "#B8B8D0",
        fairy: "#EE99AC"
    };
    
    return typeColors[type.toLowerCase()] || "#888888";
};

export const formatStatValue = (stat: string, value: number): string => {
    switch (stat) {
        case "height":
            return `${(value / 10).toFixed(1)}m`;
        case "weight":
            return `${(value / 10).toFixed(1)}kg`;
        case "baseExperience":
            return value.toString();
        default:
            return value.toString();
    }
};

export const getStatLabel = (stat: string): string => {
    switch (stat) {
        case "height":
            return "Height";
        case "weight":
            return "Weight";
        case "baseExperience":
            return "Base Exp";
        default:
            return stat;
    }
};