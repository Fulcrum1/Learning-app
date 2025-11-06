"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Languages, Loader2, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "@/lib/constants";

type VocabularyInList = {
  id: string;
  listId: string;
  order: string;
  review: string;
  vocabulary: Vocabulary;
  vocabularyId: string;
};

type Vocabulary = {
  id: string;
  name: string;
  translation: string;
  pronunciation: string;
};

type VocabularyList = {
  id: string;
  name: string;
  description: string;
  VocabularyList: VocabularyInList[];
  user: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    VocabularyList: number;
  };
};

export default function ShowWords({ type, id }: { type: string; id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [vocabulary, setVocabulary] = useState<VocabularyList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/list/${id}`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des mots");
      }
      const data = await response.json();
      setVocabulary(data);
    } catch (err) {
      console.error("Error fetching words:", err);
      setError("Impossible de charger les mots. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // if (open && vocabulary.length === 0) {
    fetchWords();
    // }
  };

  return (
    <div className="p-2">
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <button className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            <Languages className="w-4 h-4" />
            <span>Afficher les mots</span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                  <Languages className="w-7 h-7 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-3xl font-bold text-white mb-1">
                    Vocabulaire
                  </DialogTitle>
                  <p className="text-white/80 text-sm">
                    {vocabulary
                      ? `${vocabulary.VocabularyList.length} mot${
                          vocabulary.VocabularyList.length > 1 ? "s" : ""
                        } disponible${vocabulary.VocabularyList.length > 1 ? "s" : ""}`
                      : "Chargement..."}
                  </p>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="p-6 bg-gradient-to-br from-gray-50 to-white max-h-[65vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center py-12">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
                <p className="text-gray-500 text-sm">Chargement des mots...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-12">
                <div className="p-4 bg-red-50 rounded-full mb-3">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-red-600 font-medium mb-1">{error}</p>
                <Button
                  onClick={fetchWords}
                  variant="outline"
                  size="sm"
                  className="mt-2 text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                >
                  Réessayer
                </Button>
              </div>
            ) : vocabulary && vocabulary.VocabularyList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {vocabulary.VocabularyList.map((element) => (
                  <div
                    key={element.vocabularyId}
                    className="group relative bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                    </div>

                    <div className="mb-3">
                      <div className="text-xl font-bold text-gray-900 mb-1">
                        {element.vocabulary.name}
                      </div>
                      <div className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md inline-block">
                        {element.vocabulary.pronunciation}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <div className="text-sm text-gray-600 font-medium">
                        {element.vocabulary.translation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-12">
                <div className="p-4 bg-gray-100 rounded-full mb-3">
                  <Languages className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Aucun mot trouvé</p>
                <p className="text-gray-400 text-sm mt-1">
                  Cette catégorie ne contient pas encore de mots.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="bg-gray-100 border-t border-gray-200 p-5">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-2 border-gray-300 hover:bg-white hover:border-gray-400 transition-all font-medium px-6"
              >
                Fermer
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
