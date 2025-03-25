import api from "../api";
import { Generation, GenerationResponse } from "./models";

export const getGenerationByName = async (name: string): Promise<Generation> => {
  try {
    const response = await api.get(`/generations/${name.toLowerCase()}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching generation with name ${name}`, error);
    throw error;
  }
};

export const getGenerationList = async (): Promise<GenerationResponse> => {
  try {
    const response = await api.get(`/generations`);
    return response.data;
  } catch (error) {
    console.error("Error fetching generation list", error);
    throw error;
  }
};