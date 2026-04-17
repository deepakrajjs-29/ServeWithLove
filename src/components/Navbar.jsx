import { Link, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-xl border-b border-gray-200/60 z-50">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center group-hover:bg-brand/20 transition-colors">
              <Heart className="w-4 h-4 text-brand fill-brand/60" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-gray-900">
              Serve<span className="text-brand">WithLove</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  location.pathname === link.to
                    ? 'bg-brand/10 text-brand'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          {user ? (
            <Link
              to="/dashboard"
              className="px-5 py-2 bg-brand text-white rounded-xl font-semibold text-sm hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-md shadow-brand/20"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 bg-brand text-white rounded-xl font-semibold text-sm hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-md shadow-brand/20"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
