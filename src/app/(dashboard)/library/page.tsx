"use client";
import { UserPlus } from "lucide-react";
import AddModal from "@/components/Words/AddModal";
import { useState, useEffect } from "react";

export default function Users() {
  const [open, setOpen] = useState(false);
  const [words, setWords] = useState([]);

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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {words.length > 0 ? (
                  words.map((word) => (
                    <tr
                      key={word.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {word.word.charAt(0)}
                          </div>
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
      </div>
    </>
  );
}
