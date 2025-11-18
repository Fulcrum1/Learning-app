"use client";
import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Category } from "@/lib/type";

export default function CategoryModal({
  categories,
  onCategorySelect,
}: {
  categories: Category[];
  onCategorySelect: (categories: Category[]) => void;
}) {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  useEffect(() => {
    onCategorySelect(selectedCategories);
  }, [selectedCategories]);

  const toggleCategorySelection = (cat: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  return (
    <div>
      <div className="p-3 rounded-lg">
        <div className="text-sm text-gray-600">
          {selectedCategories.length} catégorie(s) sélectionnée(s) •
          {selectedCategories.reduce((total, cat) => {
            const category = categories.find((cat) => cat.id === cat.id);
            return total + (category?._count?.VocabularyToCategories || 0);
          }, 0)}
          mot(s)
        </div>
      </div>
      <div className="max-h-[400px] overflow-y-auto pr-2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
          {categories.map((cat) => {
            const count = cat?._count?.VocabularyToCategories;
            return (
              <div
                key={cat.id}
                onClick={() => toggleCategorySelection(cat)}
                className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all text-center ${
                  selectedCategories.includes(cat)
                    ? "border-purple-500 bg-purple-50 shadow-md"
                    : "border-gray-200 hover:border-purple-300 hover:shadow"
                }`}
              >
                {selectedCategories.includes(cat) && (
                  <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1">
                    <Check size={14} />
                  </div>
                )}
                <div className="text-lg font-bold capitalize mb-1">
                  {cat.name}
                </div>
                <div className="text-sm text-gray-600">{count} mots</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
