import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useState } from "react";
import { CardParam } from "@/lib/type";
import { getSession } from "@/lib/session";
import { BACKEND_URL } from "@/lib/constants";

interface OptionsProps {
  cardParam: CardParam;
  idList: string;
  onUpdateParams: (params: {
    random: boolean;
    translationOnVerso: boolean;
  }) => void;
}

export default function Options({ cardParam, idList, onUpdateParams }: OptionsProps) {
  const [isRandom, setIsRandom] = useState(cardParam.random);
  const [isTranslationOnVerso, setIsTranslationOnVerso] = useState(
    cardParam.translationOnVerso
  );
  const [frontSide, setFrontSide] = useState(
    cardParam.translationOnVerso ? "Français" : "Japonais"
  );
  const [backSide, setBackSide] = useState(
    cardParam.translationOnVerso ? "Japonais" : "Français"
  );

  const handleReset = async () => {
    const session = await getSession();
    await fetch(`${BACKEND_URL}/card/reset-card`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({
        listId: idList,
      }),
    });
  };

  const toggleSides = async () => {
  const newIsTranslationOnVerso = !isTranslationOnVerso;
  
  // Mettre à jour l'état local immédiatement
  setIsTranslationOnVerso(newIsTranslationOnVerso);
  setFrontSide(newIsTranslationOnVerso ? "Français" : "Japonais");
  setBackSide(newIsTranslationOnVerso ? "Japonais" : "Français");

  // Créer un nouvel objet avec les nouvelles valeurs
  const newParams = {
    random: isRandom,
    translationOnVerso: newIsTranslationOnVerso,
  };

  // Notifier le parent avec les nouvelles valeurs
  onUpdateParams(newParams);
  
  // Appeler handleUpdate avec les nouvelles valeurs directement
  await handleUpdate(newParams);
};

const handleRandom = async () => {
  const newRandom = !isRandom;
  
  // Mettre à jour l'état local immédiatement
  setIsRandom(newRandom);

  // Créer un nouvel objet avec les nouvelles valeurs
  const newParams = {
    random: newRandom,
    translationOnVerso: isTranslationOnVerso,
  };

  // Notifier le parent avec les nouvelles valeurs
  onUpdateParams(newParams);
  
  // Appeler handleUpdate avec les nouvelles valeurs directement
  await handleUpdate(newParams);
};

// Modifier handleUpdate pour accepter les paramètres
const handleUpdate = async (params: { random: boolean; translationOnVerso: boolean }) => {
  const session = await getSession();
  await fetch(`${BACKEND_URL}/card/param-card`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify(params), // Utiliser les paramètres passés
  });
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
              onClick={() => handleRandom()}
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
