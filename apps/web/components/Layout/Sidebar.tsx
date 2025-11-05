"use client";
import { useState } from "react";
import {
  Home,
  Users,
  List,
  LogOut,
  BookOpen,
  FolderOpen,
  Link,
} from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import NavButton from "./NavButton";
import { Button } from "../ui/button";

interface AppSidebarProps {
  user?: string;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const [activeItem, setActiveItem] = useState("dashboard");
  
  const userInitials = user
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const menuCategories = [
    {
      id: "dashboard",
      label: "Dashboard",
      items: [
        { id: "dashboard", label: "Tableau de bord", icon: Home, href: "/" },
      ],
    },
    {
      id: "learning",
      label: "Apprentissage",
      items: [{ id: "lists", label: "Listes", icon: List, href: "/lists" }],
    },
    {
      id: "data",
      label: "Gestion des données",
      items: [
        {
          id: "library",
          label: "Bibliothèque",
          icon: BookOpen,
          items: [
            {
              id: "vocabulary",
              label: "Vocabulaire",
              icon: BookOpen,
              href: "/library/vocabulary",
            },
          ],
        },
        {
          id: "categories",
          label: "Catégories",
          icon: FolderOpen,
          href: "/categories",
        },
        { id: "users", label: "Utilisateurs", icon: Users, href: "/users" },
      ],
    },
  ];

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out border-r border-gray-800/50">
      {/* Header with glow effect */}
      <div className="p-6 flex items-center justify-between border-b border-gray-800/50 backdrop-blur-sm">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent text-white">
          Learning App
        </h1>
        <SidebarTrigger />
      </div>
      {/* Navigation with enhanced visuals */}
      <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
        {menuCategories.map((category, categoryIndex) => (
          <div
            key={category.id}
            className="animate-fadeIn"
            style={{ animationDelay: `${categoryIndex * 100}ms` }}
          >
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4 flex items-center gap-2">
              <span className="w-10 h-px bg-gradient-to-r from-indigo-500/50 to-transparent" />
              {category.label}
            </h2>
            <div className="space-y-2">
              {category.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;

                return (
                  <NavButton
                    key={item.id}
                    label={item.label}
                    icon={Icon}
                    href={item.href}
                    items={item.items}
                    onClick={() => setActiveItem(item.id)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced User Profile */}
      <div className="p-6 border-t border-gray-800/50 backdrop-blur-sm">
        <div
          className={`flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800/30 transition-all duration-300 cursor-pointer group`}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-110">
              <span className="text-base font-semibold">{userInitials}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium truncate">{user}</p>
          </div>
        </div>
        <a href="/api/auth/signout">
          <button
            className={`mt-4 w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-600/10 hover:text-red-400 transition-all duration-300 group relative overflow-hidden cursor-pointer`}
            title="Déconnexion"
          >
            <LogOut className="w-6 h-6 flex-shrink-0 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <span className="font-medium text-base relative z-10">
              Déconnexion
            </span>
          </button>
        </a>
      </div>
    </div>
  );
}
