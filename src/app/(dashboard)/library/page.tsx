"use client";
import { UserPlus } from "lucide-react";
import AddModal from "@/components/Words/AddModal";
import { useState, useEffect } from "react";
import WordsLists from "@/components/Words/wordsLists";

interface Word {
  id: number;
  word: string;
  translation: string;
  pronunciation: string;
}

export default function Users() {
  const [open, setOpen] = useState(false);
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch("/api/words");
        const data = await response.json();

        setWords(data.words);
      } catch (error) {
        console.error("Error fetching words:", error);
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
              Mots
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez les mots de votre application
            </p>
          </div>
          <AddModal />
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Words Table */}
        <WordsLists page={"library"}/>
      </div>
    </>
  );
}
