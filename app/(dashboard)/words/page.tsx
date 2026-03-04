"use client";
import { UserPlus } from "lucide-react";
import AddModal from "@/components/Vocabulary/AddModal";
import WordsList from "@/components/Vocabulary/WordsList";
import WordModal from "@/components/Vocabulary/WordModal";

export default function Words() {
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
          {/* <AddModal /> */}
          <WordModal type="add" />
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Words Table */}
        <WordsList page={"words"} />
      </div>
    </>
  );
}
