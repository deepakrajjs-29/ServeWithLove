import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DonationCard from '../components/DonationCard';
import DonationForm from '../components/DonationForm';
import AnimatedBackground from '../components/AnimatedBackground';
import { Loader2, Inbox, LayoutDashboard, Map, Heart, PlusCircle, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const LiveMap = lazy(() => import('../components/LiveMap'));

/* ── Helpers ──────────────────────────────────────── */
function getUrgencyScore(expiryTime) {
  const diff = new Date(expiryTime) - new Date();
  return diff; // lower = more urgent
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-gray-300" />
      </div>
      <p className="text-gray-400 font-semibold text-sm max-w-xs">{message}</p>
    </div>
  );
}

/* ── Stats bar ────────────────────────────────────── */
function StatsBar({ donations }) {
  const total     = donations.length;
  const available = donations.filter(d => d.status === 'available').length;
  const requested = donations.filter(d => d.status === 'requested').length;
  const completed = donations.filter(d => d.status === 'completed').length;

  const stats = [
    { label: 'Total Listings', value: total,     icon: LayoutDashboard, color: 'text-brand',        bg: 'bg-brand/10'     },
    { label: 'Available',       value: available, icon: CheckCircle,     color: 'text-emerald-600', bg: 'bg-emerald-50'   },
    { label: 'Requested',       value: requested, icon: Clock,           color: 'text-amber-600',   bg: 'bg-amber-50'     },
    { label: 'Completed',       value: completed, icon: Heart,           color: 'text-brand',        bg: 'bg-brand/10'     },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map(s => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="bg-white/70 backdrop-blur border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}>
              <Icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Sort / filter bar ────────────────────────────── */
function SortBar({ sort, setSort, filter, setFilter }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="flex items-center gap-1 bg-white/80 border border-gray-100 rounded-xl p-1">
        {[
          { key: 'expiry', label: '⏱ Expiry (priority)' },
          { key: 'newest', label: '🆕 Newest first' },
        ].map(opt => (
          <button
            key={opt.key}
            onClick={() => setSort(opt.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sort === opt.key ? 'bg-brand text-white shadow' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 bg-white/80 border border-gray-100 rounded-xl p-1">
        {['all', 'available', 'requested', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
              filter === f ? 'bg-brand text-white shadow' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Live Feed ────────────────────────────────────── */
function LiveFeed({ donations, loading }) {
  const [sort, setSort]   = useState('expiry');
  const [filter, setFilter] = useState('available');

  if (loading) return (
    <div className="flex justify-center py-24">
      <Loader2 className="w-8 h-8 animate-spin text-brand" />
    </div>
  );

  const filtered = filter === 'all' ? donations : donations.filter(d => d.status === filter);
  const sorted   = [...filtered].sort((a, b) =>
    sort === 'expiry'
      ? getUrgencyScore(a.expiryTime) - getUrgencyScore(b.expiryTime)
      : new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      <SortBar sort={sort} setSort={setSort} filter={filter} setFilter={setFilter} />
      {!sorted.length
        ? <EmptyState message="No donations match this filter. Try 'All'." />
        : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {sorted.map(d => <DonationCard key={d.id} donation={d} />)}
          </div>
      }
    </>
  );
}

/* ── My Donations ─────────────────────────────────── */
function MyDonations({ allDonations }) {
  const { user } = useAuth();

  if (!user) return null;

  const mine = allDonations.filter(d =>
    user.role === 'donor' ? d.userId === user.uid : d.requestedBy === user.uid
  );

  const stats = {
    posted:    mine.filter(d => d.status === 'available').length,
    requested: mine.filter(d => d.status === 'requested').length,
    completed: mine.filter(d => d.status === 'completed').length,
  };

  return (
    <>
      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: user.role === 'donor' ? 'Active Listings' : 'Active Requests', value: stats.posted,    color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'In Progress', value: stats.requested, color: 'text-amber-600',   bg: 'bg-amber-50'   },
          { label: 'Completed',   value: stats.completed, color: 'text-brand',        bg: 'bg-brand/10'   },
        ].map(s => (
          <div key={s.label} className="bg-white/70 backdrop-blur border border-gray-100 rounded-2xl p-4 text-center">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {!mine.length
        ? <EmptyState message={user.role === 'donor'
            ? "You haven't posted any donations yet. Click 'Add Donation' to get started!"
            : "You haven't requested any donations yet. Browse the Live Feed!"}
          />
        : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {mine
              .sort((a, b) => getUrgencyScore(a.expiryTime) - getUrgencyScore(b.expiryTime))
              .map(d => <DonationCard key={d.id} donation={d} />)
            }
          </div>
      }
    </>
  );
}

/* ── Map View ─────────────────────────────────────── */
function MapView({ donations }) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-1">Live Tracking</p>
        <h2 className="text-2xl font-black text-gray-900">Donation Map</h2>
        <p className="text-gray-500 text-sm mt-1">
          Real-time map of all active donation locations. Click a pin for details.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-5">
        {[
          { color: '#22c55e', label: 'Available' },
          { color: '#f59e0b', label: 'Requested' },
          { color: '#94a3b8', label: 'Completed' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2 bg-white/70 border border-gray-100 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700">
            <span className="w-3 h-3 rounded-full" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      <Suspense fallback={
        <div className="rounded-2xl bg-gray-100 flex items-center justify-center" style={{ height: '420px' }}>
          <Loader2 className="w-7 h-7 animate-spin text-brand" />
        </div>
      }>
        <LiveMap donations={donations} />
      </Suspense>
    </div>
  );
}

/* ── Sidebar tabs in dashboard ────────────────────── */
function DashTabs({ role }) {
  const location = useLocation();
  const tabs = [
    { to: '/dashboard',              label: 'Live Feed',    icon: LayoutDashboard },
    { to: '/dashboard/map',          label: 'Map View',     icon: Map             },
    ...(role === 'donor'
      ? [{ to: '/dashboard/add-donation', label: 'Add Donation', icon: PlusCircle }]
      : []),
    { to: '/dashboard/my-donations', label: 'My Donations', icon: Heart           },
  ];
  return (
    <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 pb-4">
      {tabs.map(t => {
        const Icon = t.icon;
        const active = location.pathname === t.to;
        return (
          <Link
            key={t.to}
            to={t.to}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              active ? 'bg-brand text-white shadow-md shadow-brand/20' : 'bg-white/70 border border-gray-100 text-gray-600 hover:border-brand/30 hover:text-brand'
            }`}
          >
            <Icon className="w-4 h-4" /> {t.label}
          </Link>
        );
      })}
    </div>
  );
}

/* ── Dashboard ────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'donations'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q,
      snap => { setDonations(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); },
      err  => { console.error(err); setLoading(false); }
    );
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f8f8] relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <Sidebar />

      <main className="ml-60 pt-16 min-h-screen relative z-10">
        <div className="p-8 max-w-6xl mx-auto">
          {/* Page header */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-1">Dashboard</p>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              {user?.role === 'donor' ? 'Your Donor Hub' : 'NGO Control Centre'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {user?.role === 'donor'
                ? 'Post surplus food and track your listings in real time.'
                : 'Browse available donations and coordinate pickups.'}
            </p>
          </div>

          {/* Stats */}
          <StatsBar donations={donations} />

          {/* Tab nav */}
          <DashTabs role={user?.role} />

          {/* Routes */}
          <Routes>
            <Route path="/"              element={<LiveFeed donations={donations} loading={loading} />} />
            <Route path="/map"           element={<MapView  donations={donations} />} />
            <Route path="/my-donations"  element={<MyDonations allDonations={donations} />} />
            {user?.role === 'donor' && (
              <Route path="/add-donation" element={<DonationForm />} />
            )}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
