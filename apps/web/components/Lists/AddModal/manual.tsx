"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Search, X } from "lucide-react";
import { Category, Vocabulary } from "@/lib/type";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ManualModal({
  categories,
  vocabulary,
  onVocabularySelect,
}: {
  categories: Category[];
  vocabulary: Vocabulary[];
  onVocabularySelect: (vocabulary: Vocabulary[]) => void;
}) {
  const [selectedVocabulary, setSelectedVocabulary] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    onVocabularySelect(
      selectedVocabulary.map(
        (id) => vocabulary.find((vocabulary) => vocabulary.id === id)!
      )
    );
  }, [selectedVocabulary]);

  const filteredVocabulary: Vocabulary[] = useMemo(() => {
    return vocabulary.filter((vocabulary) => {
      const matchesSearch =
        searchQuery === "" ||
        (vocabulary.name &&
          vocabulary.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (vocabulary.translation &&
          vocabulary.translation
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (vocabulary.pronunciation &&
          vocabulary.pronunciation
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });
  }, [vocabulary, searchQuery, filterCategory]);

  const toggleWordSelection = (id: string) => {
    setSelectedVocabulary((prev) =>
      prev.includes(id) ? prev.filter((wid) => wid !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    const filteredIds = filteredVocabulary
      .map((vocabulary) => vocabulary.id)
      .filter((id): id is string => id !== undefined);

    setSelectedVocabulary(filteredIds);
  };

  const deselectAll = () => {
    setSelectedVocabulary([]);
  };

  return (
    <div className="max-w-5xl">
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
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
          <Select
            value={filterCategory}
            onValueChange={(value) => setFilterCategory(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {filteredVocabulary.length} mot(s) affiché(s) •{" "}
            {selectedVocabulary.length} sélectionné(s)
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={selectAllFiltered}
              disabled={filteredVocabulary.length === 0}
              className="text-xs"
            >
              Tout sélectionner
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={deselectAll}
              disabled={selectedVocabulary.length === 0}
              className="text-xs"
            >
              Tout désélectionner
            </Button>
          </div>
        </div>
      </div>
      <div className="h-[350px] overflow-y-auto border border-gray-200 rounded-lg">
        {filteredVocabulary.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Search size={48} className="mx-auto mb-3 text-gray-300" />
            <p>Aucun mot trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-3">
            {filteredVocabulary.map((vocabulary: Vocabulary) => (
              <div
                key={vocabulary.id}
                onClick={() => toggleWordSelection(vocabulary.id)}
                className={`relative p-2 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedVocabulary.includes(vocabulary.id)
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                }`}
              >
                {selectedVocabulary.includes(vocabulary.id) && (
                  <div className="absolute top-1 right-1 bg-purple-600 text-white rounded-full p-0.5">
                    <Check size={10} />
                  </div>
                )}
                <div className="text-lg font-bold">
                  {vocabulary.translation}
                </div>
                {vocabulary.pronunciation && (
                  <div className="text-xs text-gray-600 truncate">
                    {vocabulary.pronunciation}
                  </div>
                )}
                <div className="text-sm text-gray-800 truncate">
                  {vocabulary.name}
                </div>
                {vocabulary.categories && vocabulary.categories.length > 0 && (
                  <div className="text-xs text-purple-600 mt-1 font-medium truncate">
                    {vocabulary.categories
                      .map((category) => category.name)
                      .join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
