"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Shuffle, BookOpen, X } from "lucide-react";
import { Words, BaseResponse, ListResponse, Word } from "@/lib/type";
import { BACKEND_URL } from "@/lib/constants";
import ManualModal from "./AddModal/manual";
import RandomModal from "./AddModal/random";
import { getSession } from "@/lib/session";
import { apiRequest } from "@/lib/api-request";
import { useLanguage } from "@/components/Global/LanguageProvider";
import { useForm } from "@/lib/list-form";

export default function ListForm({
  type,
  id,
  onClose,
}: {
  type: "create" | "update";
  id?: string;
  onClose: () => void;  // ← add this
}) {
  const [activeTab, setActiveTab] = useState<"manual" | "random">("manual");
  const [words, setWords] = useState<Word[]>();

  const { language } = useLanguage();

  const {
    formData,
    setFormData,
    randomCount,
    setRandomCount,
    selectedWords,
    setSelectedWords,
  } = useForm();

  useEffect(() => {
    const getWords = async () => {
      try {
        const session = await getSession();
        const response = (await apiRequest.get(
          `${BACKEND_URL}/api/words?language=${language}&userId=${session?.user.id}`,
        )) as BaseResponse;

        const data = response.data;

        setWords(data);
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };

    const getList = async () => {
      try {
        const session = await getSession();
        const response = (await apiRequest.get(
          `${BACKEND_URL}/api/list/${id}`,
        )) as ListResponse;
        const data = response;
        console.log(data);
        setFormData({
          name: data.list.name,
          userId: session?.user.id,
          words: [...(data.words.map((lw: any) => lw.word) || [])],
        });
        setSelectedWords(data.words.map((lw: any) => lw.word));

        return data;
      } catch (error) {
        console.error("Error fetching list:", error);
      }
    };

    getWords();
    if (id) getList();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const session = await getSession();

      let wordsIds: number[] = [];
      if (activeTab === "manual") {
        wordsIds = selectedWords.map((word) => word.id);
      } else {
        const shuffled = [...(words ?? [])].sort(() => Math.random() - 0.5);
        wordsIds = shuffled.slice(0, randomCount).map((word) => word.id);
      }
      const payload = {
        name: formData.name,
        userId: session?.user.id,
        language: language,
        words: wordsIds,
      };
      if (type === "create") {
        console.log("Creating list:", payload);
        await apiRequest.post(`${BACKEND_URL}/api/list`, payload);
      } else {
        console.log("Updating list:", payload);
        await apiRequest.put(`${BACKEND_URL}/api/list/${id}`, payload);
      }
      
      setFormData({ name: "", userId: "", words: [] });
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <div className="overflow-y-auto flex-1 px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la liste</Label>
            <Input
              id="name"
              placeholder="Ma liste de vocabulaire"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {type === "create" && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 border-b">
              {(["manual", "random"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 font-medium transition text-sm sm:text-base ${
                    activeTab === tab
                      ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50 sm:bg-transparent dark:bg-purple-900/20"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  {tab === "manual" ? (
                    <BookOpen size={16} className="sm:w-[18px] sm:h-[18px]" />
                  ) : (
                    <Shuffle size={16} className="sm:w-[18px] sm:h-[18px]" />
                  )}
                  <span>{tab === "manual" ? "Manuelle" : "Aléatoire"}</span>
                </button>
              ))}
            </div>
          )}

          <div className="space-y-3">
            {activeTab === "manual" && words && <ManualModal words={words} />}
            {activeTab === "random" && (
              <RandomModal maxRandomCount={words.length} />
            )}
          </div>
        </form>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto rounded-lg border-2 transition-colors"
          >
            Annuler
          </Button>
        </DialogClose>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!formData.name}
          variant="default"
        >
          <Plus className="w-4 h-4 mr-2" />
          {type === "create" ? "Créer la liste" : "Modifier la liste"}
        </Button>
      </DialogFooter>
    </div>
  );
}
