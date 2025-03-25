'use client';

import { useState } from 'react';
import SimplifiedPokemonComparison from '../pokemonComparison';

export default function PokemonComparisonSelector() {
  const [selectedPokemonIds, setSelectedPokemonIds] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const handleAddPokemon = () => {
    const id = parseInt(inputValue);
    if (!isNaN(id) && id > 0 && selectedPokemonIds.length < 2) {
      setSelectedPokemonIds([...selectedPokemonIds, id]);
      setInputValue('');
    }
  };
  
  const handleRemovePokemon = (id: number) => {
    setSelectedPokemonIds(selectedPokemonIds.filter(pokemonId => pokemonId !== id));
  };
  
  return (
    <div className="mt-8 max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Selecione Pokémon para comparar</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite um ID (ex: 1 para Bulbasaur)"
            className="px-3 py-2 border rounded flex-grow"
          />
          <button 
            onClick={handleAddPokemon}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={selectedPokemonIds.length >= 2}
          >
            Adicionar
          </button>
        </div>
        
        {selectedPokemonIds.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedPokemonIds.map(id => (
              <div key={id} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                <span>#{id}</span>
                <button 
                  onClick={() => handleRemovePokemon(id)}
                  className="ml-2 text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-sm text-gray-500">
          {selectedPokemonIds.length < 2 
            ? `Selecione mais ${2 - selectedPokemonIds.length} Pokémon para comparar`
            : 'Pronto para comparar!'}
        </div>
      </div>
      
      {selectedPokemonIds.length === 2 && (
        <SimplifiedPokemonComparison pokemonIds={selectedPokemonIds} />
      )}
    </div>
  );
}