import api from "../api";
import { Pokemon } from "../pokemon/models";
import { SearchParams } from "./models";

export const searchPokemonsByTypes = async (types: string[]): Promise<Pokemon[]> => {
  try {
    const response = await api.get(`/search/types`, {
      params: { types: types.join(',') }
    });
    return response.data;
  } catch (error) {
    console.error(`Error searching pokemons by types ${types}`, error);
    throw error;
  }
};

export const getPokemonSortedByAttribute = async (
  attribute: string,
  ascending: boolean = true
): Promise<Pokemon[]> => {
  try {
    const response = await api.get(`/search/sort`, {
      params: { attribute, ascending }
    });
    return response.data;
  } catch (error) {
    console.error(`Error getting pokemons sorted by ${attribute}`, error);
    throw error;
  }
};

export const getRandomPokemon = async (maxId: number = 898): Promise<Pokemon> => {
  try {
    const response = await api.get(`/search/random`, {
      params: { maxId }
    });
    return response.data;
  } catch (error) {
    console.error("Error getting random pokemon", error);
    throw error;
  }
};

export const advancedSearch = async (params: SearchParams): Promise<Pokemon[]> => {
  try {
    if (params.types && params.types.length > 0) {
      return await searchPokemonsByTypes(params.types);
    } else if (params.attribute) {
      return await getPokemonSortedByAttribute(params.attribute, params.ascending);
    } else {
      const randomPokemon = await getRandomPokemon(params.maxId);
      return [randomPokemon];
    }
  } catch (error) {
    console.error("Error in advanced search", error);
    throw error;
  }
};