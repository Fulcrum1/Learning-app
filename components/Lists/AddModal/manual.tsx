"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Search, X } from "lucide-react";
import { Word, Words } from "@/lib/type";
import { useForm } from "@/lib/list-form";

export default function ManualModal({ words }: { words: Word[] }) {
  const {
    selectedWords,
    setSelectedWords,
  } = useForm();
  
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWords: Word[] = useMemo(() => {
    return words.filter((word) => {
      const matchesSearch =
        searchQuery === "" ||
        (word.word &&
          word.word.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (word.translation &&
          word.translation
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (word.pronunciation &&
          word.pronunciation
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });
  }, [words, searchQuery]);

  useEffect(() => {
    console.log("selectedWords comp", selectedWords);
  }, [selectedWords]);

  const toggleWordSelection = (id: number) => {
    setSelectedWords((prev) =>
      prev.some((w) => w.id === id) 
        ? prev.filter((w) => w.id !== id) 
        : [...prev, words.find((w) => w.id === id)!],
    );
  };

  const selectAllFiltered = () => {
    setSelectedWords(filteredWords);
  };

  const deselectAll = () => {
    setSelectedWords([]);
  };

  return (
    <div className="max-w-5xl">
      <div className="p-4 rounded-lg space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              type="text"
              placeholder="Rechercher un mot, traduction ou prononciation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm ">
            {words.length} mot(s) affiché(s) •{" "}
            {selectedWords.length} sélectionné(s)
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={selectAllFiltered}
              disabled={filteredWords.length === 0}
              className="text-xs"
            >
              Tout sélectionner
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={deselectAll}
              disabled={selectedWords.length === 0}
              className="text-xs"
            >
              Tout désélectionner
            </Button>
          </div>
        </div>
      </div>
      <div className="h-[350px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        {words.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Search
              size={48}
              className="mx-auto mb-3 text-gray-300 dark:text-gray-600"
            />
            <p>Aucun mot trouvé</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 p-3">
            {words.map((word: Word) => (
              <div
                key={word.id}
                onClick={() => toggleWordSelection(word.id)}
                className={`relative p-2 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedWords.some((w) => w.id === word.id)
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30"
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                {selectedWords.some((w) => w.id === word.id) && (
                  <div className="absolute top-1 right-1 bg-purple-600 rounded-full p-0.5">
                    <Check size={10} className="text-white" />
                  </div>
                )}
                <div className="text-lg font-bold dark:text-white">
                  {word.word}
                </div>
                {word.pronunciation && (
                  <div className="text-xs whitespace-nowrap dark:text-gray-400">
                    {word.pronunciation}
                  </div>
                )}
                <div className="text-sm whitespace-nowrap dark:text-gray-300">
                  {word.translation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
