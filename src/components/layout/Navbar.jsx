import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Globe, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'mr', label: 'मराठी', short: 'MR' },
  { code: 'hi', label: 'हिन्दी', short: 'HI' },
];

export default function Navbar({ onMenuClick, unreadCount = 0 }) {
  const { user } = useAuth();
  const { t, lang, changeLanguage } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();

  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t('goodMorning');
    if (h < 17) return t('goodAfternoon');
    return t('goodEvening');
  };

  const notifPath =
    user?.role === 'farmer' ? '/farmer/notifications' :
    user?.role === 'expert' ? '/expert/dashboard' :
    '/officer/dashboard';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 gap-4 sticky top-0 z-20 shadow-sm">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Greeting */}
      <div className="hidden sm:flex flex-col min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {getGreeting()}, {user?.name?.split(' ')[0]} 👋
        </p>
        <p className="text-xs text-gray-400">
          {user?.role === 'farmer' ? `${user.village || user.taluka}, ${user.district}` :
           user?.role === 'expert' ? user.institution :
           user?.department}
        </p>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-52">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full"
        />
      </div>

      {/* Language Switcher */}
      <div className="relative">
        <button
          onClick={() => setLangOpen(!langOpen)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-600 border border-gray-200"
        >
          <Globe className="w-4 h-4 text-green-600" />
          <span className="hidden sm:block">{currentLang.short}</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        {langOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-32 z-50 animate-fade-in">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { changeLanguage(l.code); setLangOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${lang === l.code ? 'text-green-600 font-semibold bg-green-50' : 'text-gray-700'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      <button
        onClick={() => navigate(notifPath)}
        className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-green-600 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0 cursor-pointer">
        <span className="text-white text-sm font-bold">{user?.name?.[0]}</span>
      </div>
    </header>
  );
}
