"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Languages,
  Shuffle,
  List,
  BookOpen,
  Check,
  Search,
  X,
} from "lucide-react";
import { Category, CategoryNameOnly } from "@/types/categories";
import { Word } from "@/types/word";

export default function AddModal() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    words: [],
  });

  const [activeTab, setActiveTab] = useState("manual");
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [randomCount, setRandomCount] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [words, setWords] = useState<Word[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch("/api/words");
        const data = await response.json();

        setCategories(data.categories);
        setWords(data.words);
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };
    fetchWords();
  }, []);

  // Filtrage des mots avec recherche et catégorie
  const filteredWords = useMemo(() => {
    return words.filter((word) => {
      const matchesSearch =
        searchQuery === "" ||
        (word.word &&
          word.word.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (word.translation &&
          word.translation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (word.pronunciation &&
          word.pronunciation.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        filterCategory === "all" ||
        (word.categories as CategoryNameOnly[]).some(
          (cat) => cat.name === filterCategory
        );

      return matchesSearch && matchesCategory;
    });
  }, [words, searchQuery, filterCategory]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const toggleWordSelection = (id) => {
    setSelectedWords((prev) =>
      prev.includes(id) ? prev.filter((wid) => wid !== id) : [...prev, id]
    );
  };

  const toggleCategorySelection = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const selectAllFiltered = () => {
    const filteredIds = filteredWords.map((w) => w.id);
    setSelectedWords(filteredIds);
  };

  const deselectAll = () => {
    setSelectedWords([]);
  };

  const getSelectedWordsFromMethod = () => {
    switch (activeTab) {
      case "manual":
        return words.filter((w) => selectedWords.includes(w.id));
      case "category":
        return words.filter((w) => selectedCategories.includes(w.category));
      case "random":
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(randomCount, words.length));
      default:
        return [];
    }
  };

  const handleSubmit = async () => {
    try {
      const selectedWordsData = getSelectedWordsFromMethod();
      // Extraire uniquement les IDs des mots
      const wordIds = selectedWordsData.map((word) => word.id);

      const dataToSubmit = {
        name: formData.name,
        description: formData.description || "",
        words: wordIds, // Envoyer uniquement les IDs
        type: activeTab,
      };

      console.log("Données envoyées:", dataToSubmit);

      const response = await fetch("/api/lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la création de la liste"
        );
      }

      const result = await response.json();
      console.log("Liste créée avec succès:", result);

      // Réinitialiser le formulaire ou fermer la modal
      // onClose(); // Décommentez si vous avez une fonction onClose

      // Rafraîchir les listes si nécessaire
      // onListCreated(); // Décommentez si vous avez une fonction de rafraîchissement
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      // Afficher une notification d'erreur à l'utilisateur
      // toast.error(error.message); // Si vous utilisez react-hot-toast
    }
  };

  return (
    <div className="p-8">
      <Dialog>
        <DialogTrigger asChild>
          <button className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
            <span>Ajouter une liste</span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] flex flex-col p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 flex-shrink-0">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Languages className="w-6 h-6 text-white" />
                </div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Ajouter une liste
                </DialogTitle>
              </div>
              <DialogDescription className="text-indigo-50">
                Enrichissez votre vocabulaire japonais
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700"
                >
                  Nom *
                </Label>
                <Input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Vocabulaire quotidien"
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="description"
                  className="text-sm font-semibold text-gray-700"
                >
                  Description
                </Label>
                <Input
                  type="text"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Ex: Mots de base pour la conversation"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("manual")}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
                  activeTab === "manual"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List size={18} />
                Sélection manuelle
              </button>
              <button
                onClick={() => setActiveTab("category")}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
                  activeTab === "category"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <BookOpen size={18} />
                Par catégorie
              </button>
              <button
                onClick={() => setActiveTab("random")}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
                  activeTab === "random"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Shuffle size={18} />
                Aléatoire
              </button>
            </div>

            {/* Content Area */}
            <div className="space-y-3">
              {/* Manual Selection */}
              {activeTab === "manual" && (
                <>
                  {/* Search and Filter Bar */}
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
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="all">Toutes catégories</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
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

                  {/* Words Grid with Virtual Scrolling */}
                  <div className="h-[350px] overflow-y-auto border border-gray-200 rounded-lg">
                    {filteredWords.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Search
                          size={48}
                          className="mx-auto mb-3 text-gray-300"
                        />
                        <p>Aucun mot trouvé</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-3">
                        {filteredWords.map((word) => (
                          <div
                            key={word.id}
                            onClick={() => toggleWordSelection(word.id)}
                            className={`relative p-2 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedWords.includes(word.id)
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                            }`}
                          >
                            {selectedWords.includes(word.id) && (
                              <div className="absolute top-1 right-1 bg-purple-600 text-white rounded-full p-0.5">
                                <Check size={10} />
                              </div>
                            )}
                            <div className="text-lg font-bold">
                              {word.translation}
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                              {word.pronunciation}
                            </div>
                            <div className="text-sm text-gray-800 truncate">
                              {word.word}
                            </div>
                            <div className="text-xs text-purple-600 mt-1 font-medium truncate">
                              {word.categorie}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Category Selection */}
              {activeTab === "category" && (
                <>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">
                      {selectedCategories.length} catégorie(s) sélectionnée(s) •{" "}
                      {
                        words.filter((w) =>
                          selectedCategories.includes(w.categories)
                        ).length
                      }{" "}
                      mot(s)
                    </div>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
                      {categories.map((cat) => {
                        const count = words.filter((w) =>
                          w.categories?.some((c) => c.name === cat.name)
                        ).length;
                        return (
                          <div
                            key={cat.name}
                            onClick={() => toggleCategorySelection(cat)}
                            className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all text-center ${
                              selectedCategories.includes(cat)
                                ? "border-purple-500 bg-purple-50 shadow-md"
                                : "border-gray-200 hover:border-purple-300 hover:shadow"
                            }`}
                          >
                            {selectedCategories.includes(cat) && (
                              <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1">
                                <Check size={14} />
                              </div>
                            )}
                            <div className="text-lg font-bold capitalize mb-1">
                              {cat.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {count} mots
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Random Selection */}
              {activeTab === "random" && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Nombre de mots aléatoires
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      max={words.length}
                      value={randomCount}
                      onChange={(e) =>
                        setRandomCount(parseInt(e.target.value) || 1)
                      }
                      className="w-full"
                    />
                    <div className="mt-4 text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Total disponible:</strong> {words.length} mots
                      </p>
                      <p>
                        <strong>Sélection:</strong>{" "}
                        {Math.min(randomCount, words.length)} mots aléatoires
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        La sélection sera différente à chaque validation
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>💡 Astuce:</strong> Les mots seront sélectionnés
                      aléatoirement au moment de la création de la liste.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Selection Summary */}
            <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm font-semibold text-gray-700">
                📊 Résumé de la sélection:
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {activeTab === "manual" &&
                  `${selectedWords.length} mot(s) sélectionné(s)`}
                {activeTab === "category" &&
                  `${
                    words.filter((w) =>
                      selectedCategories.includes(w.categories)
                    ).length
                  } mot(s) dans ${selectedCategories.length} catégorie(s)`}
                {activeTab === "random" &&
                  `${Math.min(randomCount, words.length)} mot(s) aléatoire(s)`}
              </p>
            </div>
          </div>

          <DialogFooter className="bg-gray-50 p-6 gap-3 border-t flex-shrink-0">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-lg border-2 hover:bg-gray-100 transition-colors"
              >
                Annuler
              </Button>
            </DialogClose>
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.name ||
                (activeTab === "manual" && selectedWords.length === 0) ||
                (activeTab === "category" && selectedCategories.length === 0) ||
                (activeTab === "random" && randomCount <= 0)
              }
              className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer la liste
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
