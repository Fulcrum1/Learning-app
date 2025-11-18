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

import { Plus, Shuffle, List, BookOpen, X } from "lucide-react";
import { Category, Vocabulary } from "@/lib/type";
import { BACKEND_URL } from "@/lib/constants";

import ManualModal from "./AddModal/manual";
import CategoryModal from "./AddModal/category";
import RandomModal from "./AddModal/random";
import { getSession } from "@/lib/session";

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
    name: String(""),
    description: String(""),
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
        const vocabularyIds: { id: string }[] = [];
        selectedCategories.forEach((category) => {
          category.vocabulary?.forEach((vocabulary) => {
            vocabularyIds.push({ id: vocabulary.id });
          });
        });
        return vocabularyIds;
      case "random":
        const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(randomCount, vocabulary.length));
      default:
        return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedWordsData = getSelectedWordsFromMethod();
      const vocabularyIds = selectedWordsData.map(
        (vocabulary) => vocabulary.id
      );

      const session = await getSession();

      const response = await fetch(`${BACKEND_URL}/list/${activeTab}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          userId: session?.user.id,
          vocabulary: vocabularyIds,
        }),
      });

      const result = await response.json();

      // Fermer la modale et réinitialiser le formulaire après un succès
      setOpen(false);
      setFormData({ name: "", description: "" });
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
    }
  };

  //   return (
  //     <Dialog open={open} onOpenChange={setOpen}>
  //       <DialogTrigger asChild>
  //         <Button variant="outline" size="sm" className="h-8 gap-1">
  //           <Plus className="h-3.5 w-3.5" />
  //           <span className="sr-only sm:not-sr-only">
  //             Ajouter une liste
  //           </span>
  //         </Button>
  //       </DialogTrigger>
  //       <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto dark:bg-gray-900">
  //         <DialogHeader>
  //           <DialogTitle>Créer une nouvelle liste</DialogTitle>
  //         </DialogHeader>

  //         <form onSubmit={(e) => handleSubmit(e)}>
  //           <div className="space-y-4 py-2">
  //             <div className="space-y-2">
  //               <Label htmlFor="name">Nom de la liste</Label>
  //               <Input
  //                 id="name"
  //                 placeholder="Ma liste de vocabulaire"
  //                 value={formData.name}
  //                 onChange={handleFormChange}
  //                 required
  //               />
  //             </div>

  //             <div className="space-y-2">
  //               <Label htmlFor="description">Description (optionnel)</Label>
  //               <Input
  //                 id="description"
  //                 placeholder="Description de la liste"
  //                 value={formData.description}
  //                 onChange={handleFormChange}
  //               />
  //               <div className="flex gap-2">
  //                 <button
  //                   type="button"
  //                   onClick={() => setActiveTab("manual")}
  //                   className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
  //                     activeTab === "manual"
  //                       ? "text-purple-600 border-b-2 border-purple-600"
  //                       : "text-gray-500 hover:text-gray-700"
  //                   }`}
  //                 >
  //                   <BookOpen size={18} />
  //                   Manuelle
  //                 </button>
  //                 <button
  //                   type="button"
  //                   onClick={() => setActiveTab("category")}
  //                   className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
  //                     activeTab === "category"
  //                       ? "text-purple-600 border-b-2 border-purple-600"
  //                       : "text-gray-500 hover:text-gray-700"
  //                   }`}
  //                 >
  //                   <List size={18} />
  //                   Catégorie
  //                 </button>
  //                 <button
  //                   type="button"
  //                   onClick={() => setActiveTab("random")}
  //                   className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
  //                     activeTab === "random"
  //                       ? "text-purple-600 border-b-2 border-purple-600"
  //                       : "text-gray-500 hover:text-gray-700"
  //                   }`}
  //                 >
  //                   <Shuffle size={18} />
  //                   Aléatoire
  //                 </button>
  //               </div>
  //             </div>
  //             <div className="space-y-3">
  //               {activeTab === "manual" && (
  //                 <ManualModal
  //                   categories={categories}
  //                   vocabulary={vocabulary}
  //                   onVocabularySelect={setSelectedVocabulary}
  //                 />
  //               )}
  //               {activeTab === "category" && (
  //                 <CategoryModal
  //                   categories={categories}
  //                   onCategorySelect={setSelectedCategories}
  //                 />
  //               )}
  //               {activeTab === "random" && vocabulary && (
  //                 <RandomModal
  //                   randomCount={randomCount}
  //                   maxRandomCount={vocabulary?.length || 0}
  //                   onCountChange={setRandomCount}
  //                 />
  //               )}
  //             </div>
  //           </div>
  //           <DialogFooter className="p-6 gap-3 border-t flex-shrink-0">
  //             <DialogClose asChild>
  //               <Button
  //                 type="button"
  //                 variant="outline"
  //                 className="rounded-lg border-2 transition-colors"
  //               >
  //                 Annuler
  //               </Button>
  //             </DialogClose>
  //             <Button
  //               type="submit"
  //               disabled={
  //                 !formData.name ||
  //                 (activeTab === "manual" && selectedVocabulary.length === 0) ||
  //                 (activeTab === "category" && selectedCategories.length === 0) ||
  //                 (activeTab === "random" && randomCount <= 0)
  //               }
  //               className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
  //             >
  //               <Plus className="w-4 h-4 mr-2" />
  //               Créer la liste
  //             </Button>
  //           </DialogFooter>
  //         </form>
  //       </DialogContent>
  //     </Dialog>
  //   );
  // }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 sm:h-10 gap-1 sm:gap-2"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Ajouter une liste</span>
          <span className="sm:hidden">Ajouter</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle liste</DialogTitle>
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 border-b">
              <button
                type="button"
                onClick={() => setActiveTab("manual")}
                className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 font-medium transition text-sm sm:text-base ${
                  activeTab === "manual"
                    ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50 sm:bg-transparent dark:bg-purple-900/20"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <BookOpen size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>Manuelle</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("category")}
                className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 font-medium transition text-sm sm:text-base ${
                  activeTab === "category"
                    ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50 sm:bg-transparent dark:bg-purple-900/20"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <List size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>Catégorie</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("random")}
                className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 font-medium transition text-sm sm:text-base ${
                  activeTab === "random"
                    ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50 sm:bg-transparent dark:bg-purple-900/20"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <Shuffle size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>Aléatoire</span>
              </button>
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
          </form>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto rounded-lg border-2 transition-colors"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!formData.name}
            className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer la liste
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
