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
import { Words } from "@/lib/type";
import { BACKEND_URL } from "@/lib/constants";

import ManualModal from "./AddModal/manual";
import RandomModal from "./AddModal/random";
import { getSession } from "@/lib/session";
import { apiRequest } from "@/lib/api-request";
import { useLanguage } from "@/components/Global/LanguageProvider";

export default function AddModal() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"manual" | "random">("manual");
  const [words, setWords] = useState<Words[]>([]);
  const [selectedWords, setSelectedWords] = useState<Words[]>([]);

  const [randomCount, setRandomCount] = useState(10);
  const [formData, setFormData] = useState({
    name: String(""),
  });

  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await getSession();
        const response = await apiRequest.get(
          `${BACKEND_URL}/api/words?language=${language}&userId=${session?.user.id}`,
        );
        const data = await response.json();
        console.log(data);
        setWords(data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (open) {
      fetchData();
    }
  }, [language]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
        return words.filter((word) => selectedWords.includes(word));
      case "random":
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(randomCount, words.length));
      default:
        return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedWordsData = getSelectedWordsFromMethod();
      const wordsIds = selectedWordsData.map((word) => word.id);

      const session = await getSession();

      const response = await apiRequest.post(
        `${BACKEND_URL}/list/${activeTab}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          method: "POST",
          body: JSON.stringify({
            name: formData.name,
            userId: session?.user.id,
            words: wordsIds,
          }),
        },
      );

      const result = await response.json();

      // Fermer la modale et réinitialiser le formulaire après un succès
      setOpen(false);
      setFormData({ name: "" });
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
    }
  };

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
                  words={words}
                  onWordsSelect={setSelectedWords}
                />
              )}
              {activeTab === "random" && words && (
                <RandomModal
                  randomCount={randomCount}
                  maxRandomCount={words?.length || 0}
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
