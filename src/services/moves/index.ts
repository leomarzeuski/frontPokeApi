import api from "../api";
import { Move, MoveResponse } from "./models";

export const getMoveByName = async (name: string): Promise<Move> => {
  try {
    const response = await api.get(`/moves/${name.toLowerCase()}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching move with name ${name}`, error);
    throw error;
  }
};

export const getMoveById = async (id: number): Promise<Move> => {
  try {
    const response = await api.get(`/moves/id/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching move with id ${id}`, error);
    throw error;
  }
};

export const getMoveList = async (limit: number = 20, offset: number = 0): Promise<MoveResponse> => {
  try {
    const response = await api.get(`/moves`, {
      params: { limit, offset }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching move list", error);
    throw error;
  }
};