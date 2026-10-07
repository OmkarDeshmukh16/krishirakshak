import { PageHeader, ChartCard, RiskBadge } from '../../components/ui/index';
import { RISK_FORECAST } from '../../data/mockData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, Legend,
} from 'recharts';
import { Info } from 'lucide-react';

const DAY_RISK_COLORS = { moderate: 'border-amber-400 bg-amber-50', high: 'border-red-400 bg-red-50', low: 'border-green-400 bg-green-50' };
const DAY_RISK_ICONS = { moderate: '⚠️', high: '🔴', low: '✅' };

export default function RiskPage() {
  const { threeDay, sevenDay, riskFactors } = RISK_FORECAST;

  const radarData = riskFactors.map(f => ({
    factor: f.factor,
    value: typeof f.value === 'number' ? f.value : 70,
  }));

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Risk Forecast"
        subtitle="Disease, pest and weather risk levels based on environmental and crop data"
        breadcrumb="Risk Forecast"
      />

      {/* Risk Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          <strong>How risk is calculated:</strong> Risk levels are influenced by weather patterns (humidity, rainfall, temperature), crop growth stage, variety susceptibility, soil type, location data and historical pest/disease records. This is a predictive estimate — not a confirmed diagnosis.
        </p>
      </div>

      {/* 3-Day Forecast */}
      <div>
        <h2 className="font-bold text-gray-800 text-lg mb-4">3-Day Risk Forecast</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {threeDay.map((day) => (
            <div key={day.day} className={`border-l-4 rounded-2xl p-5 ${DAY_RISK_COLORS[day.overall] || 'border-gray-300 bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800">{day.day}</h3>
                <div className="flex items-center gap-2">
                  <span>{DAY_RISK_ICONS[day.overall]}</span>
                  <RiskBadge level={day.overall} />
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Disease Risk', value: day.disease, color: '#ef4444' },
                  { label: 'Pest Risk', value: day.pest, color: '#f59e0b' },
                  { label: 'Weather Risk', value: day.weather, color: '#3b82f6' },
                ].map((r) => (
                  <div key={r.label}>
                    <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                      <span>{r.label}</span>
                      <span className="font-bold">{r.value}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${r.value}%`, backgroundColor: r.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Chart */}
      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="7-Day Risk Trend" subtitle="Risk percentage over next 7 days" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={sevenDay}>
              <defs>
                <linearGradient id="gDisease" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gPest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gWeather" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(v) => [`${v}%`]}
              />
              <Area type="monotone" dataKey="disease" stroke="#ef4444" strokeWidth={2.5} fill="url(#gDisease)" name="Disease Risk" />
              <Area type="monotone" dataKey="pest" stroke="#f59e0b" strokeWidth={2.5} fill="url(#gPest)" name="Pest Risk" />
              <Area type="monotone" dataKey="weather" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gWeather)" name="Weather Risk" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Risk Factors */}
        <ChartCard title="Risk Factors" subtitle="Current contributing factors">
          <div className="space-y-3">
            {riskFactors.map((f) => (
              <div key={f.factor} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-700">{f.factor}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${f.impact === 'high' ? 'bg-red-100 text-red-700' : f.impact === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {f.impact}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{f.description}</p>
                {typeof f.value === 'number' && (
                  <div className="bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${f.impact === 'high' ? 'bg-red-500' : f.impact === 'moderate' ? 'bg-amber-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(f.value, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Advisory Callout */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <span className="text-3xl">⚠️</span>
          <div>
            <h3 className="font-bold text-red-800 mb-1">High Risk Advisory — Next 3 Days</h3>
            <p className="text-sm text-red-700 mb-3">Predicted high disease and weather risk conditions for Nashik region. Tomato crops at flowering stage are particularly vulnerable.</p>
            <div className="flex flex-wrap gap-3">
              <a href="/farmer/advisory" className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors">
                View Advisory →
              </a>
              <a href="/farmer/expert-support" className="border border-red-300 text-red-700 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-50 transition-colors">
                Request Expert Help
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
