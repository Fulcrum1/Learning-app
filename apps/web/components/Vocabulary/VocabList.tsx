"use client";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "@/lib/constants";
import { Vocabulary } from "@/lib/type";

export default function VocabList({ page }: { page: string }) {
  const [open, setOpen] = useState(false);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/vocabulary`, {
          method: "GET",
        });
        const data = await response.json();

        setVocabulary(data);
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };
    fetchWords();
  }, []);

  return (
    <>
      {/* Words Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
                  Catégories
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {vocabulary && vocabulary.length > 0 ? (
                vocabulary.map((vocabulary) => (
                  <tr
                    key={vocabulary.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {vocabulary.name.charAt(0)}
                        </div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {vocabulary.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {vocabulary.translation}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {vocabulary.pronunciation}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {vocabulary.categories?.map((category) => category.name).join(", ")}
                      </p>
                    </td>
                    {page === "library" && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                            Modifier
                          </button>
                          <button className="px-3 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium">
                            Supprimer
                          </button>
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
