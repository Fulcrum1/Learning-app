"use client";
import { Home, List, User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageButton from "./LanguageButton";

export default function AppFooter() {
  const pathname = usePathname();

  return (
    <footer className="fixed top-0 left-0 right-0 bg-[#0f1419] border-t border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-2 w-full">
        <div className="flex items-center justify-between h-16 w-full">
            Learning App
            <LanguageButton />
        </div>
      </div>
    </footer>
  );
}
