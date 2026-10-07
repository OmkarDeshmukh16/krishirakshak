import { useState } from 'react';
import { Plus, Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { PageHeader, RiskBadge, StatusBadge, Modal, Button } from '../../components/ui/index';
import { EXPERT_REQUESTS } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

const STATUS_STEPS = ['pending', 'under_review', 'completed'];

export default function ExpertSupportPage() {
  const [requests, setRequests] = useState(EXPERT_REQUESTS.filter(r => r.farmerId === 'u1'));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ crop: '', stage: '', problem: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = () => {
    if (!form.crop || !form.problem) {
      addToast('Please fill crop name and problem description', 'error');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const newReq = {
        id: `er${Date.now()}`,
        farmerId: 'u1',
        farmerName: 'Rajesh Patil',
        cropName: form.crop,
        cropStage: form.stage || 'Vegetative',
        problem: form.problem,
        riskLevel: 'moderate',
        aiConfidence: 0,
        aiDisease: 'Not analyzed yet',
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        location: 'Dindori, Nashik',
        expertNote: null,
        additionalNotes: form.notes,
      };
      setRequests(prev => [newReq, ...prev]);
      setForm({ crop: '', stage: '', problem: '', notes: '' });
      setShowForm(false);
      setSubmitting(false);
      addToast('Expert request submitted successfully! An expert will review soon.', 'success');
    }, 1500);
  };

  const statusIcon = (s) => s === 'completed' ? <CheckCircle className="w-4 h-4 text-green-600" /> : s === 'under_review' ? <Clock className="w-4 h-4 text-amber-500" /> : <AlertCircle className="w-4 h-4 text-gray-400" />;

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Expert Support"
        subtitle="Request and track agriculture expert consultations"
        breadcrumb="Expert Support"
        actions={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Request Expert Help
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Requests', value: requests.length, color: 'bg-blue-50 text-blue-700 border-blue-100' },
          { label: 'Under Review', value: requests.filter(r => r.status === 'under_review').length, color: 'bg-amber-50 text-amber-700 border-amber-100' },
          { label: 'Completed', value: requests.filter(r => r.status === 'completed').length, color: 'bg-green-50 text-green-700 border-green-100' },
        ].map((s) => (
          <div key={s.label} className={`${s.color} border rounded-2xl p-4 text-center`}>
            <p className="text-3xl font-bold font-display">{s.value}</p>
            <p className="text-xs font-medium mt-1 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Requests */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  {statusIcon(req.status)}
                  <h3 className="font-bold text-gray-800">{req.cropName} — {req.aiDisease}</h3>
                  <RiskBadge level={req.riskLevel} />
                </div>
                <p className="text-xs text-gray-400">Request ID: {req.id} · {req.date} · {req.location}</p>
              </div>
              <StatusBadge status={req.status} />
            </div>

            {/* Progress */}
            <div className="flex items-center gap-0 mb-4">
              {STATUS_STEPS.map((step, i) => {
                const stepIndex = STATUS_STEPS.indexOf(req.status);
                const isDone = i <= stepIndex;
                const labels = { pending: 'Submitted', under_review: 'Under Review', completed: 'Completed' };
                return (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isDone ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
                        {isDone ? '✓' : i + 1}
                      </div>
                      <p className={`text-xs mt-1 font-medium ${isDone ? 'text-green-700' : 'text-gray-400'}`}>{labels[step]}</p>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 ${i < stepIndex ? 'bg-green-400' : 'bg-gray-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">Problem Description</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2">{req.problem}</p>
              </div>
              {req.aiConfidence > 0 && (
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1">AI Assessment</p>
                  <div className="bg-gray-50 rounded-xl px-3 py-2">
                    <p className="text-sm font-semibold text-gray-800">{req.aiDisease}</p>
                    <p className="text-xs text-gray-500">Confidence: {req.aiConfidence}%</p>
                  </div>
                </div>
              )}
            </div>

            {req.expertNote && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-700 mb-1">🔬 Expert Response</p>
                <p className="text-sm text-blue-800">{req.expertNote}</p>
              </div>
            )}

            {req.status === 'pending' && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs text-amber-700">⏳ Your request is in queue. An expert will be assigned shortly.</p>
              </div>
            )}
          </div>
        ))}

        {requests.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-5xl mb-3">👨‍🔬</p>
            <h3 className="font-semibold text-gray-700 mb-2">No expert requests yet</h3>
            <p className="text-gray-400 text-sm mb-4">Request expert help when you need professional guidance on crop health.</p>
            <Button onClick={() => setShowForm(true)}>Request Expert Help</Button>
          </div>
        )}
      </div>

      {/* Request Form Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Request Expert Help">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800">
            ℹ️ Your request along with your crop data and AI assessment (if available) will be shared with an agriculture expert for professional review.
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Crop *</label>
              <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" value={form.crop} onChange={e => setForm(f => ({ ...f, crop: e.target.value }))}>
                <option value="">Select crop</option>
                {['Tomato', 'Onion', 'Grapes', 'Wheat', 'Potato'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Crop Stage</label>
              <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}>
                <option>Germination</option>
                <option>Vegetative</option>
                <option>Flowering</option>
                <option>Fruiting</option>
                <option>Maturity</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Problem Description *</label>
            <textarea
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              placeholder="Describe the symptoms you are observing... (e.g., yellow leaves, spots, wilting)"
              value={form.problem}
              onChange={e => setForm(f => ({ ...f, problem: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Additional Notes</label>
            <textarea
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              placeholder="Any other observations, recent events, or questions..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
            <Upload className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Attach crop photos (optional)</span>
            <span className="ml-auto text-xs text-gray-400">JPG, PNG · Max 5MB</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSubmit} loading={submitting}>
              Submit Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
