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
import { useState } from "react";
import { Plus, Languages, FileText } from "lucide-react";

function SingleWord({ formData, handleChange }) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label
          htmlFor="word"
          className="text-sm font-semibold text-gray-700 flex items-center gap-2"
        >
          🇫🇷 Mot (français)
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
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          🇯🇵 Traduction japonaise
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="translation"
              className="text-sm font-semibold text-gray-700"
            >
              漢字 Kanji
            </Label>
            <Input
              id="translation"
              value={formData.translation}
              onChange={handleChange}
              placeholder="Ex: 今日は"
              className="border-2 border-gray-200 focus:border-purple-500 rounded-lg transition-colors text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="pronunciation"
              className="text-sm font-semibold text-gray-700"
            >
              ひらがな Hiragana / Rōmaji
            </Label>
            <Input
              id="pronunciation"
              value={formData.pronunciation}
              onChange={handleChange}
              placeholder="Ex: こんにちは"
              className="border-2 border-gray-200 focus:border-purple-500 rounded-lg transition-colors text-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MultipleWords({ bulkText, setBulkText }) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-purple-900 mb-2">
          📝 Format attendu
        </h3>
        <p className="text-xs text-purple-700 mb-2">
          Collez votre texte contenant les mots à ajouter. Le système détectera
          automatiquement les mots japonais et leurs traductions.
        </p>
        <div className="bg-white rounded p-2 text-xs font-mono text-gray-600">
          Exemple : 今日(きょう);aujourd'hui ou encore 今日(kyō);aujourd'hui
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
          placeholder="Collez ici votre texte contenant plusieurs mots...&#10;&#10;Ex:&#10;今日(きょう);aujourd'hui ou encore 今日(kyō);aujourd'hui"
          className="w-full min-h-[280px] p-4 border-2 border-gray-200 focus:border-purple-500 rounded-lg transition-colors resize-none text-sm"
        />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
        <span className="text-amber-600 text-sm">💡</span>
        <p className="text-xs text-amber-800">
          Chaque ligne sera analysée pour extraire les mots français et leurs
          traductions japonaises.
        </p>
      </div>
    </div>
  );
}

export default function AddModal() {
  const [mode, setMode] = useState("single");
  const [formData, setFormData] = useState({
    word: "",
    translation: "",
    pronunciation: "",
    type_post: "",
  });
  const [bulkText, setBulkText] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (mode === "single") {
        const dataToSend = {
          ...formData,
          type_post: "single",
        };

        console.log("formData à envoyer:", dataToSend);
        console.log("json formData à envoyer:", JSON.stringify(dataToSend));

        const response = await fetch("/api/words", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Réponse du serveur:", data);

        setFormData({
          word: "",
          translation: "",
          pronunciation: "",
          type_post: "",
        });
      } else {
        const dataToSend = {
          bulkText,
          type_post: "bulk",
        };

        console.log("bulkText à envoyer:", dataToSend);

        const response = await fetch("/api/words", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Réponse du serveur:", data);

        setBulkText("");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
    }
  };

  return (
    <div className="p-8">
      <Dialog>
        <DialogTrigger asChild>
          <button className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
            <span>Ajouter un mot</span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Languages className="w-6 h-6 text-white" />
                </div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Ajouter des mots
                </DialogTitle>
              </div>
              <DialogDescription className="text-indigo-50">
                Enrichissez votre vocabulaire japonais
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 pt-6 bg-white">
            <div className="flex gap-3 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setMode("single")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-semibold transition-all ${
                  mode === "single"
                    ? "bg-white text-indigo-600 shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Un seul mot</span>
              </button>
              <button
                onClick={() => setMode("multiple")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-semibold transition-all ${
                  mode === "multiple"
                    ? "bg-white text-purple-600 shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Plusieurs mots</span>
              </button>
            </div>
          </div>

          <div className="p-6 bg-white">
            {mode === "single" ? (
              <SingleWord formData={formData} handleChange={handleChange} />
            ) : (
              <MultipleWords bulkText={bulkText} setBulkText={setBulkText} />
            )}
          </div>

          <DialogFooter className="bg-gray-50 p-6 gap-3">
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
              className={`rounded-lg shadow-md hover:shadow-lg transition-all ${
                mode === "single"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              }`}
            >
              {mode === "single"
                ? "Enregistrer le mot"
                : "Analyser et enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
