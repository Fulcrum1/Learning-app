"use client";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RandomModalProps {
  randomCount: number;
  maxRandomCount: number;
  onCountChange: (count: number) => void;
}

export default function RandomModal({
  randomCount,
  maxRandomCount,
  onCountChange,
}: RandomModalProps) {
  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= maxRandomCount) {
      onCountChange(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-lg border ">
        <Label
          htmlFor="randomCount"
          className="text-sm font-semibold text-gray-700 mb-2 block"
        >
          Nombre de mots aléatoires
        </Label>
        <Input
          id="randomCount"
          type="number"
          min="1"
          max={maxRandomCount}
          value={randomCount}
          onChange={handleCountChange}
          className="w-full"
        />
        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <p>
            <strong>Total disponible:</strong> {maxRandomCount} mots
          </p>
          <p>
            <strong>Sélection:</strong> {randomCount} mots aléatoires
          </p>
          <p className="text-xs text-gray-500 mt-2">
            La sélection sera différente à chaque validation
          </p>
        </div>
      </div>
    </div>
  );
}
