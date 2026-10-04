import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Users,
  Wrench,
  MapPin,
  Building,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SidebarProps {
  isOpen: boolean;
  isCollapsed?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, isCollapsed = false, onCloseMobile }) => {
  const navSections = [
    {
      title: 'General',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Operations',
      items: [
        { label: 'Ongoing Works', path: '/ongoing-works', icon: Briefcase },
      ],
    },
    {
      title: 'Management',
      items: [
        { label: 'Companies', path: '/companies', icon: Building2 },
        { label: 'Employees', path: '/employees', icon: Users },
      ],
    },
    {
      title: 'Masters',
      items: [
        { label: 'Job Types', path: '/job-types', icon: Wrench },
        { label: 'Locations', path: '/locations', icon: MapPin },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 bg-[#172B3A] text-white flex flex-col transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 border-r border-slate-800 shadow-xl shrink-0',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        isCollapsed ? 'lg:w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className={cn('h-16 flex items-center border-b border-slate-800/80 bg-[#12222f] transition-all', isCollapsed ? 'justify-center px-2' : 'gap-3 px-6')}>
        <div className="rounded-lg bg-[#2872A1] p-2 text-white shadow-sm shrink-0">
          <Building className="h-5 w-5" />
        </div>
        {!isCollapsed && (
          <div className="truncate">
            <h1 className="text-base font-extrabold text-white tracking-tight leading-none">Workforce Pro</h1>
            <p className="text-[10px] font-medium text-[#CBDDE9] mt-0.5 tracking-wider uppercase">Enterprise SaaS</p>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <div className={cn('flex-1 overflow-y-auto sidebar-scroll py-6 space-y-6 transition-all', isCollapsed ? 'px-2' : 'px-4')}>
        {navSections.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    title={isCollapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center rounded-lg text-xs font-semibold transition-all group',
                        isCollapsed ? 'justify-center py-3 px-0' : 'justify-between px-3.5 py-2.5',
                        isActive
                          ? 'bg-[#2872A1] text-white shadow-md shadow-[#2872A1]/20 font-bold'
                          : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className={cn('flex items-center', isCollapsed ? 'justify-center' : 'gap-3')}>
                          <Icon className={cn('h-5 w-5 transition-transform group-hover:scale-110 shrink-0', isActive ? 'text-white' : 'text-slate-400 group-hover:text-white')} />
                          {!isCollapsed && <span>{item.label}</span>}
                        </div>
                        {!isCollapsed && isActive && <ChevronRight className="h-3.5 w-3.5 opacity-80" />}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-800/80 bg-[#12222f]/50 text-center">
        {isCollapsed ? (
          <p className="text-[10px] text-slate-400 font-bold">v1.0</p>
        ) : (
          <p className="text-[11px] text-slate-400">Company & Workforce System v1.0</p>
        )}
      </div>
    </aside>
  );
};
