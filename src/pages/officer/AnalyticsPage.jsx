import { useState } from 'react';
import {
  BarChart3, TrendingUp, Calendar, Download, Filter,
  ShieldAlert, Activity, CheckCircle2, FileText, Share2
} from 'lucide-react';
import { PageHeader, ChartCard, RiskBadge, Button } from '../../components/ui/index';
import { OFFICER_ANALYTICS } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

export default function AnalyticsPage() {
  const { addToast } = useToast();
  const [timeRange, setTimeRange] = useState('6m');
  const [selectedCrop, setSelectedCrop] = useState('all');

  const { riskTrend, diseaseDistribution, cropwiseRisk, summary } = OFFICER_ANALYTICS;

  const handleExport = () => {
    addToast('Surveillance Analytics Report compiled and ready for PDF download', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Epidemiological Crop Analytics"
          subtitle="Longitudinal trend analysis of pest outbreaks, disease containment, and seasonal vulnerabilities."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Department Report (PDF)
          </Button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Surveillance Window:
          </span>
          {['1m', '3m', '6m', '1y'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                timeRange === range
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>Overall Resolution Rate: <strong className="text-green-600 font-bold">88.4%</strong></span>
          <span>•</span>
          <span>Avg Response Time: <strong className="text-gray-800 font-bold">18 hrs</strong></span>
        </div>
      </div>

      {/* Main Longitudinal Trend Chart */}
      <ChartCard
        title="Monthly Outbreak & Resolution Trajectory"
        subtitle="Comparing newly filed farmer reports, early alerts dispatched, and confirmed resolved cases"
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={riskTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="reports" name="Reported Infections" stroke="#ef4444" fillOpacity={1} fill="url(#colorReports)" strokeWidth={2} />
              <Area type="monotone" dataKey="resolved" name="Cases Resolved" stroke="#22c55e" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={2} />
              <Area type="monotone" dataKey="alerts" name="Officer Alerts" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorAlerts)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Two-Column Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dominant Pathogen Distribution */}
        <ChartCard
          title="Prevalent Pathogen Incidence (%)"
          subtitle="Distribution of identified diseases across analyzed farmer submissions"
        >
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={diseaseDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {diseaseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`${v}% of incidents`, 'Share']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Seasonal Vulnerability Matrix */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Key Epidemiological Observations</h3>
              <p className="text-xs text-gray-400">Automated intelligence generated from multi-source farmer logs</p>
            </div>
            <Activity className="w-5 h-5 text-purple-600" />
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-red-50/70 border border-red-100 rounded-xl space-y-1">
              <span className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> High Risk Period: August – October
              </span>
              <p className="text-xs text-gray-600">
                Heavy monsoon humidity spike (&gt;80%) correlated directly with 3x increase in Early Blight on Solanaceae crops.
              </p>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl space-y-1">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Emerging Sucking Pest Spike
              </span>
              <p className="text-xs text-gray-600">
                Whitefly populations in Niphad and Dindori expanding to younger grape plantations. Early yellow trap deployments recommended.
              </p>
            </div>

            <div className="p-3 bg-green-50/70 border border-green-100 rounded-xl space-y-1">
              <span className="text-xs font-bold text-green-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Containment Success in Kolhapur
              </span>
              <p className="text-xs text-gray-600">
                Sugarcane Red Rot reports down by 42% following prompt quarantine advisory and bio-fungicide distribution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
