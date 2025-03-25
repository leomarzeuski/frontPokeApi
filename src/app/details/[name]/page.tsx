"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { getEvolutionChain, getPokemonByName } from "@/services/pokemon";
import { ChainLink, EvolutionChain, Pokemon } from "@/services/pokemon/models";

export default function DetailsPage() {
  const router = useRouter();
  const { name } = useParams();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(
    null
  );
  const [currentSpriteIndex, setCurrentSpriteIndex] = useState(0);

  function formatId(id: number): string {
    return `#${id.toString().padStart(4, "0")}`;
  }

  function getSpeciesId(url: string): number {
    const parts = url.split("/").filter(Boolean);
    return Number(parts[parts.length - 1]);
  }

  function parseEvolutionChain(
    chain: ChainLink
  ): { name: string; id: number }[] {
    const speciesList: { name: string; id: number }[] = [];
    function traverse(node: ChainLink) {
      speciesList.push({
        name: node.species.name,
        id: getSpeciesId(node.species.url),
      });
      node.evolves_to.forEach((child) => traverse(child));
    }
    traverse(chain);
    return speciesList;
  }

  function handlePlayAudio() {
    if (pokemon) {
      const audioUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemon.id}.ogg`;
      const audio = new Audio(audioUrl);
      audio
        .play()
        .catch((err) => console.error("Erro ao reproduzir áudio:", err));
    }
  }

  function handleNextSprite() {
    setCurrentSpriteIndex((prev) => (prev + 1) % spriteList.length);
  }

  function handlePrevSprite() {
    setCurrentSpriteIndex((prev) =>
      prev === 0 ? spriteList.length - 1 : prev - 1
    );
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPokemonByName(name as string);
        if (data) {
          const sortedAbilities = data.abilities.sort((a, b) =>
            a.ability.name.localeCompare(b.ability.name)
          );
          setPokemon({ ...data, abilities: sortedAbilities });
        }
        const evolutionData = await getEvolutionChain(name as string);
        if (evolutionData) {
          setEvolutionChain(evolutionData);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    if (name) {
      fetchData();
    }
  }, [name]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-red-500 to-red-700">
        <div className="bg-white p-6 rounded-xl shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="animate-bounce">
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
            </div>
            <p className="text-lg font-bold text-gray-800">
              Carregando Pokémon...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-red-500 to-red-700">
        <div className="bg-white p-6 rounded-xl shadow-xl text-center">
          <p className="text-lg font-bold text-gray-800 mb-4">
            Pokémon não encontrado
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  const spriteList = [
    pokemon.sprites.front_default,
    pokemon.sprites.back_default,
    pokemon.sprites.front_shiny,
    pokemon.sprites.back_shiny,
  ].filter(Boolean) as string[];

  const evolutionChainItems = evolutionChain
    ? parseEvolutionChain(evolutionChain.chain)
    : [];

  const typeColorMap: Record<string, string> = {
    normal: "bg-gray-300",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-blue-200",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-yellow-700",
    flying: "bg-indigo-300",
    psychic: "bg-pink-500",
    bug: "bg-green-600",
    rock: "bg-yellow-600",
    ghost: "bg-purple-700",
    dragon: "bg-indigo-700",
    dark: "bg-gray-800",
    steel: "bg-gray-400",
    fairy: "bg-pink-300",
  };

  const mainType = pokemon.types[0]?.type.name || "normal";
  const bgColorClass = typeColorMap[mainType] || "bg-gray-200";
  const textColorClass = [
    "dark",
    "ghost",
    "dragon",
    "fighting",
    "poison",
  ].includes(mainType)
    ? "text-white"
    : "text-gray-800";

  return (
    <div className={`min-h-screen ${bgColorClass} pb-12`}>
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <Link
            href="/"
            className="bg-white/90 hover:bg-white text-gray-800 font-bold py-2 px-4 rounded-lg shadow transition duration-300"
          >
            Voltar para Home
          </Link>

          <div className="flex space-x-2">
            {pokemon.id > 1 && (
              <Link
                href={`/details/${pokemon.id - 1}`}
                className="bg-white/90 hover:bg-white text-gray-800 font-bold py-2 px-4 rounded-lg shadow transition duration-300"
              >
                Anterior
              </Link>
            )}
            <Link
              href={`/details/${pokemon.id + 1}`}
              className="bg-white/90 hover:bg-white text-gray-800 font-bold py-2 px-4 rounded-lg shadow transition duration-300"
            >
              Próximo
            </Link>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <div className={`bg-gray-100 p-8 relative`}>
            <div className="absolute top-2 right-2 bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full">
              {formatId(pokemon.id)}
            </div>
            <h1
              className={`text-4xl font-extrabold capitalize ${textColorClass} text-center mb-2`}
            >
              {pokemon.name}
            </h1>

            <div className="flex justify-center gap-2 mb-6">
              {pokemon.types.map(({ type }, index) => (
                <span
                  key={index}
                  className={`${
                    typeColorMap[type.name] || "bg-gray-200"
                  } text-white px-3 py-1 rounded-full text-sm font-semibold capitalize`}
                >
                  {type.name}
                </span>
              ))}
            </div>

            {spriteList.length > 0 && (
              <div className="flex justify-center items-center">
                <button
                  onClick={handlePrevSprite}
                  className="bg-white/30 hover:bg-white/50 text-gray-800 font-bold p-2 rounded-full mr-2"
                >
                  &#8592;
                </button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={handlePlayAudio}
                        className="cursor-pointer bg-white/30 rounded-full p-4 transition duration-300 hover:bg-white/50 hover:scale-105"
                      >
                        <Image
                          src={spriteList[currentSpriteIndex]}
                          alt={pokemon.name}
                          width={180}
                          height={180}
                          priority
                          className="w-44 h-44"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                        </svg>
                        <p>Clique para ouvir o som do Pokémon</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <button
                  onClick={handleNextSprite}
                  className="bg-white/30 hover:bg-white/50 text-gray-800 font-bold p-2 rounded-full ml-2"
                >
                  &#8594;
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div>
              <div className="bg-gray-50 p-6 rounded-xl shadow-md mb-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
                  Características
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-700">
                      Altura
                    </h3>
                    <p className="text-2xl font-bold">
                      {(pokemon.height / 10).toFixed(1)} m
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg text-gray-700">
                      Peso
                    </h3>
                    <p className="text-2xl font-bold">
                      {(pokemon.weight / 10).toFixed(1)} kg
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
                  Habilidades
                </h2>
                <ul className="space-y-2">
                  {pokemon.abilities
                    .filter((abilityObj) => !abilityObj.is_hidden)
                    .map((abilityObj) => (
                      <li
                        key={abilityObj.ability.name}
                        className="capitalize text-gray-700 bg-gray-100 py-2 px-4 rounded-md"
                      >
                        {abilityObj.ability.name}
                      </li>
                    ))}

                  {pokemon.abilities
                    .filter((abilityObj) => abilityObj.is_hidden)
                    .map((abilityObj) => (
                      <li
                        key={abilityObj.ability.name}
                        className="capitalize text-gray-700 bg-gray-100 py-2 px-4 rounded-md italic"
                      >
                        {abilityObj.ability.name} (Habilidade Oculta)
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {evolutionChainItems.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
                  Cadeia de Evolução
                </h2>
                <div className="space-y-4">
                  {evolutionChainItems.map(
                    ({ name: evoName, id: evoId }, index) => (
                      <div key={evoName} className="relative">
                        {index > 0 && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="h-4 w-0.5 bg-gray-400"></div>
                            <div className="text-gray-500 text-xs">↓</div>
                          </div>
                        )}
                        <Link
                          href={`/details/${evoName}`}
                          className={`block ${
                            name === evoName
                              ? `${bgColorClass} text-white`
                              : "bg-white hover:bg-gray-100"
                          } border border-gray-200 p-4 rounded-lg transition duration-300 shadow-sm`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="capitalize font-semibold">
                              {evoName}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatId(evoId)}
                            </span>
                          </div>
                        </Link>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
