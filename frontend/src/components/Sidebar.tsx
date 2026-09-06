import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, AlertTriangle, GitCompare, BarChart3, 
  FileCode, ShieldCheck, MessageSquarePlus, Lock, Settings, 
  LogOut, ChevronLeft, ChevronRight, PlayCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  onStartDemo?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onStartDemo }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Patients', path: '/patients', icon: Users },
    { label: 'Baseline', path: '/baseline', icon: GitCompare },
    { label: 'Evaluation', path: '/evaluation', icon: BarChart3 },
    { label: 'Failure Cases', path: '/failure-cases', icon: FileCode },
    { label: 'Audit Logs', path: '/audit-logs', icon: ShieldCheck, roles: ['ADMIN', 'DOCTOR'] },
    { label: 'Feedback', path: '/feedback', icon: MessageSquarePlus },
    { label: 'Privacy & Safety', path: '/privacy', icon: Lock },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const allowedNav = navItems.filter(item => !item.roles || (user && item.roles.includes(user.role)));

  return (
    <aside className={`bg-slate-900 text-slate-100 flex flex-col transition-all duration-300 relative z-30 shadow-xl ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="bg-medical-600 p-2 rounded-lg text-white font-bold flex-shrink-0">
            CG
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold tracking-tight text-white text-base leading-tight">MEDSAFE</h1>
              <p className="text-xs text-medical-300">Decision Support</p>
            </div>
          )}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Demo Quick Launch Button */}
      {onStartDemo && (
        <div className="p-3 border-b border-slate-800">
          <button
            onClick={onStartDemo}
            className={`w-full bg-gradient-to-r from-medical-600 to-indigo-600 hover:from-medical-500 hover:to-indigo-500 text-white rounded-lg py-2 px-3 flex items-center justify-center font-medium text-xs shadow transition ${collapsed ? 'px-1' : ''}`}
          >
            <PlayCircle size={16} className={collapsed ? '' : 'mr-2'} />
            {!collapsed && <span>Launch Demo Guide</span>}
          </button>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {allowedNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-medical-700 text-white font-semibold shadow-inner'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-medical-800 text-medical-200 flex items-center justify-center font-bold text-sm flex-shrink-0">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            {!collapsed && (
              <div className="truncate">
                <p className="text-sm font-medium text-white truncate">{user?.full_name || 'Clinician'}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role?.toLowerCase() || 'doctor'}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-slate-400 hover:text-red-400 p-1.5 rounded hover:bg-slate-800 transition"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};
