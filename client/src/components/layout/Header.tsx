import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, LogOut, User as UserIcon, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';

export interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const getPageTitle = (path: string) => {
    if (path === '/dashboard') return 'Dashboard Overview';
    if (path.startsWith('/companies/')) return 'Company Details';
    if (path.startsWith('/companies')) return 'Company Management';
    if (path.startsWith('/employees')) return 'Employee Directory';
    if (path.startsWith('/ongoing-works')) return 'Ongoing & Works Management';
    if (path.startsWith('/job-types')) return 'Job Type Master';
    if (path.startsWith('/locations')) return 'Location Master';
    return 'Management Console';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-base font-bold text-[#172B3A]">{getPageTitle(location.pathname)}</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#2872A1]" />
        </button>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
          >
            <div className="h-9 w-9 rounded-full bg-[#2872A1] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-[#172B3A]">{user?.name || 'Administrator'}</p>
              <p className="text-[11px] text-slate-500 truncate max-w-[140px]">{user?.email || 'admin@example.com'}</p>
            </div>
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95"
              onClick={() => setUserMenuOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-[#172B3A]">{user?.name}</p>
                <p className="text-[11px] text-slate-500">{user?.email}</p>
              </div>

              <div className="px-1 py-1">
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <Shield className="h-4 w-4 text-[#2872A1]" />
                  <span>Admin Credentials</span>
                </div>
              </div>

              <div className="px-1 py-1 border-t border-slate-100">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 rounded-lg hover:bg-red-50 text-left transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
