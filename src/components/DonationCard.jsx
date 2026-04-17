import { Clock, MapPin, Package, AlertTriangle, CheckCircle2, Clock3 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const statusConfig = {
  available: { label: 'Available', classes: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  requested: { label: 'Requested', classes: 'bg-amber-50 text-amber-600 border-amber-100' },
  completed: { label: 'Completed', classes: 'bg-gray-100 text-gray-500 border-gray-200' },
};

function getUrgency(expiryTime) {
  const diff = new Date(expiryTime) - new Date();
  const hrs = diff / 36e5;
  if (hrs < 0) return 'expired';
  if (hrs < 2) return 'critical';
  if (hrs < 6) return 'soon';
  return 'ok';
}

const urgencyConfig = {
  expired: { label: 'Expired', cls: 'bg-gray-100 text-gray-500', Icon: Clock3 },
  critical: { label: '< 2 hrs left!', cls: 'bg-red-100 text-red-600', Icon: AlertTriangle },
  soon: { label: 'Expiring soon', cls: 'bg-amber-100 text-amber-700', Icon: Clock },
  ok: { label: 'Fresh', cls: 'bg-emerald-100 text-emerald-700', Icon: CheckCircle2 },
};

function timeLeft(expiryTime) {
  const diff = new Date(expiryTime) - new Date();
  if (diff <= 0) return 'Expired';
  const h = Math.floor(diff / 36e5);
  const m = Math.floor((diff % 36e5) / 6e4);
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
}

export default function DonationCard({ donation }) {
  const { user } = useAuth();
  const status = statusConfig[donation.status] || statusConfig.available;
  const urgency = getUrgency(donation.expiryTime);
  const urg = urgencyConfig[urgency];
  const UrgIcon = urg.Icon;

  const handleClaim = async () => {
    try {
      await updateDoc(doc(db, 'donations', donation.id), {
        status: 'requested',
        requestedBy: user.uid,
      });
    } catch (e) {
      alert('Failed to claim donation.');
    }
  };

  const handleComplete = async () => {
    try {
      await updateDoc(doc(db, 'donations', donation.id), { status: 'completed' });
    } catch (e) {
      alert('Failed to mark as completed.');
    }
  };

  const isCritical = urgency === 'critical';
  const isExpired = urgency === 'expired';

  return (
    <div className={`group bg-white/70 backdrop-blur border rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all ${
      isCritical ? 'border-red-200 hover:border-red-300' : 'border-gray-100 hover:border-brand/20'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-extrabold tracking-tight text-gray-900 leading-tight flex-1 pr-2">
          {donation.foodType}
        </h3>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider flex-shrink-0 ${status.classes}`}>
          {status.label}
        </span>
      </div>

      {/* Urgency badge */}
      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg mb-4 ${urg.cls}`}>
        <UrgIcon className="w-3.5 h-3.5" />
        {urg.label} · {timeLeft(donation.expiryTime)}
      </div>

      {/* Meta */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Package className="w-3.5 h-3.5 text-gray-400" />
          </div>
          {donation.quantity}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <span className="truncate">{donation.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
          </div>
          {new Date(donation.expiryTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
        </div>
      </div>

      {/* Actions */}
      {!isExpired && user?.role === 'ngo' && donation.status === 'available' && (
        <button
          onClick={handleClaim}
          className="w-full py-2.5 bg-brand text-white rounded-xl font-bold text-sm hover:bg-brand-dark transition-all hover:-translate-y-0.5 shadow-md shadow-brand/20"
        >
          Request Donation
        </button>
      )}
      {user?.role === 'donor' && donation.userId === user?.uid && donation.status === 'requested' && (
        <button
          onClick={handleComplete}
          className="w-full py-2.5 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all hover:-translate-y-0.5 shadow-md shadow-emerald-200"
        >
          Mark as Completed ✓
        </button>
      )}
    </div>
  );
}
