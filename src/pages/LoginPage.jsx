import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const DEMO_ACCOUNTS = [
  { role: 'farmer', label: 'Login as Farmer', icon: '🌾', email: 'farmer@demo.com', color: 'from-green-500 to-emerald-600', desc: 'Rajesh Patil · Nashik, Maharashtra' },
  { role: 'expert', label: 'Login as Expert', icon: '🔬', email: 'expert@demo.com', color: 'from-blue-500 to-cyan-600', desc: 'Dr. Priya Sharma · Plant Pathologist' },
  { role: 'officer', label: 'Login as Officer', icon: '🏛️', email: 'officer@demo.com', color: 'from-purple-500 to-violet-600', desc: 'Suresh Deshmukh · Nashik Division' },
];

export default function LoginPage() {
  const { user, login, loginAs, loading, error, setError } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [quickLoading, setQuickLoading] = useState(null);

  useEffect(() => {
    if (user) redirectUser(user.role);
  }, [user]);

  const redirectUser = (role) => {
    if (role === 'farmer') navigate('/farmer/dashboard');
    else if (role === 'expert') navigate('/expert/dashboard');
    else if (role === 'officer') navigate('/officer/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    try {
      const u = await login(form.email, form.password);
      addToast(`Welcome back, ${u.name.split(' ')[0]}!`, 'success');
      redirectUser(u.role);
    } catch {}
  };

  const handleQuickLogin = (role) => {
    setQuickLoading(role);
    setTimeout(() => {
      loginAs(role);
      addToast(`Logged in as ${DEMO_ACCOUNTS.find(a => a.role === role)?.label.replace('Login as ', '')}`, 'success');
      setQuickLoading(null);
      redirectUser(role);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-green-400 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-emerald-300 blur-3xl" />
      </div>

      <div className="w-full max-w-4xl relative z-10 grid md:grid-cols-2 gap-6">
        {/* Left — Branding */}
        <div className="text-white flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl">
              <Sprout className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white">KrishiRakshak</h1>
              <p className="text-green-300 text-xs">Crop Health Platform</p>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display leading-tight mb-4">
            Early Detection.<br />
            <span className="text-green-300">Smarter Decisions.</span><br />
            Healthier Crops.
          </h2>
          <p className="text-green-200 text-sm leading-relaxed mb-8">
            The AI-powered platform connecting farmers, agriculture experts and officers for proactive crop health management.
          </p>
          <div className="space-y-3">
            {['AI Disease & Pest Assessment', '3/7-Day Risk Forecasting', 'Expert Validation Workflow', 'Multilingual — EN | मराठी | हिन्दी'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-green-200 text-sm">
                <span className="w-5 h-5 rounded-full bg-green-500/30 border border-green-400/40 flex items-center justify-center text-xs text-green-300">✓</span>
                {f}
              </div>
            ))}
          </div>

          {/* SIH badge */}
          <div className="mt-8 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="text-white font-semibold text-xs">Smart India Hackathon 2024</p>
              <p className="text-green-300 text-xs">Problem Statement #26131 — Agriculture</p>
            </div>
          </div>
        </div>

        {/* Right — Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-800 font-display mb-1">Welcome Back</h2>
          <p className="text-gray-400 text-sm mb-6">Sign in to access your dashboard</p>

          {/* Demo Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-amber-700 text-xs font-medium">⚠️ Demo Mode — No real authentication or backend connected.</p>
          </div>

          {/* Quick Login Buttons */}
          <div className="space-y-2 mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Demo Access</p>
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                onClick={() => handleQuickLogin(acc.role)}
                disabled={quickLoading !== null}
                className={`w-full flex items-center gap-3 bg-gradient-to-r ${acc.color} text-white rounded-xl px-4 py-3 text-sm font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <span className="text-xl">{acc.icon}</span>
                <div className="text-left flex-1">
                  <p className="font-semibold">{acc.label}</p>
                  <p className="text-white/70 text-xs">{acc.desc}</p>
                </div>
                {quickLoading === acc.role ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <ArrowRight className="w-4 h-4 opacity-70" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or sign in manually</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => { setForm(f => ({ ...f, email: e.target.value })); setError(''); }}
                  placeholder="farmer@demo.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => { setForm(f => ({ ...f, password: e.target.value })); setError(''); }}
                  placeholder="123456"
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
              <p className="font-medium text-gray-600">Demo Credentials:</p>
              <p>🌾 farmer@demo.com / 123456</p>
              <p>🔬 expert@demo.com / 123456</p>
              <p>🏛️ officer@demo.com / 123456</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-green-700 hover:to-emerald-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Signing In...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-4 text-xs text-gray-400">
            <Link to="/" className="text-green-600 hover:underline">← Back to homepage</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
