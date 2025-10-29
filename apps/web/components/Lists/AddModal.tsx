"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Shuffle, List, BookOpen } from "lucide-react";
import { Category, Vocabulary } from "@/lib/type";
import { BACKEND_URL } from "@/lib/constants";
import ManualModal from "./AddModal/manual";
import CategoryModal from "./AddModal/category";
import RandomModal from "./AddModal/random";

export default function AddModal() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"manual" | "category" | "random">(
    "manual"
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [selectedVocabulary, setSelectedVocabulary] = useState<Vocabulary[]>(
    []
  );
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [randomCount, setRandomCount] = useState(10);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/list/vocabulary-category`);
        const data = await response.json();
        setCategories(data.categories || []);
        setVocabulary(data.vocabulary || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const getSelectedWordsFromMethod = () => {
    switch (activeTab) {
      case "manual":
        return vocabulary.filter((vocabulary) =>
          selectedVocabulary.includes(vocabulary)
        );
      case "category":
        return vocabulary.filter(
          (vocabulary) =>
            vocabulary.categories &&
            vocabulary.categories.some(
              (cat) => categories.find((category) => category === cat)?.name
            )
        );
      case "random":
        const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(randomCount, vocabulary.length));
      default:
        return [];
    }
  };

  const handleSubmit = async () => {
    console.log(formData);
  };
  // const handleSubmit = async () => {
  //   try {
  //     const selectedWordsData = getSelectedWordsFromMethod();
  //     const vocabularyIds = selectedWordsData.map(
  //       (vocabulary) => vocabulary.id
  //     );

  //     const dataToSubmit = {
  //       name: formData.name,
  //       description: formData.description || "",
  //       vocabulary: vocabularyIds,
  //       type: activeTab,
  //     };

  //     const response = await fetch(`${BACKEND_URL}/lists/${activeTab}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(dataToSubmit),
  //     });
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(
  //         errorData.error || "Erreur lors de la création de la liste"
  //       );
  //     }
  //     const result = await response.json();
  //     console.log("Liste créée avec succès:", result);
  //   } catch (error) {
  //     console.error("Erreur lors de l'envoi:", error);
  //   }
  // };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Plus className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Ajouter une liste
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle liste</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la liste</Label>
              <Input
                id="name"
                placeholder="Ma liste de vocabulaire"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Input
                id="description"
                placeholder="Description de la liste"
                value={formData.description}
                onChange={handleFormChange}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("manual")}
                  className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
                    activeTab === "manual"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <BookOpen size={18} />
                  Manuelle
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("category")}
                  className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
                    activeTab === "category"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List size={18} />
                  Catégorie
                </button>
                <button
                  type="button"
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
            </div>
            <div className="space-y-3">
              {activeTab === "manual" && (
                <ManualModal
                  categories={categories}
                  vocabulary={vocabulary}
                  onVocabularySelect={setSelectedVocabulary}
                />
              )}
              {activeTab === "category" && (
                <CategoryModal
                  categories={categories}
                  onCategorySelect={setSelectedCategories}
                />
              )}
              {activeTab === "random" && vocabulary && (
                <RandomModal
                  randomCount={randomCount}
                  maxRandomCount={vocabulary?.length || 0}
                  onCountChange={setRandomCount}
                />
              )}
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
              type="submit"
              disabled={
                !formData.name ||
                (activeTab === "manual" && selectedVocabulary.length === 0) ||
                (activeTab === "category" && selectedCategories.length === 0) ||
                (activeTab === "random" && randomCount <= 0)
              }
              className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer la liste
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
