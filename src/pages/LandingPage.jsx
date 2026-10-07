import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Shield, TrendingUp, Users, Globe, ArrowRight, CheckCircle2, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HOW_IT_WORKS = [
  { step: '01', icon: '📸', title: 'Upload Crop Image', desc: 'Take a photo of your crop and upload it to the platform for analysis.' },
  { step: '02', icon: '🤖', title: 'AI Health Assessment', desc: 'Our AI model analyzes the image and identifies possible diseases or pests with confidence scores.' },
  { step: '03', icon: '📊', title: 'Risk Forecast', desc: 'Get 3-day and 7-day disease and pest risk forecasts based on weather and crop data.' },
  { step: '04', icon: '📋', title: 'Actionable Advisory', desc: 'Receive clear, simple guidance on what to monitor and what steps to take.' },
  { step: '05', icon: '👨‍🔬', title: 'Expert Validation', desc: 'Agriculture experts review uncertain AI findings and provide verified recommendations.' },
  { step: '06', icon: '🔄', title: 'Continuous Monitoring', desc: 'Track crop health over time and receive proactive alerts before problems escalate.' },
];

const BENEFITS = [
  { icon: '🎯', title: 'Early Disease Detection', desc: 'Identify crop diseases before they spread and cause major losses.' },
  { icon: '🦗', title: 'Pest Risk Monitoring', desc: 'Track pest pressure and get timely warnings to protect your crop yield.' },
  { icon: '🌦️', title: 'Weather-Based Forecasting', desc: 'Risk predictions powered by weather patterns, crop stage, and historical data.' },
  { icon: '🧑‍🌾', title: 'Expert Assistance', desc: 'Direct access to certified agriculture experts for validation and guidance.' },
  { icon: '🌐', title: 'Multilingual Support', desc: 'Use the platform in English, Marathi, or Hindi — your language, your choice.' },
  { icon: '📍', title: 'Regional Hotspot Monitoring', desc: 'District-level risk maps help officers take preventive action in time.' },
];

const ROLES = [
  {
    role: 'Farmer',
    icon: '🌾',
    color: 'from-green-500 to-emerald-600',
    features: ['Upload crop images for AI assessment', 'Get 7-day risk forecasts', 'Request expert guidance', 'Community farming insights'],
  },
  {
    role: 'Agriculture Expert',
    icon: '🔬',
    color: 'from-blue-500 to-cyan-600',
    features: ['Review AI assessments', 'Validate or modify findings', 'Send personalized advisories', 'Manage farmer case requests'],
  },
  {
    role: 'Agriculture Officer',
    icon: '🏛️',
    color: 'from-purple-500 to-violet-600',
    features: ['District-wide risk dashboard', 'Hotspot map visualization', 'Send regional alerts', 'Analytics & trend reports'],
  },
];

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'farmer') navigate('/farmer/dashboard');
      else if (user.role === 'expert') navigate('/expert/dashboard');
      else if (user.role === 'officer') navigate('/officer/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow-md">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-green-800 text-lg">KrishiRakshak</span>
              <span className="hidden sm:inline text-gray-400 text-xs ml-2">| SIH 2024</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md hover:shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              Demo Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-green-400 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-emerald-300 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-green-300 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-green-200 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                SIH Problem Statement 26131 — Agriculture Technology
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-tight mb-6">
                Protect Every Crop{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
                  Before the Problem Spreads
                </span>
              </h1>
              <p className="text-lg text-green-100 mb-8 max-w-xl leading-relaxed">
                AI-powered crop health monitoring for early disease detection, risk forecasting, expert validation and smarter agricultural decisions.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  to="/login"
                  className="bg-white text-green-800 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Demo Login <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="border border-white/30 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/10 transition-all"
                >
                  Explore Platform
                </a>
              </div>
              <div className="flex flex-wrap gap-6 text-green-200 text-sm">
                {['12,847 Farmers', '342 Experts', '8 Districts'].map((s) => (
                  <div key={s} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual — Dashboard Preview */}
            <div className="animate-slide-in-right hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-2xl rounded-3xl" />
                <div className="relative glass-dark rounded-3xl p-6 border border-green-500/20 shadow-2xl animate-float">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <Sprout className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">KrishiRakshak</p>
                      <p className="text-green-400 text-xs">Crop Health Dashboard</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-green-400 text-xs">Live Demo</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label: 'Crop Health', value: '78%', color: 'text-green-400', bg: 'bg-green-500/20' },
                      { label: 'Active Crops', value: '4', color: 'text-blue-400', bg: 'bg-blue-500/20' },
                      { label: 'High Risk', value: '2', color: 'text-red-400', bg: 'bg-red-500/20' },
                      { label: 'Expert Requests', value: '1', color: 'text-amber-400', bg: 'bg-amber-500/20' },
                    ].map((s) => (
                      <div key={s.label} className={`${s.bg} rounded-xl p-3`}>
                        <p className="text-gray-400 text-xs">{s.label}</p>
                        <p className={`${s.color} text-2xl font-bold font-display`}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 text-sm">🔴</span>
                      <div>
                        <p className="text-red-300 text-xs font-semibold">High Risk Alert</p>
                        <p className="text-red-400/80 text-xs">Tomato — Possible Early Blight · 87% confidence</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 text-sm">⛈️</span>
                      <div>
                        <p className="text-amber-300 text-xs font-semibold">Weather Advisory</p>
                        <p className="text-amber-400/80 text-xs">Heavy rain next 48h — Fungal risk HIGH</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-green-600 text-sm font-semibold tracking-wider uppercase">Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 font-display mt-2">How It Works</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">From field observation to expert-validated action — KrishiRakshak guides every step.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm card-hover">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Step {item.step}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-green-600 text-sm font-semibold tracking-wider uppercase">Benefits</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 font-display mt-2">Platform Benefits</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm card-hover">
                <span className="text-3xl flex-shrink-0">{b.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{b.title}</h3>
                  <p className="text-gray-500 text-sm">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section className="py-20 bg-gradient-to-br from-green-950 to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-green-400 text-sm font-semibold tracking-wider uppercase">User Roles</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mt-2">Built for Everyone in Agriculture</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {ROLES.map((r) => (
              <div key={r.role} className="glass-dark rounded-2xl p-6 border border-white/10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center text-3xl mb-5 shadow-lg`}>
                  {r.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{r.role}</h3>
                <ul className="space-y-2">
                  {r.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-green-200 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 font-display mb-4">
            Ready to protect your crops?
          </h2>
          <p className="text-gray-500 mb-8">Explore the full platform with our demo — no registration required.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            Start Demo <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center">
            <Sprout className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white font-semibold">KrishiRakshak</span>
        </div>
        <p>Early Detection. Smarter Decisions. Healthier Crops.</p>
        <p className="mt-1 text-gray-600">SIH 2024 · Problem Statement 26131 · Frontend Prototype</p>
      </footer>
    </div>
  );
}
