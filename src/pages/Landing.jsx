import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ChevronDown, Utensils, MapPin, Clock, Users, Zap, Shield } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';

/* ── Scroll-reveal hook ───────────────────────────── */
function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = '', from = 'bottom' }) {
  const [ref, visible] = useFadeIn();
  const translate = from === 'left' ? '-translate-x-8' : from === 'right' ? 'translate-x-8' : 'translate-y-8';
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${className} ${
        visible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${translate}`
      }`}
    >
      {children}
    </div>
  );
}

/* ── Rotating quotes ──────────────────────────────── */
const quotes = [
  { text: 'The act of giving is not just an action — it is a habit of the heart.', author: 'Mahatma Gandhi' },
  { text: 'No one has ever become poor by giving.', author: 'Anne Frank' },
  { text: 'Hunger is not an issue of charity. It is an issue of justice.', author: 'Jacques Diouf' },
  { text: 'We must learn to live together as brothers or perish together as fools.', author: 'Martin Luther King Jr.' },
  { text: 'The best way to find yourself is to lose yourself in the service of others.', author: 'Mahatma Gandhi' },
];

function QuoteCarousel() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % quotes.length), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative h-32 flex items-center justify-center overflow-hidden">
      {quotes.map((q, i) => (
        <div
          key={i}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 transition-all duration-700"
          style={{ opacity: i === current ? 1 : 0, transform: `translateY(${i === current ? 0 : 20}px)` }}
        >
          <p className="text-xl md:text-2xl font-light italic text-gray-600 max-w-2xl leading-relaxed">
            "{q.text}"
          </p>
          <span className="mt-3 text-sm font-semibold tracking-widest uppercase text-brand">— {q.author}</span>
        </div>
      ))}
    </div>
  );
}

/* ── How it works ─────────────────────────────────── */
const steps = [
  {
    icon: Users,
    step: '01',
    title: 'Register Your Role',
    desc: 'Sign up in seconds as a Donor (restaurant, home, event) or as an NGO / community receiver.',
  },
  {
    icon: Utensils,
    step: '02',
    title: 'List or Discover Food',
    desc: 'Donors post surplus food with details. NGOs browse a live feed and claim donations instantly.',
  },
  {
    icon: MapPin,
    step: '03',
    title: 'Coordinate Pickup',
    desc: 'Connect directly, confirm pickup time and location, then mark the donation complete.',
  },
];

/* ── Advice cards ─────────────────────────────────── */
const tips = [
  { emoji: '🥗', title: 'Donate Fresh, Not Expired', body: 'Always list food with at least 2–3 hours of remaining shelf life. This ensures safety and trust.' },
  { emoji: '📍', title: 'Be Precise With Location', body: 'Include floor, landmark or gate. Easier pickup = faster claim.' },
  { emoji: '🕐', title: 'Set Realistic Expiry Times', body: 'Be conservative. Let NGOs plan smart pickups based on accurate timing.' },
  { emoji: '♻️', title: 'Think Beyond Cooked Meals', body: 'Packaged goods, produce and pantry items near best-before are all valuable.' },
  { emoji: '🤝', title: 'Build Recurring Partnerships', body: 'Consistent donors and NGOs can set up regular pickups for maximum impact.' },
  { emoji: '📣', title: 'Spread the Mission', body: 'Every referral could unlock hundreds more meals. Share with caterers and local businesses.' },
];

/* ── Feature pills ────────────────────────────────── */
const features = [
  { icon: Zap,    label: 'Real-Time Updates' },
  { icon: Shield, label: 'Verified NGOs' },
  { icon: Clock,  label: 'Zero Delay Matching' },
  { icon: Heart,  label: 'Community Driven' },
];

