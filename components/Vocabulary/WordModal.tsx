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
import { useEffect, useState } from "react";
import { Plus, Languages, FileText } from "lucide-react";
import { BACKEND_URL } from "@/lib/constants";
import { getSession } from "@/lib/session";
import { apiRequest } from "@/lib/api-request";
import { useLanguage } from "../Global/LanguageProvider";
import { BaseResponse } from "@/lib/type";

interface FormData {
  word: string;
  translation: string;
  pronunciation?: string;
}

function SingleWord({
  formData,
  handleChange,
}: {
  formData: FormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}) {
  const { language } = useLanguage();

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label
          htmlFor="word"
          className="text-sm font-semibold text-gray-700 flex items-center gap-2"
        >
          Mot
        </Label>
        <Input
          id="word"
          value={formData.word}
          onChange={handleChange}
          placeholder="Ex: Bonjour"
          className="border-2 border-gray-200 focus:border-indigo-500 rounded-lg transition-colors"
        />
      </div>
      <div className="pt-2 border-t-2 border-gray-100">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="translation"
              className="text-sm font-semibold text-gray-700"
            >
              Traduction
            </Label>
            <Input
              id="translation"
              value={formData.translation}
              onChange={handleChange}
              placeholder={`Ex: ${language === "JP" ? "今日は" : "Hello"}`}
              className="border-2 border-gray-200 focus:border-purple-500 rounded-lg transition-colors text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="pronunciation"
              className="text-sm font-semibold text-gray-700"
            >
              Prononciation
            </Label>
            <Input
              id="pronunciation"
              value={formData.pronunciation}
              onChange={handleChange}
              placeholder={`Ex: ${language === "JP" ? "こんにちは" : "Hello"}`}
              className="border-2 border-gray-200 focus:border-purple-500 rounded-lg transition-colors text-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MultipleWords({
  bulkText,
  setBulkText,
}: {
  bulkText: string;
  setBulkText: (text: string) => void;
}) {
  const { language } = useLanguage();
  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          📝 Format attendu
        </h3>
        <p className="text-xs text-gray-700 mb-2">
          Collez votre texte contenant les vocabulaires à ajouter. Chaque ligne
          représente un mot.
        </p>
        <div className="rounded p-2 text-xs font-mono text-gray-600">
          Exemple :{" "}
          {language === "JP"
            ? "今日(きょう);aujourd'hui ou encore 今日(kyō);aujourd'hui"
            : "Hello();Bonjour ou encore Hello(é·lo);Bonjour"}
        </div>
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="bulkText"
          className="text-sm font-semibold text-gray-700 flex items-center gap-2"
        >
          📄 Texte à analyser
        </Label>
        <textarea
          id="bulkText"
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          placeholder="Collez ici votre texte contenant plusieurs vocabulaires..."
          className="w-full min-h-[280px] p-4 border-2 border-gray-200 focus:border-purple-500 rounded-lg transition-colors resize-none text-sm"
        />
      </div>
    </div>
  );
}

export default function WordModal({
  wordId,
  type,
}: {
  wordId?: number;
  type: "add" | "update";
}) {
  const [mode, setMode] = useState("single");
  const [formData, setFormData] = useState({
    word: "",
    translation: "",
    pronunciation: "",
  });
  const [bulkText, setBulkText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  useEffect(() => {
    if (type === "update" && wordId && open) {
      const fetchWord = async () => {
        const response = (await apiRequest.get(
          `${BACKEND_URL}/api/word/${wordId}`,
        )) as BaseResponse;
        const data = response.data as any;
        setFormData(data);
      };
      fetchWord();
    }
  }, [type, wordId, open]);

  const parserTexte = (text: string) => {
    const lines = text.trim().split("\n");

    return lines.map((line) => {
      const [translationPronunciation, word] = line.split(";");
      const [translation, pronunciation] = translationPronunciation?.split(
        "(",
      ) || [null, null];
      const pronunciationClean = pronunciation
        ? pronunciation.replace(")", "").trim()
        : null;
      const translationClean = translation?.trim() || "";
      return {
        word: word?.trim() || "",
        translation: translationClean,
        pronunciation: pronunciationClean,
      };
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      if (type === "update" && wordId) {
        const response = await apiRequest.put(
          `${BACKEND_URL}/api/word/${wordId}`,
          {
            word: formData.word,
            translation: formData.translation,
            pronunciation: formData.pronunciation || null,
          },
        );
        return;
      }

      if (mode === "single") {
        const response = await apiRequest.post(`${BACKEND_URL}/api/word`, {
          word: formData.word,
          translation: formData.translation,
          pronunciation: formData.pronunciation || null,
          language: language,
        });

        const responseData = await response;
        if (!responseData) {
          throw new Error("Erreur lors de l'ajout du vocabulaire");
        }

        setFormData({
          word: "",
          translation: "",
          pronunciation: "",
        });
      } else {
        const parsedWords = parserTexte(bulkText);

        if (parsedWords.length === 0) {
          throw new Error("Aucun vocabulaire valide à importer");
        }

        const response = await apiRequest.post(`${BACKEND_URL}/api/words`, {
          words: parsedWords,
          language: language,
        });

        const responseData = await response;
        if (!responseData) {
          throw new Error("Erreur lors de l'ajout des vocabulaires");
        }

        setBulkText("");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout des vocabulaires:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {type === "update" ? (
            <Button variant="outline" className="text-sm">
              Modifier
            </Button>
          ) : (
            <Button variant="outline">
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
              <span>Ajouter un mot</span>
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] overflow-hidden border-0 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg">
                <Languages className="w-6 h-6" />
              </div>
              <DialogTitle className="text-2xl font-bold">
                {type === "add" ? "Ajouter des mots" : "Modifier un mot"}
              </DialogTitle>
            </div>
            <DialogDescription>
              {type === "add"
                ? "Enrichissez votre collection de mots japonais"
                : "Modifiez les informations du mot"}
            </DialogDescription>
          </DialogHeader>
          {type === "add" && (
            <div className="px-6 pt-6">
              <div className="flex gap-3 p-1 rounded-lg">
                <Button
                  variant="outline"
                  onClick={() => setMode("single")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-semibold transition-all ${
                    mode === "single"
                      ? " text-indigo-600 shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Un seul Mot</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setMode("multiple")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-semibold transition-all ${
                    mode === "multiple"
                      ? "text-purple-600 shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Plusieurs mots</span>
                </Button>
              </div>
            </div>
          )}
          <div className="p-6">
            {mode === "single" ? (
              <SingleWord formData={formData} handleChange={handleChange} />
            ) : (
              <MultipleWords bulkText={bulkText} setBulkText={setBulkText} />
            )}
          </div>
          <DialogFooter className="p-6 gap-3">
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
              disabled={isLoading}
              className={`rounded-lg shadow-md hover:shadow-lg transition-all ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Traitement...
                </span>
              ) : mode === "single" ? (
                "Enregistrer"
              ) : (
                "Analyser et enregistrer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
