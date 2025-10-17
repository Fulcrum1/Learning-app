'use client';

import { useState } from 'react';
import {
  Home,
  BarChart3,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

interface SidebarProps {
  activePage?: string;
}

export default function Sidebar({ activePage = 'dashboard' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

const initialUser = user?.name
  ?.split(' ')
  .filter(part => part.length > 0)
  .slice(0, 2)
  .map(part => part.charAt(0).toUpperCase())
  .join('');

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, href: '/' },
    { id: 'library', label: 'Bibliotheque', icon: BarChart3, href: '/library' },
    { id: 'users', label: 'Utilisateurs', icon: Users, href: '/users' },
    { id: 'categories', label: 'Categories', icon: FileText, href: '/categories' },
  ];

  return (
    <div
      className={`h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'
        }`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        {!collapsed && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              title={collapsed ? item.label : ''}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </a>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-800">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold">{initialUser}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          )}
        </div>

        <button
          className={`mt-3 w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-all ${collapsed ? 'justify-center' : ''
            }`}
          title={collapsed ? 'Déconnexion' : ''}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Déconnexion</span>}
        </button>
      </div>
    </div>
  );
}
