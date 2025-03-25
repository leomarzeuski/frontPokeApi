'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { getEvolutionChain, getPokemonByName } from '@/services/pokemon';
import { ChainLink, EvolutionChain, Pokemon } from '@/services/pokemon/models';

export default function DetailsPage() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [currentSpriteIndex, setCurrentSpriteIndex] = useState(0);

  function formatId(id: number): string {
    return `#${id.toString().padStart(4, '0')}`;
  }

  function getSpeciesId(url: string): number {
    const parts = url.split('/').filter(Boolean);
    return Number(parts[parts.length - 1]);
  }

  function parseEvolutionChain(chain: ChainLink): { name: string; id: number }[] {
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
      audio.play().catch((err) => console.error('Erro ao reproduzir áudio:', err));
    }
  }

  function handleNextSprite() {
    setCurrentSpriteIndex((prev) => (prev + 1) % spriteList.length);
  }
  function handlePrevSprite() {
    setCurrentSpriteIndex((prev) => (prev === 0 ? spriteList.length - 1 : prev - 1));
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
        console.error('Erro ao buscar dados:', error);
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
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Carregando detalhes...</p>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Não foi possível carregar os dados.</p>
      </div>
    );
  }

  const spriteList = [
    pokemon.sprites.front_default,
    pokemon.sprites.back_default,
    pokemon.sprites.front_shiny,
    pokemon.sprites.back_shiny,
  ].filter(Boolean) as string[];

  const evolutionChainItems = evolutionChain ? parseEvolutionChain(evolutionChain.chain) : [];

  return (
    <div className="max-w-md mx-auto p-4 mt-8 bg-white rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-2 capitalize text-center">{pokemon.name}</h1>
      <p className="text-center text-gray-600 mb-4">{formatId(pokemon.id)}</p>

      {spriteList.length > 0 && (
        <div className="flex justify-center items-center mb-6">
          <button onClick={handlePrevSprite} className="mr-2">
            &#8592;
          </button>
          <div onClick={handlePlayAudio} className="cursor-pointer">
            <Image
              src={spriteList[currentSpriteIndex]}
              alt={pokemon.name}
              width={160}
              height={160}
              priority
            />
          </div>
          <button onClick={handleNextSprite} className="ml-2">
            &#8594;
          </button>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Habilidades</h2>
        <ul className="list-disc list-inside">
          {pokemon.abilities
            .filter((abilityObj) => !abilityObj.is_hidden)
            .map((abilityObj) => (
              <li key={abilityObj.ability.name} className="capitalize text-gray-700">
                {abilityObj.ability.name}
              </li>
            ))}
        </ul>

        <h2 className="text-xl font-semibold mb-2">Altura</h2>
        <p>{pokemon.height}</p>

        <h2 className="text-xl font-semibold mb-2">Tipos</h2>
        <ul className="list-disc list-inside">
          {pokemon.types.map(({ type }, index) => (
            <li key={index} className="capitalize text-gray-700">
              {type.name}
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mb-2">Peso</h2>
        <p>{pokemon.weight}</p>
      </div>

      {evolutionChainItems.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Evoluções</h2>
          <div className="flex flex-col gap-2">
            {evolutionChainItems.map(({ name: evoName, id: evoId }) => (
              <div key={evoName} className="border p-2 rounded capitalize">
                <Link href={`/details/${evoName}`}>
                  {evoName} {formatId(evoId)}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
