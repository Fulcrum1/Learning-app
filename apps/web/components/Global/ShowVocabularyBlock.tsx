"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BACKEND_URL } from "@/lib/constants";
import {
  Languages,
  Loader2,
  BookOpen,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { getSession } from "@/lib/session";

type VocabularyItem = {
  id: string;
  name: string;
  translation: string;
  pronunciation: string;
};

type VocabularyResponse = {
  vocabulary: VocabularyItem[];
  knowVocabulary: { vocabularyId: string }[];
  learnVocabulary: { vocabularyId: string }[];
  unknownVocabulary: { vocabularyId: string }[];
};

export default function ShowWords({
  children,
  type,
}: {
  children: React.ReactNode;
  type: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [vocabulary, setVocabulary] = useState<VocabularyResponse>({
    vocabulary: [],
    knowVocabulary: [],
    learnVocabulary: [],
    unknownVocabulary: [],
  });
  const [selectedCategory, setSelectedCategory] = useState<string>(type);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await getSession();
      const response = await fetch(`${BACKEND_URL}/vocabulary`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
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
    if (open && vocabulary.vocabulary.length === 0) {
      fetchWords();
    }
  };

  // Fonction pour mapper les IDs aux objets complets
  const getVocabularyByIds = (ids: { vocabularyId: string }[]) => {
    return vocabulary.vocabulary.filter((item) =>
      ids.some((idObj) => idObj.vocabularyId === item.id)
    );
  };

  // Récupère les mots selon la catégorie sélectionnée
  const getFilteredVocabulary = () => {
    switch (selectedCategory) {
      case "mastered":
        return getVocabularyByIds(vocabulary.knowVocabulary);
      case "learning":
        return getVocabularyByIds(vocabulary.learnVocabulary);
      case "toReview":
        return getVocabularyByIds(vocabulary.unknownVocabulary);
      default:
        return vocabulary.vocabulary;
    }
  };

  return (
    <div className="p-2">
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <div className="cursor-pointer">{children}</div>
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
                    {vocabulary.vocabulary.length > 0
                      ? `${vocabulary.vocabulary.length} mot${
                          vocabulary.vocabulary.length > 1 ? "s" : ""
                        } disponible${vocabulary.vocabulary.length > 1 ? "s" : ""}`
                      : "Chargement..."}
                  </p>
                </div>
              </div>
            </DialogHeader>
          </div>
          <div className="border-b">
            <div className="flex gap-2 flex-wrap pb-4 ml-4">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className={selectedCategory === "all" ? "bg-slate-800" : ""}
              >
                Tous ({vocabulary.vocabulary.length})
              </Button>
              <Button
                variant={
                  selectedCategory === "mastered" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory("mastered")}
                className={
                  selectedCategory === "mastered"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }
              >
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Appris ({vocabulary.knowVocabulary.length})
              </Button>
              <Button
                variant={
                  selectedCategory === "learning" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory("learning")}
                className={
                  selectedCategory === "learning"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : ""
                }
              >
                <BookOpen className="mr-1 h-3 w-3" />
                En cours ({vocabulary.learnVocabulary.length})
              </Button>
              <Button
                variant={
                  selectedCategory === "toReview" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory("toReview")}
                className={
                  selectedCategory === "toReview"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : ""
                }
              >
                <Clock className="mr-1 h-3 w-3" />
                À apprendre ({vocabulary.unknownVocabulary.length})
              </Button>
            </div>
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
            ) : vocabulary.vocabulary.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {getFilteredVocabulary().map((element) => (
                  <div
                    key={element.id}
                    className="group relative bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="mb-3">
                      <div className="text-xl font-bold text-gray-900 mb-1">
                        {element.translation}
                      </div>
                      <div className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md inline-block">
                        {element.pronunciation}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <div className="text-sm text-gray-600 font-medium">
                        {element.name}
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
