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
import SingleWord from "./SingleWord";
import MultipleWords from "./MultipleWords";

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

  const handleSubmit = () => {
    if (mode === "single") {
      console.log("Nouveau mot ajouté :", formData);
      setFormData({
        mot: "",
        signification: "",
        kanji: "",
        hiragana: "",
        romaji: "",
      });
    } else {
      console.log("Texte bulk ajouté :", bulkText);
      setBulkText("");
    }
  };

  return (
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

        {/* Sélecteur de mode */}
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
          {mode === "single" ? <SingleWord /> : <MultipleWords />}
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
  );
}
