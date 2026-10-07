import { PageHeader, WeatherCard, ChartCard } from '../../components/ui/index';
import { WEATHER } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const conditionEmoji = (c) => {
  if (!c) return '☁️';
  const l = c.toLowerCase();
  if (l.includes('sunny') || l.includes('clear')) return '☀️';
  if (l.includes('heavy rain')) return '⛈️';
  if (l.includes('rain')) return '🌧️';
  if (l.includes('cloud')) return '⛅';
  return '🌤️';
};

const DISEASE_WEATHER_RISKS = [
  { condition: 'High Humidity (>80%) + Rainfall', risk: 'Very High', disease: 'Fungal diseases (Blight, Mildew, Anthracnose)', icon: '🍄' },
  { condition: 'High Temperature (>35°C) + Low Humidity', risk: 'High', disease: 'Pest infestations (Whitefly, Thrips, Spider Mites)', icon: '🦗' },
  { condition: 'Moderate Temp + High Humidity (Night)', risk: 'Moderate', disease: 'Powdery Mildew, Downy Mildew', icon: '🌫️' },
  { condition: 'Low Temp + Wet Conditions', risk: 'High', disease: 'Late Blight (Potato, Tomato)', icon: '🌧️' },
  { condition: 'Dry + Windy Conditions', risk: 'Moderate', disease: 'Soil erosion, Vector-spread diseases', icon: '💨' },
];

export default function WeatherPage() {
  const { current, forecast7Day } = WEATHER;

  const riskColorMap = { 'Very High': 'bg-red-100 text-red-700 border-red-200', High: 'bg-orange-100 text-orange-700 border-orange-200', Moderate: 'bg-amber-100 text-amber-700 border-amber-200', Low: 'bg-green-100 text-green-700 border-green-200' };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Weather & Crop Risk"
        subtitle="Current conditions and weather-based disease risk analysis for your location"
        breadcrumb="Weather"
      />

      {/* Current */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="md:col-span-2 lg:col-span-1">
          <WeatherCard data={current} />
        </div>
        {[
          { label: 'UV Index', value: current.uvIndex, sub: 'Moderate', icon: '☀️', color: 'from-orange-50 to-amber-50 border-amber-100' },
          { label: 'Visibility', value: `${current.visibility} km`, sub: 'Clear conditions', icon: '👁️', color: 'from-blue-50 to-sky-50 border-blue-100' },
          { label: 'Air Pressure', value: `${current.pressure} hPa`, sub: current.pressure > 1013 ? 'High pressure' : 'Low pressure', icon: '🌡️', color: 'from-purple-50 to-violet-50 border-purple-100' },
        ].map((s) => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} border rounded-2xl p-5 flex flex-col justify-between`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500">{s.label}</p>
              <span className="text-2xl">{s.icon}</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800 font-display">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 7-Day Forecast */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-4">7-Day Forecast</h3>
        <div className="grid grid-cols-7 gap-2">
          {forecast7Day.map((day) => (
            <div key={day.day} className={`text-center p-3 rounded-xl border ${day.riskLevel === 'high' ? 'bg-red-50 border-red-200' : day.riskLevel === 'moderate' ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
              <p className="text-xs text-gray-400 font-medium mb-1">{day.day.substring(0, 3)}</p>
              <div className="text-2xl my-1">{conditionEmoji(day.condition)}</div>
              <p className="text-sm font-bold text-gray-800">{day.high}°</p>
              <p className="text-xs text-gray-400">{day.low}°</p>
              <div className="mt-2 text-xs">
                <p className="text-blue-600">💧{day.humidity}%</p>
                <p className="text-blue-400">{day.rainfall}mm</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rainfall Chart */}
      <ChartCard title="Rainfall & Humidity Forecast" subtitle="Next 7 days precipitation and humidity levels">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={forecast7Day}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
            <Bar yAxisId="left" dataKey="rainfall" name="Rainfall (mm)" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="humidity" name="Humidity (%)" fill="#34d399" radius={[4, 4, 0, 0]} opacity={0.7} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Disease-Weather Relationship */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-2">Weather → Disease Risk Relationships</h3>
        <p className="text-xs text-gray-400 mb-4">Understanding how current weather patterns affect crop disease and pest risks.</p>
        <div className="space-y-3">
          {DISEASE_WEATHER_RISKS.map((r) => (
            <div key={r.condition} className={`flex items-start gap-3 p-4 rounded-xl border ${riskColorMap[r.risk] || 'bg-gray-50 border-gray-200'}`}>
              <span className="text-2xl flex-shrink-0">{r.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-semibold text-gray-800">{r.condition}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${riskColorMap[r.risk]}`}>
                    {r.risk} Risk
                  </span>
                </div>
                <p className="text-xs text-gray-600">→ {r.disease}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800">
          <strong>⚠️ Current Condition:</strong> High humidity (82%) + recent rainfall (45mm) = <strong>Elevated fungal disease risk</strong>. Monitor Tomato and Onion crops closely.
        </div>
      </div>
    </div>
  );
}
