import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users, CheckCircle2, Clock, AlertTriangle, Search, Filter,
  Eye, Check, MessageSquare, ArrowLeft, Send, Sparkles, ShieldAlert,
  Calendar, MapPin, Droplets, Thermometer, CloudRain
} from 'lucide-react';
import { PageHeader, RiskBadge, StatusBadge, Modal, Button } from '../../components/ui/index';
import { EXPERT_REQUESTS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ExpertRequestsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('krishi_expert_requests');
    return saved ? JSON.parse(saved) : EXPERT_REQUESTS;
  });

  const [activeTab, setActiveTab] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState(() => {
    if (id) {
      return requests.find(r => r.id === id) || null;
    }
    return null;
  });

  // Modal / Form state for expert diagnosis
  const [reviewNote, setReviewNote] = useState('');
  const [prescribedAction, setPrescribedAction] = useState('');
  const [verdictStatus, setVerdictStatus] = useState('completed');

  const handleSaveAssessment = (caseId) => {
    if (!reviewNote.trim()) {
      addToast('Please provide an expert diagnosis/advisory note', 'warning');
      return;
    }

    const updated = requests.map(r => {
      if (r.id === caseId) {
        return {
          ...r,
          status: verdictStatus,
          expertNote: reviewNote,
          expertId: user?.id || 'u2',
          prescribedTreatment: prescribedAction,
          resolvedAt: new Date().toISOString().split('T')[0],
        };
      }
      return r;
    });

    setRequests(updated);
    localStorage.setItem('krishi_expert_requests', JSON.stringify(updated));
    addToast('Advisory successfully submitted and dispatched to farmer!', 'success');
    setSelectedCase(null);
    setReviewNote('');
    setPrescribedAction('');
  };

  const filteredRequests = requests.filter(r => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'pending' && r.status === 'pending') ||
      (activeTab === 'under_review' && r.status === 'under_review') ||
      (activeTab === 'completed' && r.status === 'completed');

    const matchesRisk = selectedRisk === 'all' || r.riskLevel === selectedRisk;

    const matchesSearch =
      r.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.aiDisease && r.aiDisease.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesRisk && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Expert Advisory Cases"
        subtitle="Review farmer queries, validate AI predictions, and issue certified agricultural guidance."
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Status Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Cases', count: requests.length },
            { id: 'pending', label: 'Pending', count: requests.filter(r => r.status === 'pending').length },
            { id: 'under_review', label: 'In Review', count: requests.filter(r => r.status === 'under_review').length },
            { id: 'completed', label: 'Resolved', count: requests.filter(r => r.status === 'completed').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.id ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Risk Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search farmer, crop, disease..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 focus:bg-white"
            />
          </div>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk</option>
            <option value="moderate">Moderate Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Cases List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-400 text-sm">No cases match the selected filter criteria.</p>
          </div>
        ) : (
          filteredRequests.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-900 text-base">{item.farmerName}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> {item.location}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {item.date}
                  </span>
                  <RiskBadge level={item.riskLevel} />
                  <StatusBadge status={item.status} />
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 bg-green-50 text-green-800 rounded-lg text-xs font-semibold">
                    {item.cropName} {item.variety ? `(${item.variety})` : ''} · {item.cropStage}
                  </div>
                  {item.aiDisease && (
                    <div className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      AI: {item.aiDisease} ({item.aiConfidence}%)
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <strong className="text-gray-700">Farmer's Observation:</strong> {item.problem}
                </p>

                {item.expertNote && (
                  <div className="text-xs text-blue-800 bg-blue-50/80 p-2.5 rounded-xl border border-blue-100 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Expert Diagnosis: </span>
                      {item.expertNote}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex md:flex-col items-end justify-between md:justify-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                <Button
                  variant={item.status === 'completed' ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => {
                    setSelectedCase(item);
                    setReviewNote(item.expertNote || '');
                    setPrescribedAction(item.prescribedTreatment || '');
                    setVerdictStatus(item.status === 'completed' ? 'completed' : 'completed');
                  }}
                  className="flex items-center gap-1.5 w-full md:w-auto"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {item.status === 'completed' ? 'View Advisory' : 'Review & Prescribe'}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {selectedCase && (
        <Modal
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
          title={`Clinical Assessment — Case #${selectedCase.id}`}
        >
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {/* Farmer & Field Metadata Card */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{selectedCase.farmerName}</h4>
                  <p className="text-xs text-gray-500">{selectedCase.location} · {selectedCase.soilType}</p>
                </div>
                <RiskBadge level={selectedCase.riskLevel} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-200/60 text-xs text-gray-600">
                <div>
                  <span className="text-gray-400 block text-[10px]">Crop / Variety</span>
                  <span className="font-semibold text-gray-800">{selectedCase.cropName} ({selectedCase.variety})</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Growth Stage</span>
                  <span className="font-semibold text-gray-800">{selectedCase.cropStage}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Reported On</span>
                  <span className="font-semibold text-gray-800">{selectedCase.date}</span>
                </div>
              </div>

              {/* Weather conditions at time of complaint */}
              {selectedCase.weather && (
                <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                  <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-amber-500" /> {selectedCase.weather.temp}°C</span>
                  <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-500" /> {selectedCase.weather.humidity}% Humidity</span>
                  <span className="flex items-center gap-1"><CloudRain className="w-3.5 h-3.5 text-cyan-600" /> {selectedCase.weather.rainfall}mm Rain</span>
                </div>
              )}
            </div>

            {/* AI Diagnosis Insights */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" /> AI Preliminary Diagnosis
                </span>
                <span className="text-xs font-semibold text-amber-800">
                  Confidence: {selectedCase.aiConfidence}%
                </span>
              </div>
              <p className="text-sm font-semibold text-amber-950">{selectedCase.aiDisease || 'Unspecified Condition'}</p>
              <p className="text-xs text-amber-800/90 mt-1">
                Farmer notes: "{selectedCase.problem}"
              </p>
            </div>

            {/* Photos */}
            {selectedCase.images && selectedCase.images.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Uploaded Crop Photos</label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {selectedCase.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Crop disease sample"
                      className="w-36 h-28 object-cover rounded-xl border border-gray-200 shadow-sm"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Expert Prescription Form */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Official Diagnosis & Pathological Assessment *
                </label>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Detail the confirmed disease/pest, severity evaluation, and immediate cultural measures..."
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Prescribed Treatment & Spray Recommendation
                </label>
                <textarea
                  rows={2}
                  value={prescribedAction}
                  onChange={(e) => setPrescribedAction(e.target.value)}
                  placeholder="e.g. Copper Oxychloride 50 WP @ 2.5g/L water, or Neem oil 1500 ppm @ 5ml/L, preventive spacing..."
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-gray-700">Update Case Status:</label>
                <select
                  value={verdictStatus}
                  onChange={(e) => setVerdictStatus(e.target.value)}
                  className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50 text-gray-800 font-medium"
                >
                  <option value="under_review">Keep Under Review</option>
                  <option value="completed">Mark as Resolved & Dispatched</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedCase(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSaveAssessment(selectedCase.id)}
                className="flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Submit Official Advisory
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
