import { Heart, Users, Target, Globe, Code2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';

function useFadeIn(threshold = 0.15) {
  const ref  = useRef(null);
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

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${className} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  );
}

const values = [
  {
    icon: Heart,
    title: 'Mission-First',
    desc: 'Every feature we build is measured by one metric: does it help food reach someone who needs it faster?',
  },
  {
    icon: Users,
    title: 'Community Power',
    desc: 'We believe real change happens at the community level — between neighbours, restaurants and local NGOs.',
  },
  {
    icon: Globe,
    title: 'Zero Hunger',
    desc: "We're aligned with UN SDG 2 — working toward a world where no meal goes to waste while someone goes hungry.",
  },
  {
    icon: Code2,
    title: 'Open Platform',
    desc: 'Built transparently by developers who care. We use free, open technologies to keep costs at zero for all users.',
  },
];

const team = [
  {
    name: 'Deepak Raj',
    role: 'Founder & Developer',
    bio: 'Built ServeWithLove to bridge the gap between food surplus and food poverty. Passionate about technology with purpose.',
    initials: 'DR',
    color: 'from-brand to-brand-dark',
  },
];

const whyItems = [
  { stat: '40%', label: 'of food produced globally is wasted' },
  { stat: '1 in 9', label: 'people worldwide go to bed hungry' },
  { stat: '0 km', label: 'is the distance between surplus and need in most cities' },
];

export default function About() {
  return (
    <div className="bg-[#f8f8f8] text-gray-900 min-h-screen">
      <AnimatedBackground />
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section className="relative z-10 pt-32 pb-20 px-6 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-sm font-semibold mb-6 tracking-wide">
            <Heart className="w-3.5 h-3.5 fill-brand" /> Our Story
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05]">
            Why We Built<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-light">
              ServeWithLove
            </span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            One evening, a restaurant owner near us threw away 30kg of perfectly good food
            while an NGO 2km away had nothing to serve for dinner.
            That gap shouldn't exist. ServeWithLove is our attempt to close it — permanently.
          </p>
        </Reveal>
      </section>

      {/* ══ THE PROBLEM ══════════════════════════════════ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-3">The Problem</p>
            <h2 className="text-4xl font-extrabold tracking-tight">The Numbers That Keep Us Going</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {whyItems.map((w, i) => (
              <Reveal key={w.stat} delay={i * 100}>
                <div className="bg-white/70 backdrop-blur border border-gray-100 rounded-3xl p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <p className="text-5xl font-black text-brand mb-2">{w.stat}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{w.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OUR VALUES ════════════════════════════════════ */}
      <section className="relative z-10 py-20 px-6 bg-white/50 backdrop-blur border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-3">What Drives Us</p>
            <h2 className="text-4xl font-extrabold tracking-tight">Our Core Values</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.title} delay={i * 80}>
                  <div className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 hover:border-brand/20 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand group-hover:text-white transition-all">
                      <Icon className="w-5 h-5 text-brand group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ TEAM ══════════════════════════════════════════ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-3">Behind ServeWithLove</p>
            <h2 className="text-4xl font-extrabold tracking-tight">The People</h2>
          </Reveal>
          <div className="flex justify-center gap-6 flex-wrap">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 100}>
                <div className="bg-white/70 backdrop-blur border border-gray-100 rounded-3xl p-8 text-center w-72 hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-2xl font-black text-white">{m.initials}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900">{m.name}</h3>
                  <p className="text-brand text-xs font-bold uppercase tracking-widest mt-1 mb-3">{m.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{m.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6">
        <Reveal>
          <div className="max-w-xl mx-auto text-center">
            <Target className="w-10 h-10 text-brand mx-auto mb-4" />
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">Be Part of the Solution</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Join thousands of donors, restaurants, and NGOs who are already making a difference — one meal at a time.
            </p>
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-brand text-white rounded-2xl font-bold text-base shadow-xl shadow-brand/25 hover:bg-brand-dark hover:-translate-y-1 transition-all"
            >
              Join ServeWithLove
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
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
