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

  return (
    <>
      {/* Words Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Mot
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Traduction
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Prononciation
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {words && words.length > 0 ? (
                words.map((word) => (
                  <tr
                    key={word.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {word.word}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {word.translation}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {word.pronunciation}
                      </p>
                    </td>
                    {page === "words" && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {/* <Button
                            variant="outline"
                            className="px-3 py-1 text-sm"
                          >
                            Modifier
                          </Button> */}
                          <WordModal wordId={word.id} type="update" />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive">Supprimer</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure you want to delete this word?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the word from our server.
                                  servers.
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
                  <td colSpan={4} className="h-24 text-center">
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
