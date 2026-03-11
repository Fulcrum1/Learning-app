"use client";
import { UserPlus } from "lucide-react";
import AddModal from "@/components/Vocabulary/AddModal";
import WordsList from "@/components/Vocabulary/WordsList";
import WordModal from "@/components/Vocabulary/WordModal";

export default function Words() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Vocabulaire
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
              Gérez les vocabulaires de votre application
            </p>
          </div>
          <div className="grid grid-cols-1 items-center gap-2">
            <WordModal type="add" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        <WordsList page={"words"} />
      </div>
    </div>
  );
}
