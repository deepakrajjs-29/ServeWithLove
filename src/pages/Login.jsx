import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, role);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center group-hover:bg-brand/20 transition-colors">
              <Heart className="w-5 h-5 text-brand fill-brand/60" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900">
              Serve<span className="text-brand">WithLove</span>
            </span>
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 mt-4">
            {isLogin ? 'Welcome back.' : 'Join the mission.'}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {isLogin
              ? 'Sign in to manage your donations in real time.'
              : 'Create an account and start making a difference today.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-8 shadow-xl shadow-gray-200/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Role selector — register only */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                  I am a…
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'donor', label: '🍱 Donor' },
                    { value: 'ngo', label: '🤝 NGO / Receiver' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRole(opt.value)}
                      className={`py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                        role === opt.value
                          ? 'bg-brand text-white shadow-lg shadow-brand/25'
                          : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 py-3.5 bg-brand hover:bg-brand-dark text-white rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-brand/25 disabled:opacity-70 disabled:translate-y-0 mt-2"
            >
              {loading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
              }
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <span className="text-sm text-gray-500">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm font-bold text-brand hover:text-brand-dark transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
