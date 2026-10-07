import { Link } from 'react-router-dom';
import {
  ShieldAlert, Users, AlertTriangle, TrendingUp, Map, Megaphone,
  ArrowRight, Activity, MapPin, CheckCircle2, BarChart2
} from 'lucide-react';
import { StatCard, RiskBadge, ChartCard, DataTable, Button } from '../../components/ui/index';
import { OFFICER_ANALYTICS, HOTSPOTS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

export default function OfficerDashboard() {
  const { user } = useAuth();
  const { summary, riskDistribution, cropwiseRisk, districtRisk } = OFFICER_ANALYTICS;

  const districtColumns = [
    { key: 'district', label: 'District' },
    { key: 'riskLevel', label: 'Risk Status', render: (v) => <RiskBadge level={v.toLowerCase()} /> },
    { key: 'reports', label: 'Active Reports', render: (v) => <span className="font-semibold">{v} cases</span> },
    { key: 'crops', label: 'Dominant Vulnerable Crops' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-800 to-purple-800 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-700/60 rounded-full text-xs font-semibold text-purple-200 mb-3 border border-purple-500/30">
            <Activity className="w-3.5 h-3.5 text-purple-300" />
            Regional Agriculture Command Center
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight mb-2">
            Welcome, Officer {user?.name || 'Suresh Deshmukh'} 🏛️
          </h1>
          <p className="text-purple-200 text-xs md:text-sm">
            {user?.designation || 'District Agriculture Officer'} · {user?.region || 'Nashik Division'} · Monitoring 5 Districts & 12,800+ Registered Farmers
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <Link to="/officer/alerts">
              <Button variant="danger" size="sm" className="flex items-center gap-1.5 shadow-lg shadow-red-900/40">
                <Megaphone className="w-4 h-4" /> Broadcast Urgent Advisory
              </Button>
            </Link>
            <Link to="/officer/hotspots">
              <Button variant="secondary" size="sm" className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Map className="w-4 h-4" /> View GIS Hotspots
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Farmers"
          value={summary.totalFarmers.toLocaleString()}
          icon={Users}
          color="blue"
          subtitle={`${summary.activeFarmers.toLocaleString()} active this month`}
        />
        <StatCard
          title="Active Hotspot Zones"
          value={summary.highRiskAreas}
          icon={ShieldAlert}
          color="red"
          subtitle="Early Blight & Purple Blotch"
        />
        <StatCard
          title="Pending Case Inquiries"
          value={summary.pendingRequests}
          icon={AlertTriangle}
          color="amber"
          subtitle="47 awaiting local KVK review"
        />
        <StatCard
          title="Alerts Broadcasted"
          value={summary.alertsSent}
          icon={Megaphone}
          color="purple"
          subtitle="Reaching 11,200+ SMS/Push"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Level Distribution */}
        <ChartCard
          title="Regional Crop Risk Distribution"
          subtitle="Proportion of registered farm acreage under surveillance"
        >
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val.toLocaleString()} acres`, 'Acreage']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(val) => <span className="text-xs text-gray-700">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Crop-wise Vulnerability Breakdown */}
        <ChartCard
          title="Crop-wise Threat Exposure (%)"
          subtitle="Percentage risk classification across key Kharif/Rabi crops"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropwiseRisk} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="crop" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="low" name="Low Risk" stackId="a" fill="#22c55e" />
                <Bar dataKey="moderate" name="Moderate" stackId="a" fill="#f59e0b" />
                <Bar dataKey="high" name="High Risk" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Critical Hotspots Banner */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Active Threat Centers (Priority Action)</h3>
              <p className="text-xs text-gray-400">Automated clusters formed by verified farmer diagnostics</p>
            </div>
          </div>
          <Link to="/officer/hotspots" className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1">
            View All Hotspots <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {HOTSPOTS.slice(0, 3).map(spot => (
            <div key={spot.id} className="p-3.5 rounded-xl border border-red-100 bg-red-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800 text-sm flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" /> {spot.name}
                </span>
                <RiskBadge level={spot.riskLevel} />
              </div>
              <p className="text-xs text-gray-600">
                Primary Issue: <strong className="text-red-700">{spot.disease}</strong> on {spot.crop}
              </p>
              <div className="flex justify-between text-[11px] text-gray-500 pt-1 border-t border-red-100">
                <span>{spot.reports} reports</span>
                <span>{spot.affectedArea} affected</span>
                <span className="text-red-600 capitalize font-medium">{spot.trend} ↑</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* District Risk Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">District Surveillance Ledger</h3>
            <p className="text-xs text-gray-400">Jurisdictional report summary across division</p>
          </div>
          <Link to="/officer/analytics">
            <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
              <BarChart2 className="w-3.5 h-3.5" /> Detailed Trends
            </Button>
          </Link>
        </div>
        <DataTable
          columns={districtColumns}
          data={districtRisk}
        />
      </div>
    </div>
  );
}
