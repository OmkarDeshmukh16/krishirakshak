import { Link } from 'react-router-dom';
import { Activity, Leaf, AlertTriangle, Users, TrendingUp, ArrowRight, Eye, Zap } from 'lucide-react';
import { StatCard, WeatherCard, RiskBadge, HealthScore, AlertCard } from '../../components/ui/index';
import { WEATHER, CROPS, NOTIFICATIONS, EXPERT_REQUESTS, RISK_FORECAST } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t('goodMorning');
    if (h < 17) return t('goodAfternoon');
    return t('goodEvening');
  };

  const riskData = RISK_FORECAST.sevenDay;
  const highRiskCrops = CROPS.filter(c => c.riskLevel === 'high' || c.riskLevel === 'moderate').slice(0, 3);
  const recentNotifs = NOTIFICATIONS.slice(0, 3);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display">{getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-green-200 text-sm mt-1">📍 {user?.village}, {user?.district}, Maharashtra</p>
            <p className="text-green-300 text-xs mt-2 font-medium">Kisan ID: {user?.kisan_id}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-center">
              <p className="text-green-200 text-xs">Today</p>
              <p className="text-white font-bold">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
            </div>
            <Link to="/farmer/assessment" className="bg-white text-green-800 font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:shadow-lg transition-all hover:-translate-y-0.5">
              <Zap className="w-4 h-4" /> AI Scan
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('cropHealth')} value="78%" subtitle="Average across all crops" icon={Activity} color="green" trend={{ up: false, label: '-4% this week' }} />
        <StatCard title={t('activeCrops')} value="4" subtitle="Across 2 farms" icon={Leaf} color="blue" />
        <StatCard title={t('highRiskAlerts')} value="2" subtitle="Require attention" icon={AlertTriangle} color="red" />
        <StatCard title={t('expertRequests')} value="1" subtitle="Under review" icon={Users} color="amber" />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Risk Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">7-Day Risk Forecast</h3>
              <p className="text-xs text-gray-400 mt-0.5">Disease · Pest · Weather risk levels</p>
            </div>
            <Link to="/farmer/risk" className="text-xs text-green-600 font-medium hover:underline flex items-center gap-1">
              View Details <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={riskData}>
              <defs>
                <linearGradient id="colorDisease" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorWeather" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(v, name) => [`${v}%`, name.charAt(0).toUpperCase() + name.slice(1)]}
              />
              <Area type="monotone" dataKey="disease" stroke="#ef4444" strokeWidth={2} fill="url(#colorDisease)" name="disease" />
              <Area type="monotone" dataKey="pest" stroke="#f59e0b" strokeWidth={2} fill="url(#colorPest)" name="pest" />
              <Area type="monotone" dataKey="weather" stroke="#3b82f6" strokeWidth={2} fill="url(#colorWeather)" name="weather" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-3">
            {[['#ef4444', 'Disease Risk'], ['#f59e0b', 'Pest Risk'], ['#3b82f6', 'Weather Risk']].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-3 h-0.5 rounded" style={{ backgroundColor: c }} />
                {l}
              </div>
            ))}
          </div>
        </div>

        {/* Weather */}
        <WeatherCard data={WEATHER.current} />
      </div>

      {/* Crops at Risk + Recent Alerts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Crops */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">My Crops — Health Status</h3>
            <Link to="/farmer/crops" className="text-xs text-green-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {CROPS.map((crop) => (
              <Link key={crop.id} to={`/farmer/crops/${crop.id}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <HealthScore score={crop.healthScore} size={52} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{crop.name}</p>
                  <p className="text-xs text-gray-400">{crop.stage} · {crop.area}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <RiskBadge level={crop.riskLevel} />
                  <Eye className="w-3.5 h-3.5 text-gray-300 group-hover:text-green-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Alerts</h3>
            <Link to="/farmer/notifications" className="text-xs text-green-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentNotifs.map((n) => (
              <AlertCard key={n.id} type={n.color} title={n.title} message={n.message} date={n.date} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/farmer/assessment', icon: '📸', label: 'AI Assessment', color: 'bg-green-100 text-green-700' },
            { to: '/farmer/expert-support', icon: '👨‍🔬', label: 'Ask Expert', color: 'bg-blue-100 text-blue-700' },
            { to: '/farmer/assistant', icon: '🤖', label: 'AI Assistant', color: 'bg-purple-100 text-purple-700' },
            { to: '/farmer/community', icon: '💬', label: 'Community', color: 'bg-amber-100 text-amber-700' },
          ].map((a) => (
            <Link key={a.to} to={a.to} className={`${a.color} rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all hover:-translate-y-0.5 text-center`}>
              <span className="text-2xl">{a.icon}</span>
              <span className="text-xs font-semibold">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
