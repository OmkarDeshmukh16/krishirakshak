import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { NOTIFICATIONS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loginAs } = useAuth();
  
  // Auto-init to farmer demo account if visited directly without logging in
  if (!user) {
    loginAs('farmer');
  }

  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setMobileOpen(true)} unreadCount={unread} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto w-full page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
