"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Search, X } from "lucide-react";
import { Words } from "@/lib/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ManualModal({
  words,
  onWordsSelect,
}: {
  words: Words[];
  onWordsSelect: (words: Words[]) => void;
}) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    onWordsSelect(
      selectedWords.map(
        (id) => words.find((word) => word.id === id)!
      )
    );
  }, [selectedWords]);

  const filteredWords: Words[] = useMemo(() => {
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
  }, [words, searchQuery, filterCategory]);

  const toggleWordSelection = (id: string) => {
    setSelectedWords((prev) =>
      prev.includes(id) ? prev.filter((wid) => wid !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    const filteredIds = filteredWords
      .map((word) => word.id)
      .filter((id): id is string => id !== undefined);

    setSelectedWords(filteredIds);
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
            {filteredWords.length} mot(s) affiché(s) •{" "}
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
        {filteredWords.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Search size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p>Aucun mot trouvé</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 p-3">
            {filteredWords.map((word: Words) => (
              <div
                key={word.id}
                onClick={() => toggleWordSelection(word.id)}
                className={`relative p-2 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedWords.includes(word.id)
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30"
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                {selectedWords.includes(word.id) && (
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