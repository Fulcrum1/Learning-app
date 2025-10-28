"use client";
import { UserPlus } from "lucide-react";
import AddModal from "@/components/Vocabulary/AddModal";
import { useState, useEffect } from "react";
import WordsLists from "@/components/Vocabulary/wordsLists";
import { Vocabulary } from "@/lib/type";
import { BACKEND_URL } from "@/lib/constants";

export default function Users() {
  const [open, setOpen] = useState(false);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/vocabulary`, {
          method: "GET",
        });
        const data = await response.json();

        setVocabulary(data.vocabulary);
      } catch (error) {
        console.error("Error fetching vocabulary:", error);
      }
    };
    fetchWords();
  }, []);

  return (
    <>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Vocabulaire
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez les vocabulaires de votre application
            </p>
          </div>
          <AddModal />
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Words Table */}
        <WordsLists page={"library"} />
      </div>
    </>
  );
}
