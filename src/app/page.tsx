"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2, Filter, ChevronDown, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ScrollToTop from "@/components/scrollToTop";
import { getPokemonList } from "@/services/pokemon";
import { PokemonResult } from "@/services/pokemon/models";

const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dark",
  "dragon",
  "steel",
  "fairy",
];

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    normal: "bg-gray-300",
    fire: "bg-orange-500",
    water: "bg-blue-500",
    grass: "bg-green-500",
    electric: "bg-yellow-400",
    ice: "bg-blue-200",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-amber-700",
    flying: "bg-indigo-300",
    psychic: "bg-pink-500",
    bug: "bg-lime-500",
    rock: "bg-stone-500",
    ghost: "bg-purple-700",
    dark: "bg-gray-700",
    dragon: "bg-indigo-700",
    steel: "bg-gray-400",
    fairy: "bg-pink-300",
  };
  return colors[type] || "bg-gray-300";
};

export default function Home() {
  const [pokemons, setPokemons] = useState<
    (PokemonResult & { types?: string[] })[]
  >([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loadingPokemonTypes, setLoadingPokemonTypes] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    loadPokemons();
  }, []);

  async function loadPokemons() {
    setLoading(true);
    const response = await getPokemonList(20, offset);
    if (response?.results) {
      const newPokemons = response.results.filter(
        (p) => !pokemons.some((old) => old.name === p.name)
      );

      setPokemons((prev) => [...prev, ...newPokemons]);
      setOffset((prev) => prev + 20);

      newPokemons.forEach((pokemon) => {
        fetchPokemonTypes(pokemon.name);
      });
    }
    setLoading(false);
  }

  async function fetchPokemonTypes(name: string) {
    setLoadingPokemonTypes((prev) => ({ ...prev, [name]: true }));
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await response.json();
      const types = data.types.map(
        (type: { type: { name: string } }) => type.type.name
      );

      setPokemons((prev) =>
        prev.map((p) => (p.name === name ? { ...p, types } : p))
      );
    } catch (error) {
      console.error(`Erro ao carregar tipos do Pokémon ${name}:`, error);
    }
    setLoadingPokemonTypes((prev) => ({ ...prev, [name]: false }));
  }

  const handleTypeSelect = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSearch("");
  };

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearch = pokemon.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType =
      selectedTypes.length === 0 ||
      (pokemon.types &&
        pokemon.types.some((type) => selectedTypes.includes(type)));
    return matchesSearch && matchesType;
  });

  function formatPokemonId(id: string) {
    return `#${id.padStart(3, "0")}`;
  }

  return (
    <div className="max-w-[1300px] mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Pokédex</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore todos os Pokémon e descubra suas informações
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Buscar Pokémon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                Filtrar por tipo
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-2 grid grid-cols-2 gap-1">
              {POKEMON_TYPES.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTypeSelect(type);
                  }}
                  className={`capitalize cursor-pointer ${
                    selectedTypes.includes(type) ? "bg-primary/20" : ""
                  }`}
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedTypes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500"
            >
              Limpar filtros
            </Button>
          )}
        </div>
      </div>

      {selectedTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedTypes.map((type) => (
            <Badge
              key={type}
              variant="outline"
              className="capitalize flex items-center gap-1"
            >
              {type}
              <button onClick={() => handleTypeSelect(type)}>
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {filteredPokemons.length === 0 && !loading ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">
            Nenhum Pokémon encontrado com os filtros selecionados.
          </p>
          <Button variant="outline" onClick={clearFilters} className="mt-4">
            Limpar filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredPokemons.map((pokemon) => {
            const parts = pokemon.url.split("/").filter(Boolean);
            const id = parts[parts.length - 1];
            const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

            return (
              <Link key={pokemon.name} href={`/details/${pokemon.name}`}>
                <Card
                  className={`hover:shadow-lg transition-all duration-300 overflow-hidden ${
                    pokemon.types && pokemon.types.length > 0
                      ? `border-t-4 ${getTypeColor(pokemon.types[0])}`
                      : ""
                  }`}
                >
                  <div className="relative pt-2 px-2">
                    <span className="absolute top-2 right-2 text-xs text-gray-500 font-mono">
                      {formatPokemonId(id)}
                    </span>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                      <Image
                        src={spriteUrl}
                        alt={pokemon.name}
                        className="w-32 h-32 object-contain hover:scale-110 transition-transform"
                        width={128}
                        height={128}
                        priority
                      />
                    </div>
                  </div>
                  <CardContent className="pt-4 pb-2">
                    <h3 className="font-semibold text-lg capitalize text-center">
                      {pokemon.name.replace(/-/g, " ")}
                    </h3>
                  </CardContent>
                  <CardFooter className="flex justify-center gap-2 pb-4">
                    {loadingPokemonTypes[pokemon.name] ? (
                      <div className="flex items-center">
                        <Loader2 size={16} className="animate-spin mr-2" />
                        <span className="text-xs">Carregando tipos...</span>
                      </div>
                    ) : (
                      pokemon.types?.map((type) => (
                        <Badge
                          key={type}
                          className={`capitalize ${getTypeColor(
                            type
                          )} text-white`}
                        >
                          {type}
                        </Badge>
                      ))
                    )}
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <div className="flex justify-center my-8">
        <Button
          onClick={loadPokemons}
          disabled={loading}
          className="px-6 py-2"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Carregando...
            </>
          ) : (
            "Carregar mais Pokémon"
          )}
        </Button>
      </div>

      <ScrollToTop />
    </div>
  );
}
