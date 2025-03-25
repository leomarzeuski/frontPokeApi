import axios from 'axios';
import { 
  Pokemon,
  RecommendationRequest, 
  RecommendationResult, 
  GenerationRequest, 
  GeneratedContent,
  ComparisonRequest,
  PokemonComparison
} from './model';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Recommendation Service
export const getSimilarPokemon = async (params: RecommendationRequest): Promise<RecommendationResult> => {
  try {
    const response = await api.get('/recommend/similar', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting similar pokemon:', error);
    throw error;
  }
};

export const recommendPokemon = async (request: RecommendationRequest): Promise<RecommendationResult> => {
  try {
    const response = await api.post('/recommend/similar', request);
    return response.data;
  } catch (error) {
    console.error('Error recommending pokemon:', error);
    throw error;
  }
};

// Content Generation Service
export const generateStory = async (
  pokemon: string,
  options?: {
    targetAudience?: string;
    tone?: string;
    format?: string;
    maxLength?: number;
    includeImagePrompt?: boolean;
  }
): Promise<GeneratedContent> => {
  try {
    const params = {
      pokemon,
      ...options
    };
    
    const response = await api.get('/generate/story', { params });
    return response.data;
  } catch (error) {
    console.error('Error generating story:', error);
    throw error;
  }
};

export const generatePokedexEntry = async (
  pokemon: string,
  options?: {
    targetAudience?: string;
    tone?: string;
    format?: string;
    maxLength?: number;
    includeImagePrompt?: boolean;
  }
): Promise<GeneratedContent> => {
  try {
    const params = {
      pokemon,
      ...options
    };
    
    const response = await api.get('/generate/pokedex', { params });
    return response.data;
  } catch (error) {
    console.error('Error generating pokedex entry:', error);
    throw error;
  }
};

export const generateStrategy = async (
  options: {
    team?: string;
    pokemon?: string;
    targetAudience?: string;
    tone?: string;
    format?: string;
    maxLength?: number;
    includeImagePrompt?: boolean;
  }
): Promise<GeneratedContent> => {
  try {
    const response = await api.get('/generate/strategy', { params: options });
    return response.data;
  } catch (error) {
    console.error('Error generating strategy:', error);
    throw error;
  }
};

export const generateContent = async (request: GenerationRequest): Promise<GeneratedContent> => {
  try {
    const response = await api.post('/generate', request);
    return response.data;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
};

// Comparison Service
export const comparePokemons = async (ids: number[]): Promise<Pokemon[]> => {
  try {
    const response = await api.get('/pokemon/compare', {
      params: { ids: ids.join(',') }
    });
    return response.data;
  } catch (error) {
    console.error('Error comparing pokemon:', error);
    throw error;
  }
};

export const getDetailedComparison = async (ids: number[]): Promise<PokemonComparison> => {
  try {
    const response = await api.get('/pokemon/compare/detailed', {
      params: { ids: ids.join(',') }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting detailed comparison:', error);
    throw error;
  }
};

export const getDetailedComparisonWithOptions = async (request: ComparisonRequest): Promise<PokemonComparison> => {
  try {
    const response = await api.post('/pokemon/compare/detailed', request);
    return response.data;
  } catch (error) {
    console.error('Error getting detailed comparison with options:', error);
    throw error;
  }
};