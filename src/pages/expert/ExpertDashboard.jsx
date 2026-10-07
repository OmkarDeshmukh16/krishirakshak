import { Link } from 'react-router-dom';
import { Users, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { StatCard, RiskBadge, StatusBadge, DataTable } from '../../components/ui/index';
import { EXPERT_REQUESTS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export default function ExpertDashboard() {
  const { user } = useAuth();
  const allReqs = EXPERT_REQUESTS;
  const pending = allReqs.filter(r => r.status === 'pending');
  const underReview = allReqs.filter(r => r.status === 'under_review');
  const completed = allReqs.filter(r => r.status === 'completed');

  const columns = [
    { key: 'farmerName', label: 'Farmer' },
    { key: 'cropName', label: 'Crop' },
    { key: 'location', label: 'Location' },
    { key: 'riskLevel', label: 'Risk', render: (v) => <RiskBadge level={v} /> },
    { key: 'aiConfidence', label: 'AI Conf.', render: (v) => v > 0 ? `${v}%` : '-' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-cyan-700 text-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold font-display mb-1">Expert Dashboard 👨‍🔬</h1>
        <p className="text-blue-200 text-sm">{user?.name} · {user?.specialization}</p>
        <p className="text-blue-300 text-xs mt-1">{user?.institution} · {user?.district}, Maharashtra</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Cases" value={allReqs.length} icon={Users} color="blue" />
        <StatCard title="New Requests" value={pending.length} icon={AlertCircle} color="red" subtitle="Awaiting assignment" />
        <StatCard title="Under Review" value={underReview.length} icon={Clock} color="amber" subtitle="Being reviewed" />
        <StatCard title="Completed" value={completed.length} icon={CheckCircle} color="green" />
      </div>

      {/* Urgent Cases */}
      {pending.filter(r => r.riskLevel === 'high').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Urgent Cases — High Risk
          </h3>
          <div className="space-y-3">
            {pending.filter(r => r.riskLevel === 'high').map(req => (
              <div key={req.id} className="flex items-center justify-between bg-white rounded-xl p-3 border border-red-200">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{req.farmerName} — {req.cropName}</p>
                  <p className="text-xs text-gray-500">{req.aiDisease} · {req.location} · {req.date}</p>
                </div>
                <Link to={`/expert/requests/${req.id}`} className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors">
                  Review Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Cases Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">All Case Requests</h3>
          <Link to="/expert/requests" className="text-xs text-green-600 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <DataTable
          columns={columns}
          data={allReqs}
          onRowClick={(row) => window.location.href = `/expert/requests/${row.id}`}
        />
      </div>

      {/* Expert Info */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-5">
        <h3 className="font-semibold text-blue-800 mb-3">Your Expert Profile</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: 'Cases Handled', value: user?.casesHandled || 342 },
            { label: 'Success Rate', value: user?.successRate || '94%' },
            { label: 'Experience', value: user?.experience || '12 years' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-3 text-center border border-blue-100">
              <p className="text-2xl font-bold text-blue-700 font-display">{s.value}</p>
              <p className="text-xs text-blue-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
