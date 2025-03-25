"use client";

import { useState } from "react";
import {
  generateStory,
  generatePokedexEntry,
  generateStrategy,
  getSimilarPokemon,
  getDetailedComparison,
} from "@/services/ai";
import {
  GeneratedContent,
  PokemonComparison,
  RecommendationResult,
} from "@/services/ai/model";
import { capitalizeFirst } from "@/utils/capitalizeLetters";
import { getTypeColor } from "@/utils/getTypeColor";
import { formatStatValue } from "@/utils/formatStatusValue";
import { getStatLabel } from "@/utils/getStatsLabel";
import { formatMarkdown } from "@/utils/formatMarkDown";

export default function PokemonAIPage() {
  const [activeTab, setActiveTab] = useState<
    "story" | "pokedex" | "strategy" | "recommend" | "compare"
  >("story");

  const [pokemonName, setPokemonName] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [targetAudience, setTargetAudience] = useState("all-ages");
  const [tone, setTone] = useState("informative");
  const [maxLength, setMaxLength] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [compareIds, setCompareIds] = useState<string>("1,4,7");

  const [storyResult, setStoryResult] = useState<GeneratedContent | null>(null);
  const [pokedexResult, setPokedexResult] = useState<GeneratedContent | null>(
    null
  );
  const [strategyResult, setStrategyResult] = useState<GeneratedContent | null>(
    null
  );
  const [recommendResult, setRecommendResult] =
    useState<RecommendationResult | null>(null);
  const [compareResult, setCompareResult] = useState<PokemonComparison | null>(
    null
  );

  const handleGenerateStory = async () => {
    if (!pokemonName) {
      setError("Please enter a Pokémon name");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await generateStory(pokemonName, {
        targetAudience,
        tone,
        maxLength: Number(maxLength),
        format: "markdown",
      });
      setStoryResult(result);
    } catch (err) {
      setError("Failed to generate story. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePokedex = async () => {
    if (!pokemonName) {
      setError("Please enter a Pokémon name");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await generatePokedexEntry(pokemonName, {
        targetAudience,
        tone,
        maxLength: Number(maxLength),
        format: "markdown",
      });
      setPokedexResult(result);
    } catch (err) {
      setError("Failed to generate Pokédex entry. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateStrategy = async () => {
    if (!teamMembers && !pokemonName) {
      setError("Please enter at least one Pokémon name");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await generateStrategy({
        team: teamMembers || undefined,
        pokemon: !teamMembers ? pokemonName : undefined,
        targetAudience,
        tone,
        maxLength: Number(maxLength),
        format: "markdown",
      });
      setStrategyResult(result);
    } catch (err) {
      setError("Failed to generate strategy. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetRecommendations = async () => {
    if (!pokemonName) {
      setError("Please enter a Pokémon name");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await getSimilarPokemon({
        pokemonName,
        limit: 5,
        similarityStrategy: "balanced",
      });
      setRecommendResult(result);
    } catch (err) {
      setError("Failed to get recommendations. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!compareIds) {
      setError("Please enter Pokémon IDs to compare");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const idList = compareIds.split(",").map((id) => parseInt(id.trim()));
      const result = await getDetailedComparison(idList);
      setCompareResult(result);
    } catch (err) {
      setError("Failed to compare Pokémon. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Pokémon AI Assistant
      </h1>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "story"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("story")}
        >
          Story Generator
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "pokedex"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("pokedex")}
        >
          Pokédex Entry
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "strategy"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("strategy")}
        >
          Battle Strategy
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "recommend"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("recommend")}
        >
          Similar Pokémon
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "compare"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("compare")}
        >
          Compare Pokémon
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow">
          {activeTab === "story" && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Generate a Pokémon Story
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Pokémon Name</label>
                <input
                  type="text"
                  value={pokemonName}
                  onChange={(e) => setPokemonName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., Charizard"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="children">Children</option>
                  <option value="all-ages">All Ages</option>
                  <option value="adults">Adults</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="informative">Informative</option>
                  <option value="humorous">Humorous</option>
                  <option value="dramatic">Dramatic</option>
                  <option value="adventurous">Adventurous</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Max Length</label>
                <input
                  type="number"
                  value={maxLength}
                  onChange={(e) => setMaxLength(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                  min="100"
                  max="2000"
                />
              </div>

              <button
                onClick={handleGenerateStory}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isLoading ? "Generating..." : "Generate Story"}
              </button>
            </>
          )}

          {activeTab === "pokedex" && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Generate a Pokédex Entry
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Pokémon Name</label>
                <input
                  type="text"
                  value={pokemonName}
                  onChange={(e) => setPokemonName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., Eevee"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="informative">Scientific</option>
                  <option value="humorous">Humorous</option>
                  <option value="dramatic">Mysterious</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Max Length</label>
                <input
                  type="number"
                  value={maxLength}
                  onChange={(e) => setMaxLength(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                  min="100"
                  max="1500"
                />
              </div>

              <button
                onClick={handleGeneratePokedex}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isLoading ? "Generating..." : "Generate Pokédex Entry"}
              </button>
            </>
          )}

          {activeTab === "strategy" && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Generate a Battle Strategy
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  For a Team (comma-separated)
                </label>
                <input
                  type="text"
                  value={teamMembers}
                  onChange={(e) => setTeamMembers(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., Charizard, Blastoise, Venusaur"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Or for a single Pokémon
                </label>
                <input
                  type="text"
                  value={pokemonName}
                  onChange={(e) => setPokemonName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., Pikachu"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="beginners">Beginners</option>
                  <option value="all-levels">All Levels</option>
                  <option value="competitive">Competitive Players</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Max Length</label>
                <input
                  type="number"
                  value={maxLength}
                  onChange={(e) => setMaxLength(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                  min="200"
                  max="2000"
                />
              </div>

              <button
                onClick={handleGenerateStrategy}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isLoading ? "Generating..." : "Generate Strategy"}
              </button>
            </>
          )}

          {activeTab === "recommend" && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Find Similar Pokémon
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Pokémon Name</label>
                <input
                  type="text"
                  value={pokemonName}
                  onChange={(e) => setPokemonName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., Dragonite"
                />
              </div>

              <button
                onClick={handleGetRecommendations}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isLoading ? "Finding..." : "Find Similar Pokémon"}
              </button>
            </>
          )}

          {activeTab === "compare" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Compare Pokémon</h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Pokémon IDs (comma-separated)
                </label>
                <input
                  type="text"
                  value={compareIds}
                  onChange={(e) => setCompareIds(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., 1,4,7"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter 2-3 Pokémon National Dex IDs
                </p>
              </div>

              <button
                onClick={handleCompare}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isLoading ? "Comparing..." : "Compare Pokémon"}
              </button>
            </>
          )}
        </div>

        <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow">
          {activeTab === "story" && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                {storyResult ? storyResult.title : "Story Result"}
              </h2>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : storyResult ? (
                <div className="prose max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(storyResult.content),
                    }}
                  />
                </div>
              ) : (
                <div className="text-gray-500 italic text-center py-12">
                  Generated story will appear here
                </div>
              )}
            </>
          )}

          {activeTab === "pokedex" && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                {pokedexResult ? pokedexResult.title : "Pokédex Entry"}
              </h2>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : pokedexResult ? (
                <div className="prose max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(pokedexResult.content),
                    }}
                  />
                </div>
              ) : (
                <div className="text-gray-500 italic text-center py-12">
                  Generated Pokédex entry will appear here
                </div>
              )}
            </>
          )}

          {activeTab === "strategy" && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                {strategyResult ? strategyResult.title : "Battle Strategy"}
              </h2>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : strategyResult ? (
                <div className="prose max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(strategyResult.content),
                    }}
                  />
                </div>
              ) : (
                <div className="text-gray-500 italic text-center py-12">
                  Generated battle strategy will appear here
                </div>
              )}
            </>
          )}

          {activeTab === "recommend" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Similar Pokémon</h2>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : recommendResult ? (
                <div>
                  <div className="mb-4">
                    <h3 className="font-medium text-lg">
                      Based on {recommendResult.basePokemon.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      {recommendResult.basePokemon.types.map((type) => (
                        <span
                          key={type.type.name}
                          className="px-2 py-1 rounded text-white text-sm"
                          style={{
                            backgroundColor: getTypeColor(type.type.name),
                          }}
                        >
                          {capitalizeFirst(type.type.name)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendResult.similarPokemon.map((pokemon) => (
                      <div
                        key={pokemon.id}
                        className="bg-gray-50 p-4 rounded-lg border flex gap-4"
                      >
                        {pokemon.sprites.frontDefault && (
                          <img
                            src={pokemon.sprites.frontDefault}
                            alt={pokemon.name}
                            className="w-20 h-20 object-contain"
                          />
                        )}
                        <div>
                          <h4 className="font-medium">
                            {capitalizeFirst(pokemon.name)}
                          </h4>
                          <div className="flex items-center gap-2 mb-2">
                            {pokemon.types.map((type) => (
                              <span
                                key={type.type.name}
                                className="px-2 py-1 rounded text-white text-xs"
                                style={{
                                  backgroundColor: getTypeColor(type.type.name),
                                }}
                              >
                                {capitalizeFirst(type.type.name)}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-700 mb-1">
                            Height: {pokemon.height / 10}m
                          </p>
                          <p className="text-sm text-gray-700">
                            Weight: {pokemon.weight / 10}kg
                          </p>
                          {recommendResult.explanations[pokemon.id] && (
                            <p className="text-sm text-gray-600 mt-2 italic">
                              {recommendResult.explanations[pokemon.id]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 italic text-center py-12">
                  Similar Pokémon recommendations will appear here
                </div>
              )}
            </>
          )}

          {activeTab === "compare" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Pokémon Comparison</h2>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : compareResult ? (
                <div>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="font-medium">Attribute</div>
                    {compareResult.pokemons.map((pokemon) => (
                      <div key={pokemon.id} className="text-center">
                        {pokemon.sprites.frontDefault && (
                          <img
                            src={pokemon.sprites.frontDefault}
                            alt={pokemon.name}
                            className="w-24 h-24 mx-auto object-contain"
                          />
                        )}
                        <h4 className="font-medium">
                          {capitalizeFirst(pokemon.name)}
                        </h4>
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          {pokemon.types.map((type) => (
                            <span
                              key={type.type.name}
                              className="px-2 py-1 rounded text-white text-xs"
                              style={{
                                backgroundColor: getTypeColor(type.type.name),
                              }}
                            >
                              {capitalizeFirst(type.type.name)}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="font-medium text-lg mb-2">Base Stats</h3>
                  <div className="mb-6">
                    {["height", "weight", "baseExperience"].map((stat) => (
                      <div
                        key={stat}
                        className="grid grid-cols-4 gap-4 py-2 border-b"
                      >
                        <div className="font-medium">{getStatLabel(stat)}</div>
                        {compareResult.pokemons.map((pokemon) => {
                          const statValue =
                            compareResult.statComparison[stat][pokemon.id];
                          const isHighest =
                            compareResult.statComparison.highest[stat] ===
                            pokemon.id;
                          const isLowest =
                            compareResult.statComparison.lowest[stat] ===
                            pokemon.id;

                          return (
                            <div
                              key={pokemon.id}
                              className="text-center relative"
                            >
                              <span
                                className={
                                  isHighest
                                    ? "text-green-600 font-bold"
                                    : isLowest
                                    ? "text-red-600"
                                    : ""
                                }
                              >
                                {formatStatValue(stat, statValue)}
                              </span>
                              <div className="w-full bg-gray-200 h-2 mt-1 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{
                                    width: `${
                                      compareResult.statComparison
                                        .normalizedValues[stat][pokemon.id] *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  <h3 className="font-medium text-lg mb-2">
                    Type Effectiveness
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {compareResult.pokemons.map((pokemon) => {
                      const effectiveness =
                        compareResult.typeEffectiveness[pokemon.id];
                      return (
                        <div key={pokemon.id} className="border p-4 rounded-lg">
                          <h4 className="font-medium mb-2">
                            {capitalizeFirst(pokemon.name)}
                          </h4>

                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-600">
                              Strong Against:
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {effectiveness.strongAgainst.length > 0 ? (
                                effectiveness.strongAgainst.map((type) => (
                                  <span
                                    key={type}
                                    className="px-2 py-1 rounded text-white text-xs"
                                    style={{
                                      backgroundColor: getTypeColor(type),
                                    }}
                                  >
                                    {capitalizeFirst(type)}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-gray-500 italic">
                                  None
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-600">
                              Weak Against:
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {effectiveness.weakAgainst.length > 0 ? (
                                effectiveness.weakAgainst.map((type) => (
                                  <span
                                    key={type}
                                    className="px-2 py-1 rounded text-white text-xs"
                                    style={{
                                      backgroundColor: getTypeColor(type),
                                    }}
                                  >
                                    {capitalizeFirst(type)}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-gray-500 italic">
                                  None
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 italic text-center py-12">
                  Pokémon comparison will appear here
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
