"use client";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "@/lib/constants";
import { Word, BaseResponse } from "@/lib/type";
import { apiRequest } from "@/lib/api-request";
import { useLanguage } from "@/components/Global/LanguageProvider";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import WordModal from "./WordModal";

export default function WordsList({ page }: { page: string }) {
  const [words, setWords] = useState<Word[]>([]);
  const [search, setSearch] = useState("");
  const { language } = useLanguage();

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await apiRequest.get(
          `${BACKEND_URL}/api/words?language=${language}`,
        );
        const data = response as BaseResponse;
        setWords(data.data);
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };
    fetchWords();
  }, [language]);

  const handleDelete = async (id: number) => {
    const response = await apiRequest.delete(`${BACKEND_URL}/api/word/${id}`);
    if ((response as BaseResponse).data) {
      setWords(words.filter((word) => word.id !== id));
    }
  };

  const filteredWords = words.filter(
    (word) =>
      word.word.toLowerCase().includes(search.toLowerCase()) ||
      word.translation.toLowerCase().includes(search.toLowerCase()) ||
      (word.pronunciation ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Rechercher un mot, une traduction, une prononciation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
        />
      </div>

      {/* Words Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Mot
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Traduction
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Prononciation
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredWords && filteredWords.length > 0 ? (
                filteredWords.map((word) => (
                  <tr
                    key={word.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-2 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {word.word}
                      </p>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {word.translation}
                      </p>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {word.pronunciation}
                      </p>
                    </td>
                    {page === "words" && (
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <WordModal wordId={word.id} type="update" />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Supprimer
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure you want to delete this word?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the word from our server.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleDelete(word.id)}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="h-16 text-center text-sm text-gray-500"
                  >
                    Aucun mot trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
