import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useState } from "react";

export default function Options() {
  const [isRandom, setIsRandom] = useState(false);
  const [frontSide, setFrontSide] = useState("Français");
  const [backSide, setBackSide] = useState("Japonais");

  const handleReset = () => {
    setIsRandom(false);
    setFrontSide("Français");
    setBackSide("Japonais");
  };

  const toggleSides = () => {
    const temp = frontSide;
    setFrontSide(backSide);
    setBackSide(temp);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogTitle />
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Options</h2>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Option Aléatoire */}
          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <Label className="text-base font-medium text-gray-900 cursor-pointer">
                Ordre aléatoire
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                Mélanger les cartes à chaque session
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsRandom(!isRandom)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isRandom ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isRandom ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Séparateur */}
          <div className="border-t border-gray-200" />

          {/* Côtés des cartes */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-gray-900">
              Configuration des cartes
            </Label>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Recto</span>
                <span className="text-sm text-gray-900 font-medium">
                  {frontSide}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Verso</span>
                <span className="text-sm text-gray-900 font-medium">
                  {backSide}
                </span>
              </div>

              <Button
                type="button"
                onClick={toggleSides}
                variant="outline"
                className="w-full mt-2 border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                ⇄ Inverser recto/verso
              </Button>
            </div>
          </div>

          {/* Séparateur */}
          <div className="border-t border-gray-200" />

          {/* Bouton Reset */}
          <Button
            type="button"
            onClick={handleReset}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Réinitialiser la liste
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
