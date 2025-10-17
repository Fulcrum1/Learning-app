import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function MultipleWords() {
  const [mode, setMode] = useState<"single" | "multiple">("single");
  const [formData, setFormData] = useState({
    mot: "",
    signification: "",
    kanji: "",
    hiragana: "",
    romaji: "",
  });
  const [bulkText, setBulkText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

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
          Exemple : 今日(きょう);aujourd’hui ou encore 今日(kyō);aujourd’hui
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
          placeholder="Collez ici votre texte contenant plusieurs mots...&#10;&#10;Ex:&#10;今日(きょう);aujourd’hui ou encore 今日(kyō);aujourd’hui"
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
