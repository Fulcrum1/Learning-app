"use client";
import { Home, List, User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppFooter() {
  const pathname = usePathname();
  const navItems = [
    {
      id: "dashboard",
      icon: Home,
      label: "Tableau de bord",
      href: "/",
    },
    { id: "lists", icon: List, label: "Listes", href: "/lists" },
    { id: "profile", icon: User, label: "Profil", href: "/users" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[#0f1419] border-t border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-2 w-full">
        <div className="flex items-center justify-between h-16 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col flex-1 items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? "text-purple-400 bg-purple-500/10"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <div className="text-white">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span
                  className={`text-xs font-medium ${isActive ? "font-semibold" : ""}`}
                >
                  <div className="text-white">{item.label}</div>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