export default function Landing() {
  return (
    <div className="bg-[#f8f8f8] text-gray-900 min-h-screen flex flex-col">
      <AnimatedBackground />
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24">
        {/* Badge */}
        <Reveal delay={0}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-sm font-semibold mb-8 tracking-wide">
            <Heart className="w-3.5 h-3.5 fill-brand" /> Connecting Surplus Food to Real Need
          </span>
        </Reveal>

        {/* Headline */}
        <Reveal delay={80}>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1] text-gray-900">
            Stop Food Waste.
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1] mt-1">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-light">
              Spread Love.
            </span>
          </h1>
        </Reveal>

        {/* Subheading */}
        <Reveal delay={240}>
          <p className="mt-8 text-lg md:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
            A real-time platform where restaurants, homes and caterers donate surplus food
            directly to NGOs and communities — instantly, effortlessly, meaningfully.
          </p>
        </Reveal>

        {/* CTAs */}
        <Reveal delay={320}>
          <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
            <Link
              to="/login"
              className="group px-8 py-4 bg-brand hover:bg-brand-dark text-white rounded-2xl font-bold text-base flex items-center gap-2.5 shadow-2xl shadow-brand/25 transition-all hover:-translate-y-1 hover:shadow-brand/40"
            >
              Start Giving Food
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-white/70 backdrop-blur border border-gray-200 hover:border-brand/50 text-gray-700 rounded-2xl font-bold text-base flex items-center gap-2 transition-all hover:-translate-y-1"
            >
              See How It Works <ChevronDown className="w-4 h-4" />
            </a>
          </div>
        </Reveal>

        {/* Feature pills */}
        <Reveal delay={400}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {features.map(f => {
              const Icon = f.icon;
              return (
                <span key={f.label} className="flex items-center gap-1.5 bg-white/80 backdrop-blur border border-gray-200 px-4 py-2 rounded-full text-sm text-gray-600 shadow-sm">
                  <Icon className="w-3.5 h-3.5 text-brand" /> {f.label}
                </span>
              );
            })}
          </div>
        </Reveal>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce opacity-40">
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </section>

      {/* ══ QUOTES ════════════════════════════════════════ */}
      <section className="relative z-10 py-20 px-6">
        <Reveal>
          <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur border border-gray-200 rounded-3xl px-8 py-12 shadow-sm text-center">
            <span className="text-5xl leading-none text-brand font-serif block mb-2">"</span>
            <QuoteCarousel />
            <div className="flex justify-center gap-2 mt-6">
              {quotes.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand/30" />
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════ */}
      <section id="how-it-works" className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-brand font-semibold text-sm uppercase tracking-widest mb-3">The Process</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">How ServeWithLove Works</h2>
            <p className="text-gray-500 mt-4 max-w-lg mx-auto">
              Three simple steps that turn surplus food into meaningful impact.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.step} delay={i * 120}>
                  <div className="relative bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-brand/20 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center mb-5 group-hover:bg-brand group-hover:text-white transition-all">
                      <Icon className="w-5 h-5 text-brand group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-5xl font-black text-gray-100 absolute top-6 right-7 select-none">{s.step}</span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ ADVICE ════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6 bg-white/50 backdrop-blur border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-brand font-semibold text-sm uppercase tracking-widest mb-3">Best Practices</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Tips for Better Giving</h2>
            <p className="text-gray-500 mt-4 max-w-lg mx-auto">
              Small habits that significantly improve the food donation experience for everyone.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tips.map((tip, i) => (
              <Reveal key={tip.title} delay={i * 60}>
                <div className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-brand/20 transition-all cursor-default">
                  <span className="text-3xl mb-4 block">{tip.emoji}</span>
                  <h3 className="font-bold text-gray-900 mb-2 text-base group-hover:text-brand transition-colors">{tip.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{tip.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════════════ */}
      <section className="relative z-10 py-28 px-6">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand/10 mb-6">
              <Heart className="w-8 h-8 text-brand fill-brand/40" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Every Meal Saved<br />Is a Life Touched.
            </h2>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed">
              Whether you have one plate or a hundred — someone needs it.
              Join ServeWithLove and be the bridge between surplus and need.
            </p>
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 px-10 py-4 bg-brand text-white rounded-2xl font-bold text-lg shadow-2xl shadow-brand/25 hover:bg-brand-dark hover:-translate-y-1 transition-all"
            >
              Get Started — It's Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-gray-100 bg-white/80 backdrop-blur py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Heart className="w-4 h-4 text-brand fill-brand" />
          <span className="font-bold text-gray-800 text-sm">ServeWithLove</span>
        </div>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} ServeWithLove · Built to fight hunger.</p>
      </footer>
    </div>
  );
}
