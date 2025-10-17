import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function AddModal() {
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
    <div className="p-6 bg-white">
      <div className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="mot"
            className="text-sm font-semibold text-gray-700 flex items-center gap-2"
          >
            🇫🇷 Mot (français)
          </Label>
          <Input
            id="mot"
            value={formData.mot}
            onChange={handleChange}
            placeholder="Ex: Bonjour"
            className="border-2 border-gray-200 focus:border-indigo-500 rounded-lg transition-colors"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="signification"
            className="text-sm font-semibold text-gray-700 flex items-center gap-2"
          >
            💡 Signification
          </Label>
          <Input
            id="signification"
            value={formData.signification}
            onChange={handleChange}
            placeholder="Ex: Salutation"
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
                htmlFor="kanji"
                className="text-sm font-semibold text-gray-700"
              >
                漢字 Kanji
              </Label>
              <Input
                id="kanji"
                value={formData.kanji}
                onChange={handleChange}
                placeholder="Ex: 今日は"
                className="border-2 border-gray-200 focus:border-purple-500 rounded-lg transition-colors text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="hiragana"
                className="text-sm font-semibold text-gray-700"
              >
                ひらがな Hiragana
              </Label>
              <Input
                id="hiragana"
                value={formData.hiragana}
                onChange={handleChange}
                placeholder="Ex: こんにちは"
                className="border-2 border-gray-200 focus:border-purple-500 rounded-lg transition-colors text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="romaji"
                className="text-sm font-semibold text-gray-700"
              >
                Rōmaji
              </Label>
              <Input
                id="romaji"
                value={formData.romaji}
                onChange={handleChange}
                placeholder="Ex: Konnichiwa"
                className="border-2 border-gray-200 focus:border-purple-500 rounded-lg transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
