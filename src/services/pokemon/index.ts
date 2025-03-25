import api from "../api";
import { Pokemon, PokemonResponse, PokemonSpecies, EvolutionChain } from "./models";

export const getPokemonByName = async (name: string): Promise<Pokemon> => {
  try {
    const response = await api.get(`/pokemon/${name.toLowerCase()}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pokemon with name ${name}`, error);
    throw error;
  }
};

export const getPokemonById = async (id: number): Promise<Pokemon> => {
  try {
    const response = await api.get(`/pokemon/id/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pokemon with id ${id}`, error);
    throw error;
  }
};

export const getAllPokemons = async (limit: number = 20, offset: number = 0): Promise<Pokemon[]> => {
  try {
    const response = await api.get(`/pokemon`, {
      params: { limit, offset }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all pokemons", error);
    throw error;
  }
};

export const getPokemonList = async (limit: number = 20, offset: number = 0): Promise<PokemonResponse> => {
  try {
    const response = await api.get(`/pokemon/list`, {
      params: { limit, offset }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pokemon list", error);
    throw error;
  }
};

export const getPokemonSpeciesByName = async (name: string): Promise<PokemonSpecies> => {
  try {
    const response = await api.get(`/pokemon/${name.toLowerCase()}/species`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching species for pokemon ${name}`, error);
    throw error;
  }
};

export const getPokemonSpeciesById = async (id: number): Promise<PokemonSpecies> => {
  try {
    const response = await api.get(`/pokemon/id/${id}/species`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching species for pokemon with id ${id}`, error);
    throw error;
  }
};

export const getEvolutionChain = async (name: string): Promise<EvolutionChain> => {
  try {
    const response = await api.get(`/pokemon/${name.toLowerCase()}/evolution-chain`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching evolution chain for pokemon ${name}`, error);
    throw error;
  }
};

export const getPokemonsByType = async (typeName: string): Promise<Pokemon[]> => {
  try {
    const response = await api.get(`/pokemon/type/${typeName.toLowerCase()}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pokemons of type ${typeName}`, error);
    throw error;
  }
};