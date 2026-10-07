import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Leaf, MapPin, TrendingUp, CloudSun, BookOpen,
  Users, Bell, User, LogOut, ChevronLeft, ChevronRight, Sprout,
  MessageSquare, Bot, ShieldAlert, BarChart3, Map, Megaphone, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const FARMER_NAV = (t) => [
  { to: '/farmer/dashboard', icon: LayoutDashboard, label: t('dashboard') },
  { to: '/farmer/farms', icon: MapPin, label: t('farms') },
  { to: '/farmer/crops', icon: Leaf, label: t('crops') },
  { to: '/farmer/assessment', icon: ShieldAlert, label: t('assessment') },
  { to: '/farmer/risk', icon: TrendingUp, label: t('risk') },
  { to: '/farmer/weather', icon: CloudSun, label: t('weather') },
  { to: '/farmer/advisory', icon: BookOpen, label: t('advisory') },
  { to: '/farmer/expert-support', icon: Users, label: t('expertSupport') },
  { to: '/farmer/assistant', icon: Bot, label: t('assistant') },
  { to: '/farmer/community', icon: MessageSquare, label: t('community') },
  { to: '/farmer/notifications', icon: Bell, label: t('notifications') },
  { to: '/farmer/profile', icon: User, label: t('profile') },
];

const EXPERT_NAV = (t) => [
  { to: '/expert/dashboard', icon: LayoutDashboard, label: t('dashboard') },
  { to: '/expert/requests', icon: Users, label: t('requests') },
  { to: '/expert/profile', icon: User, label: t('profile') },
];

const OFFICER_NAV = (t) => [
  { to: '/officer/dashboard', icon: LayoutDashboard, label: t('dashboard') },
  { to: '/officer/hotspots', icon: Map, label: t('hotspots') },
  { to: '/officer/analytics', icon: BarChart3, label: t('analytics') },
  { to: '/officer/alerts', icon: Megaphone, label: t('alerts') },
  { to: '/officer/profile', icon: User, label: t('profile') },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const getNav = () => {
    if (user?.role === 'farmer') return FARMER_NAV(t);
    if (user?.role === 'expert') return EXPERT_NAV(t);
    if (user?.role === 'officer') return OFFICER_NAV(t);
    return [];
  };

  const getRoleBadge = () => {
    if (user?.role === 'farmer') return { label: 'Farmer', color: 'bg-green-100 text-green-700' };
    if (user?.role === 'expert') return { label: 'Agri Expert', color: 'bg-blue-100 text-blue-700' };
    if (user?.role === 'officer') return { label: 'Agri Officer', color: 'bg-purple-100 text-purple-700' };
    return { label: '', color: '' };
  };

  const badge = getRoleBadge();
  const navItems = getNav();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className={`h-full flex flex-col bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-100 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-md">
          <Sprout className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="font-display font-bold text-green-800 text-base leading-tight truncate">{t('appName')}</h1>
            <p className="text-[10px] text-gray-400 leading-tight truncate">Crop Health Platform</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto hidden md:flex w-6 h-6 rounded-full border border-gray-200 items-center justify-center text-gray-400 hover:text-green-600 hover:border-green-300 transition-all flex-shrink-0"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">{user.name?.[0]}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${badge.color}`}>{badge.label}</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `sidebar-link mb-0.5 ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className={`sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600 ${collapsed ? 'justify-center px-0' : ''}`}
          title={collapsed ? t('logout') : undefined}
        >
          <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
          {!collapsed && <span>{t('logout')}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex h-screen sticky top-0 flex-shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={onMobileClose} />
          <div className="relative z-10 flex h-full">
            <div className="w-64 h-full flex flex-col bg-white shadow-2xl">
              <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow-md">
                    <Sprout className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-display font-bold text-green-800 text-base">{t('appName')}</h1>
                    <p className="text-[10px] text-gray-400">Crop Health Platform</p>
                  </div>
                </div>
                <button onClick={onMobileClose} className="p-1.5 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              {user && (
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{user.name?.[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${badge.color}`}>{badge.label}</span>
                    </div>
                  </div>
                </div>
              )}
              <nav className="flex-1 py-3 px-2 overflow-y-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onMobileClose}
                    className={({ isActive }) => `sidebar-link mb-0.5 ${isActive ? 'active' : ''}`}
                  >
                    <item.icon className="w-4.5 h-4.5" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="p-3 border-t border-gray-100">
                <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600">
                  <LogOut className="w-4.5 h-4.5" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
