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

import { Plus, Shuffle, List, BookOpen, X, Trash2 } from "lucide-react";
import { Category, Vocabulary } from "@/lib/type";
import { BACKEND_URL } from "@/lib/constants";

import { getSession } from "@/lib/session";

interface UpdateModalProps {
  idList: string;
}

interface VocabularyItem {
  id: string;
  name: string;
  translation: string;
  pronunciation: string;
  type: string;
}

interface ListItem {
  id: string;
  listId: string;
  vocabularyId: string;
  order: number;
  review: boolean;
  createdAt: string;
  updatedAt: string;
  vocabulary: VocabularyItem;
}

export default function UpdateModal({ idList }: UpdateModalProps) {
  const [open, setOpen] = useState(false);

  const [vocabularyItems, setVocabularyItems] = useState<ListItem[]>([]);
  const [itemsToDelete, setItemsToDelete] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/list/${idList}`);
        const data = await response.json();
        console.log(data);

        setFormData({
          name: data.name || "",
          description: data.description || "",
        });

        setVocabularyItems(data.vocabularyItems || []);
        setItemsToDelete([]); // Réinitialiser la liste à supprimer
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (open) {
      fetchData();
    }
  }, [idList, open]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const toggleItemToDelete = (itemId: string) => {
    setItemsToDelete((prev) => {
      if (prev.includes(itemId)) {
        // Retirer de la liste si déjà présent
        return prev.filter((id) => id !== itemId);
      } else {
        // Ajouter à la liste
        return [...prev, itemId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const session = await getSession();

      const response = await fetch(`${BACKEND_URL}/list/${idList}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        method: "PATCH", // ou PUT selon votre route
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          itemsToDelete: itemsToDelete, // Envoyer les IDs à supprimer
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setOpen(false);
        setItemsToDelete([]); // Réinitialiser
        // Optionnel: callback pour rafraîchir la liste parente
        window.location.reload(); // ou une meilleure solution avec state management
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
          onClick={() => setOpen(true)}
        >
          Modifier
        </button>
      </DialogTrigger>

      <DialogContent className="dark:bg-gray-900 max-h-[90vh] flex flex-col max-w-4xl">
        <DialogHeader>
          <DialogTitle>Modifier la liste</DialogTitle>
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

            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Input
                id="description"
                placeholder="Description de la liste"
                value={formData.description}
                onChange={handleFormChange}
              />
            </div>
          </form>

          <div className="space-y-3 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                Vocabulaire ({vocabularyItems.length})
              </h3>
              {itemsToDelete.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <Trash2 className="w-4 h-4" />
                  <span>{itemsToDelete.length} à supprimer</span>
                </div>
              )}
            </div>

            {/* Grille responsive: 1 colonne sur mobile, 2 colonnes sur tablette et plus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vocabularyItems.map((item) => {
                const isMarkedForDeletion = itemsToDelete.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItemToDelete(item.id)}
                    className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                      isMarkedForDeletion
                        ? "bg-red-50 dark:bg-red-950/30 border-red-500 dark:border-red-600"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:shadow-lg"
                    }`}
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isMarkedForDeletion ? (
                        <Trash2 className="w-4 h-4 text-red-500" />
                      ) : (
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                      )}
                    </div>
                    <div className="mb-3">
                      <div
                        className={`text-xl font-bold mb-1 ${
                          isMarkedForDeletion
                            ? "text-red-700 dark:text-red-300 line-through"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {item.vocabulary.translation}
                      </div>
                      <div
                        className={`text-xs font-medium px-2 py-1 rounded-md inline-block ${
                          isMarkedForDeletion
                            ? "text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-300"
                            : "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30"
                        }`}
                      >
                        {item.vocabulary.pronunciation}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div
                        className={`text-sm font-medium ${
                          isMarkedForDeletion
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {item.vocabulary.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
            {itemsToDelete.length > 0 ? (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Mettre à jour et supprimer ({itemsToDelete.length})
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Mettre à jour
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
