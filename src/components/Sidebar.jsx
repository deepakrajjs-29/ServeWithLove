import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Heart, LogOut, User, Map } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Live Feed',    path: '/dashboard',              icon: LayoutDashboard },
    { name: 'Map View',     path: '/dashboard/map',          icon: Map             },
    ...(user?.role === 'donor'
      ? [{ name: 'Add Donation', path: '/dashboard/add-donation', icon: PlusCircle }]
      : []),
    { name: 'My Donations', path: '/dashboard/my-donations', icon: Heart           },
  ];

  return (
    <aside className="w-60 bg-white/70 backdrop-blur-xl border-r border-gray-200/60 min-h-screen flex flex-col pt-16 fixed left-0 top-0 z-40">
      {/* User chip */}
      <div className="p-4 m-3 bg-gray-50/80 rounded-2xl border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-800 truncate">{user?.email}</p>
            <span className="text-xs font-bold text-brand uppercase tracking-widest">
              {user?.role || 'user'}
            </span>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-2 px-3 flex flex-col gap-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-2 py-2">
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-brand text-white shadow-md shadow-brand/20'
                  : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-red-500 hover:bg-red-50 rounded-xl text-sm font-semibold transition-all"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
