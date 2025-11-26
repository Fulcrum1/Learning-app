"use client";

import AddModal from "@/components/Lists/AddModal";
import { useState, useEffect } from "react";
import ShowWordsList from "@/components/Global/ShowVocabularyList";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/lib/constants";
import Link from "next/link";
import { getSession } from "@/lib/session";

interface List {
  id: number;
  name: string;
  description: string;
  words: string[];
}

export default function Lists() {
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/list`, {
          method: "GET",
        });
        const data = await response.json();

        setLists(data);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };
    fetchLists();
  }, []);

  const updateDefaultLists = async () => {
    const session = await getSession();
    await fetch(`${BACKEND_URL}/list/update-default`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });
  };

  const handleEdit = async (id: number) => {
    // const session = await getSession();
    // await fetch(`${BACKEND_URL}/list/${id}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${session?.accessToken}`,
    //   },
    // });
  };

  const handleDelete = async (id: number) => {
    const session = await getSession();
    await fetch(`${BACKEND_URL}/list/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Listes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
              Gérez les listes de votre application
            </p>
          </div>
          <div className="grid grid-cols-1 items-center gap-2">
            <AddModal />
            <Button variant="outline" onClick={updateDefaultLists}>
              Actualiser les listes par défaut
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Desktop Table */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Liste
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Vocabulaire
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Outils
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {lists && lists.length > 0 ? (
                  lists.map((list) => (
                    <tr
                      key={list.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {list.name.charAt(0)}
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {list.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {list.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ShowWordsList type="lists" id={list.id.toString()} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button asChild variant="outline">
                            <Link href={`/cards/${list.id}`}>Cartes</Link>
                          </Button>
                          <Button asChild variant="outline">
                            <Link href={`/cards/${list.id}/learn`}>
                              Apprendre
                            </Link>
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(list.id)} className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                            Modifier
                          </button>
                          <button onClick={() => handleDelete(list.id)} className="px-3 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium">
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="h-24 text-center text-gray-500 dark:text-gray-400"
                    >
                      Aucune liste trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {lists && lists.length > 0 ? (
            lists.map((list) => (
              <div
                key={list.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                      {list.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
                        {list.name}
                      </h3>
                    </div>
                  </div>

                  {/* Vocabulaire */}
                  <div className="mb-3">
                    <ShowWordsList type="lists" id={list.id.toString()} />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Button asChild>
                      <Link
                        href={`/cards/${list.id}`}
                        className="flex-1 text-center"
                      >
                        <div className="text-white">Cartes</div>
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link
                        href={`/cards/${list.id}`}
                        className="flex-1 text-center"
                      >
                        <div className="text-white">Apprendre</div>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
              Aucune liste trouvée
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
