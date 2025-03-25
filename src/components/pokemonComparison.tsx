"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Ability, Pokemon, PokemonType } from "@/services/pokemon/models";
import { getTypeColor } from "@/utils/getTypeColor";

interface PokemonComparisonProps {
  pokemonIds: number[];
}

export default function SimplifiedPokemonComparison({
  pokemonIds,
}: PokemonComparisonProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (pokemonIds.length === 0) return;

      try {
        setLoading(true);
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonIds[0]}`
        );
        const firstPokemon = await response.json();

        const response2 = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonIds[1]}`
        );
        const secondPokemon = await response2.json();

        setPokemons([firstPokemon, secondPokemon]);
        setError(null);
      } catch (err) {
        console.error("Error fetching Pokémon data:", err);
        setError("Failed to load Pokémon data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pokemonIds]);

  if (loading) {
    return <div className="text-center p-5">Carregando dados...</div>;
  }

  if (error) {
    return <div className="text-center p-5 text-red-500">Erro: {error}</div>;
  }

  if (pokemons.length === 0) {
    return (
      <div className="text-center p-5">Selecione Pokémon para comparar</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Comparação de Pokémon</h2>

      <div className="grid grid-cols-2 gap-4">
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 mb-3">
                <Image
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold capitalize">
                {pokemon.name}
              </h3>
              <p className="text-gray-500">#{pokemon.id}</p>
            </div>

            <div className="mt-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Tipo:</div>
                <div className="flex gap-1">
                  {pokemon.types.map((typeInfo: PokemonType) => (
                    <span
                      key={typeInfo.type.name}
                      className="px-2 py-1 rounded text-xs text-white capitalize"
                      style={{
                        backgroundColor: getTypeColor(typeInfo.type.name),
                      }}
                    >
                      {typeInfo.type.name}
                    </span>
                  ))}
                </div>

                <div className="font-medium">Altura:</div>
                <div>{(pokemon.height / 10).toFixed(1)}m</div>

                <div className="font-medium">Peso:</div>
                <div>{(pokemon.weight / 10).toFixed(1)}kg</div>

                <div className="font-medium">Exp. Base:</div>
                <div>{pokemon.base_experience}</div>

                <div className="font-medium">Habilidades:</div>
                <div>
                  {pokemon.abilities.map((abilityInfo: Ability) => (
                    <div key={abilityInfo.ability.name} className="capitalize">
                      {abilityInfo.ability.name.replace(/-/g, " ")}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
