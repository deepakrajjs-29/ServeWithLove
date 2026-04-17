import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fields = [
  { name: 'foodType',  label: 'Food Type / Description', type: 'text',           placeholder: 'e.g. Veg Biryani, Chapati, Rice…' },
  { name: 'quantity',  label: 'Quantity',                 type: 'text',           placeholder: 'e.g. 20 Kg or 50 Pcs' },
  { name: 'location',  label: 'Pickup Location',          type: 'text',           placeholder: 'Full address for pickup, incl. landmark' },
  { name: 'expiryTime',label: 'Expiry Date & Time',       type: 'datetime-local', placeholder: '' },
];

export default function DonationForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ foodType: '', quantity: '', location: '', expiryTime: '' });

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'donations'), {
        ...formData,
        status: 'available',
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to post donation. Check your Firebase rules.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-1">New Donation</p>
        <h2 className="text-3xl font-black tracking-tight text-gray-900">List Surplus Food</h2>
        <p className="text-gray-500 text-sm mt-2">
          Fill in the details below. Your listing appears in the live feed instantly.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white/70 backdrop-blur border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-200/40">
        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                {f.label}
              </label>
              <input
                type={f.type}
                name={f.name}
                required
                value={formData[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="group w-full flex items-center justify-center gap-2 py-3.5 bg-brand hover:bg-brand-dark text-white rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-brand/25 disabled:opacity-70 mt-2"
          >
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <>Post Donation <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
            }
          </button>
        </form>
      </div>
    </div>
  );
}
