"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookOpen, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { DashboardData, Word, Words } from "@/lib/type";
type Category = "all" | "mastered" | "learning" | "toReview";

const CATEGORIES: {
  key: Category;
  label: string;
  icon?: React.ReactNode;
  activeClass: string;
}[] = [
  {
    key: "all",
    label: "All",
    activeClass: "bg-slate-900 text-white hover:bg-slate-800",
  },
  {
    key: "mastered",
    label: "Mastered",
    icon: <CheckCircle2 className="h-3 w-3" />,
    activeClass: "bg-emerald-600 text-white hover:bg-emerald-700",
  },
  {
    key: "learning",
    label: "Learning",
    icon: <BookOpen className="h-3 w-3" />,
    activeClass: "bg-blue-600 text-white hover:bg-blue-700",
  },
  {
    key: "toReview",
    label: "To review",
    icon: <Clock className="h-3 w-3" />,
    activeClass: "bg-amber-500 text-white hover:bg-amber-600",
  },
];

export default function ShowWords({
  children,
  type,
  words,
}: {
  children: React.ReactNode;
  type: Category;
  words: DashboardData;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>(type);

  const allWords = [...words.mastered, ...words.learning, ...words.toReview];

  const getFilteredWords = (): Word[] => {
    switch (selectedCategory) {
      case "mastered":
        return words.mastered;
      case "learning":
        return words.learning;
      case "toReview":
        return words.toReview;
      default:
        return allWords;
    }
  };

  const getCategoryCount = (key: Category): number => {
    switch (key) {
      case "mastered":
        return words.mastered.length;
      case "learning":
        return words.learning.length;
      case "toReview":
        return words.toReview.length;
      default:
        return words.totalWords;
    }
  };

  const filteredWords = getFilteredWords();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[680px] p-0 overflow-hidden rounded-2xl border border-slate-200 shadow-xl">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <DialogTitle className="text-xl font-semibold text-slate-900 tracking-tight">
            Vocabulary
          </DialogTitle>
          <p className="text-sm text-slate-400 mt-0.5">
            {words.totalWords} word{words.totalWords !== 1 ? "s" : ""} in your
            list
          </p>
        </DialogHeader>

        {/* Category filters */}
        <div className="px-6 py-3 flex gap-2 flex-wrap border-b border-slate-100 bg-slate-50/60">
          {CATEGORIES.map(({ key, label, icon, activeClass }) => {
            const isActive = selectedCategory === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border
                  ${
                    isActive
                      ? `${activeClass} border-transparent shadow-sm`
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
              >
                {icon}
                {label}
                <span
                  className={`ml-0.5 ${isActive ? "opacity-80" : "text-slate-400"}`}
                >
                  ({getCategoryCount(key)})
                </span>
              </button>
            );
          })}
        </div>

        {/* Word grid */}
        <div className="p-6 max-h-[55vh] overflow-y-auto">
          {filteredWords.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredWords.map((word) => (
                <div
                  key={word.id}
                  className="group bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 transition-all duration-200 hover:shadow-md"
                >
                  <div className="text-base font-semibold text-slate-900 mb-1 leading-snug">
                    {word.translation}
                  </div>
                  {word.pronunciation && (
                    <div className="text-xs text-slate-400 font-mono mb-3">
                      {word.pronunciation}
                    </div>
                  )}
                  <div className="pt-2.5 border-t border-slate-100 text-sm text-slate-500">
                    {word.word}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600">
                No words in this category
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Start learning to see them appear here
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="rounded-lg border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 text-sm px-5"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
