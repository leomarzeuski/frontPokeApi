'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Card, CardHeader } from "@/components/ui/card";
import ScrollToTop from "@/components/scrollToTop";
import { getPokemonList } from "@/services/pokemon";
import { PokemonResult } from "@/services/pokemon/models";


export default function Home() {
  const [pokemons, setPokemons] = useState<PokemonResult[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPokemons();
  }, []);

  async function loadPokemons() {
    setLoading(true);
    const response = await getPokemonList(20, offset);
    if (response?.results) {
      setPokemons((prev) => {
        const newPokemons = response.results.filter(
          (p) => !prev.some((old) => old.name === p.name)
        );
        return [...prev, ...newPokemons];
      });
      setOffset((prev) => prev + 20);
    }
    setLoading(false);
  }

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1300px] mx-auto p-4">
      <Input
        placeholder="Filtrar por nome..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredPokemons.map((pokemon) => {
          const parts = pokemon.url.split("/").filter(Boolean);
          const id = parts[parts.length - 1];
          const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
          return (
            <Link key={pokemon.name} href={`/details/${pokemon.name}`}>
              <Card>
                <CardHeader>
                  <Image
                    src={spriteUrl}
                    alt={pokemon.name}
                    className="w-full h-auto"
                    width={160}
                    height={160}
                    priority
                  />
                  <p className="capitalize">{pokemon.name}</p>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
      <div className="flex justify-center my-4">
        <button
          onClick={loadPokemons}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Carregando..." : "Carregar mais"}
        </button>
      </div>
      <ScrollToTop />
    </div>
  );
}
